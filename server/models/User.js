import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    minlength: 8,
    select: false,
  },

  profilePhoto: {
  type: String,
  default: null,
},

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },

  providerId: {
    type: String,
    default: null,
  },

  spotifyAccessToken: {
    type: String,
    select: false,
  },

  spotifyRefreshToken: {
    type: String,
    select: false,
  },

  spotifyTokenExpiresAt: {
    type: Date,
    select: false,
  },

  onboardingCompleted: {
    type: Boolean,
    default: false,
  },

  lastActivityAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

const User = mongoose.model("User", userSchema);

export default User;
