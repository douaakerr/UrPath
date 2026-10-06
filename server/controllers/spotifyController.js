import crypto from "crypto";
import User from "../models/User.js";

const SPOTIFY_AUTHORIZE_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_URL = "https://api.spotify.com/v1";

const SPOTIFY_SCOPES = [
  "user-read-private",
  "user-read-email",
  "streaming",
  "user-read-playback-state",
  "user-modify-playback-state",
].join(" ");

const getSpotifyCredentials = () => {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI } =
    process.env;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REDIRECT_URI) {
    throw new Error("Spotify environment variables are missing");
  }

  return {
    clientId: SPOTIFY_CLIENT_ID,
    clientSecret: SPOTIFY_CLIENT_SECRET,
    redirectUri: SPOTIFY_REDIRECT_URI,
  };
};

const createState = () => {
  return crypto.randomBytes(32).toString("hex");
};

const getSpotifyAccessToken = async (userId, forceRefresh = false) => {
  const user = await User.findById(userId).select(
    "+spotifyAccessToken +spotifyRefreshToken +spotifyTokenExpiresAt",
  );

  if (!user) {
    return null;
  }

  const tokenIsValid =
    user.spotifyAccessToken &&
    user.spotifyTokenExpiresAt > new Date(Date.now() + 60_000);

  if (!forceRefresh && tokenIsValid) {
    return user.spotifyAccessToken;
  }

  if (!user.spotifyRefreshToken) {
    return null;
  }

  const { clientId, clientSecret } = getSpotifyCredentials();
  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: user.spotifyRefreshToken,
    }),
  });
  const tokenData = await response.json();

  if (!response.ok || !tokenData.access_token) {
    return null;
  }

  const tokenUpdate = {
    spotifyAccessToken: tokenData.access_token,
    spotifyTokenExpiresAt: new Date(
      Date.now() + (tokenData.expires_in || 3600) * 1000,
    ),
  };

  if (tokenData.refresh_token) {
    tokenUpdate.spotifyRefreshToken = tokenData.refresh_token;
  }

  await User.updateOne({ _id: userId }, { $set: tokenUpdate });
  return tokenData.access_token;
};

export const spotifyLogin = (req, res) => {
  try {
    const { clientId, redirectUri } = getSpotifyCredentials();

    const state = createState();

    res.cookie("spotify_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 10 * 60 * 1000,
    });

    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      scope: SPOTIFY_SCOPES,
      redirect_uri: redirectUri,
      state,
      show_dialog: "true",
    });

    return res.redirect(`${SPOTIFY_AUTHORIZE_URL}?${params.toString()}`);
  } catch (error) {
    console.error("Spotify login error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not start Spotify login",
    });
  }
};

export const spotifyCallback = async (req, res) => {
  try {
    const { code, state, error } = req.query;

    if (error) {
      console.error("Spotify authorization error:", error);

      return res.redirect(`${process.env.FRONTEND_URL}/focus?spotify=denied`);
    }

    if (!code || !state) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/focus?spotify=missing_code`,
      );
    }

    const savedState = req.cookies.spotify_oauth_state;

    if (!savedState || savedState !== state) {
      res.clearCookie("spotify_oauth_state");
      return res.redirect(
        `${process.env.FRONTEND_URL}/focus?spotify=invalid_state`,
      );
    }

    const { clientId, clientSecret, redirectUri } = getSpotifyCredentials();

    const tokenResponse = await fetch(SPOTIFY_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Spotify token error:", tokenData);

      return res.redirect(
        `${process.env.FRONTEND_URL}/focus?spotify=token_error`,
      );
    }

    const tokenUpdate = {
      spotifyAccessToken: tokenData.access_token,
      spotifyTokenExpiresAt: new Date(
        Date.now() + (tokenData.expires_in || 3600) * 1000,
      ),
    };

    if (tokenData.refresh_token) {
      tokenUpdate.spotifyRefreshToken = tokenData.refresh_token;
    }

    await User.updateOne({ _id: req.user._id }, { $set: tokenUpdate });
    res.clearCookie("spotify_oauth_state");

    return res.redirect(`${process.env.FRONTEND_URL}/focus?spotify=connected`);
  } catch (error) {
    console.error("Spotify callback error:", error);

    return res.redirect(`${process.env.FRONTEND_URL}/focus?spotify=error`);
  }
};

// GET /api/v1/spotify/me
export const spotifyMe = async (req, res) => {
  try {
    let accessToken = await getSpotifyAccessToken(req.user._id);

    if (!accessToken) {
      return res.status(401).json({
        connected: false,
        message: "Spotify is not connected",
      });
    }

    let response = await fetch(`${SPOTIFY_API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status === 401) {
      accessToken = await getSpotifyAccessToken(req.user._id, true);

      if (accessToken) {
        response = await fetch(`${SPOTIFY_API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }
    }

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        connected: false,
        message: data.error?.message || "Spotify request failed",
      });
    }

    return res.status(200).json({
      connected: true,
      user: {
        id: data.id,
        displayName: data.display_name,
        email: data.email,
        product: data.product,
        images: data.images,
      },
    });
  } catch (error) {
    console.error("Spotify me error:", error);

    return res.status(500).json({
      connected: false,
      message: "Could not get Spotify profile",
    });
  }
};

export const spotifyLogout = async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.user._id },
      {
        $unset: {
          spotifyAccessToken: 1,
          spotifyRefreshToken: 1,
          spotifyTokenExpiresAt: 1,
        },
      },
    );

    res.clearCookie("spotify_oauth_state");

    return res.status(200).json({
      success: true,
      message: "Spotify disconnected",
    });
  } catch (error) {
    console.error("Spotify logout error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not disconnect Spotify",
    });
  }
};
