import generateToken from "../utils/generateToken.js";

export const googleCallback = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/login?oauth=failed`
      );
    }

    const token = generateToken(user._id.toString());

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const destination = user.onboardingCompleted
      ? "/dashboard"
      : "/onboarding";

    return res.redirect(
      `${process.env.FRONTEND_URL}${destination}`
    );
  } catch (error) {
    console.error("Google OAuth callback error:", error);

    return res.redirect(
      `${process.env.FRONTEND_URL}/login?oauth=failed`
    );
  }
};