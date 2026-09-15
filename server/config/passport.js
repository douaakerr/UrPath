import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import "dotenv/config";
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(
            new Error("Google account does not provide an email")
          );
        }

        const normalizedEmail = email.toLowerCase().trim();

        let user = await User.findOne({
          email: normalizedEmail,
        });

        if (!user) {
          user = await User.create({
            name: profile.displayName || "UrPath User",
            email: normalizedEmail,
            authProvider: "google",
            providerId: profile.id,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;