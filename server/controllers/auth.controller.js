import bcrypt from "bcrypt";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

//Login

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id.toString());

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

//logout
export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  return res.status(200).json({
    message: "Logout successful",
  });
}; 


export const changePassword = async (req, res) => {
  try {

    const {
      oldPassword,
      newPassword,
    } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message:
          "Old and new passwords are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "New password must be at least 6 characters long",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      oldPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Old password is incorrect",
      });
    }

    user.password = await bcrypt.hash(
      newPassword,
      12
    );

    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: "Error changing password",
      error: error.message,
    });

  }
};


// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

   
    if (!user) {
      return res.status(200).json({
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }


    const resetToken = crypto.randomBytes(32).toString("hex");

    
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await user.save();

    
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset your SkillForge password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          
          <h2>Reset your password</h2>

          <p>Hello ${user.name},</p>

          <p>
            We received a request to reset your SkillForge password.
          </p>

          <p>
            Click the button below to create a new password:
          </p>

          <a
            href="${resetUrl}"
            style="
              display: inline-block;
              padding: 12px 24px;
              background-color: #6d28d9;
              color: white;
              text-decoration: none;
              border-radius: 8px;
              margin: 10px 0;
            "
          >
            Reset Password
          </a>

          <p>
            This link will expire in <strong>15 minutes</strong>.
          </p>

          <p>
            If you did not request a password reset,
            you can safely ignore this email.
          </p>

        </div>
      `,
    });

    return res.status(200).json({
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });

  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      message: "Failed to process password reset request",
    });
  }
};


// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Reset token is required",
      });
    }

    if (!newPassword) {
      return res.status(400).json({
        message: "New password is required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
      });
    }

    
    const hashedPassword = await bcrypt.hash(
      newPassword,
      12
    );

    user.password = hashedPassword;

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    return res.status(200).json({
      message: "Password reset successfully",
    });

  } catch (error) {
    console.error("Reset password error:", error);

    
    return res.status(500).json({
      message: "Failed to reset password",
    });
  }
};