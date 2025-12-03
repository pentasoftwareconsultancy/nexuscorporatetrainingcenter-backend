import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../../models/users/user.model.js";

// for register function
export const signup = async (req, res) => {
  try {
    const { emailOrPhone, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { emailOrPhone } });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      emailOrPhone,
      password: hashedPassword,
      role: role || "user",
    });

    res
      .status(201)
      .json({ message: "User registered successfully", userId: newUser.id });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// for login function
export const login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    // Find user by email or phone
    const user = await User.findOne({ where: { emailOrPhone } });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET
    );

    res.status(200).json({
      message: "Login Succesfull",
      token,
      id: user.id,
      role: user.role,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { emailOrPhone } = req.body;

    const user = await User.findOne({ where: { emailOrPhone } });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Create token valid for 15 minutes
    const resetToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    await user.update({
      resetToken,
      resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000),
    });

    return res.json({
      success: true,
      message: "Reset token generated",
      resetToken, 
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({ where: { resetToken: token } });
    if (!user) return res.status(400).json({ message: "Invalid token" });

    if (user.resetTokenExpiry < new Date()) {
      return res.status(400).json({ message: "Token expired" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await user.update({
      password: hashed,
      resetToken: null,
      resetTokenExpiry: null,
    });

    return res.json({ success: true, message: "Password reset successful" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Old password incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);

    await user.update({ password: hashed });

    return res.json({ success: true, message: "Password changed successfully" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
