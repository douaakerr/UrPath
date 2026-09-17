import User from "../models/User.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "_id name email role profilePhoto authProvider onboardingCompleted"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2 || trimmedName.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 50 characters",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: trimmedName,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select(
      "_id name email role profilePhoto authProvider onboardingCompleted"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile photo is required",
      });
    }

    const imageBase64 = req.file.buffer.toString("base64");

    const imageUrl = `data:${req.file.mimetype};base64,${imageBase64}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        profilePhoto: imageUrl,
      },
      {
        new: true,
      }
    ).select(
      "_id name email role profilePhoto authProvider onboardingCompleted"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile photo updated successfully",
      user,
    });
  } catch (error) {
    console.error("Upload profile photo error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to upload profile photo",
    });
  }
};

export const deleteProfilePhoto = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        profilePhoto: null,
      },
      {
        new: true,
      }
    ).select(
      "_id name email role profilePhoto authProvider onboardingCompleted"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile photo removed successfully",
      user,
    });
  } catch (error) {
    console.error("Delete profile photo error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to remove profile photo",
    });
  }
};