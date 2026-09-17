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
    minlength: 6,
    select: false,
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
