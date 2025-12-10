import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/users/user.model.js";

/* REGISTER */
export const register = async (req, res) => {
  try {
    const {
      emailOrPhone,
      password,
      confirmPassword,
      role,
      passwordRecoveryQuestion,
      passwordRecoveryAnswer,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const hashedAnswer = await bcrypt.hash(passwordRecoveryAnswer, 12);

    const user = await User.create({
      emailOrPhone,
      password: hashedPassword,
      role,
      passwordRecoveryQuestion,
      passwordRecoveryAnswer: hashedAnswer,
    });

    res.json({ message: "User registered", user });
  } catch (error) {
    res.status(500).json({ message: "Error registering", error });
  }
};

/* LOGIN */
export const login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    const user = await User.findOne({ where: { emailOrPhone } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

/* CHANGE PASSWORD - LOGGED IN */
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    // 🔥 Confirm password must match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    const user = await User.findByPk(req.user.id);

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match)
      return res.status(400).json({ message: "Incorrect old password" });

    const hashed = await bcrypt.hash(newPassword, 12);

    await User.update({ password: hashed }, { where: { id: req.user.id } });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing password", error });
  }
};

/* FORGOT PASSWORD - STEP 1 */
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { emailOrPhone: req.body.emailOrPhone },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "Recovery question",
      question: user.passwordRecoveryQuestion,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching question", error });
  }
};

/* VERIFY ANSWER - STEP 2 */
export const verifyRecoveryAnswer = async (req, res) => {
  try {
    const { emailOrPhone, answer } = req.body;

    const user = await User.findOne({ where: { emailOrPhone } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(answer, user.passwordRecoveryAnswer);
    if (!match) return res.status(400).json({ message: "Wrong answer" });

    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    res.json({ message: "Verified", resetToken });
  } catch (error) {
    res.status(500).json({ message: "Error verifying answer", error });
  }
};

/* RESET PASSWORD - STEP 3 */
export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

    const hashed = await bcrypt.hash(newPassword, 12);

    await User.update({ password: hashed }, { where: { id: decoded.id } });

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error resetting password", error });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { page, limit, offset } = req;

    const where = {};

    if (req.query.role) {
      where.role = req.query.role;
    }

    if (req.query.email) {
      where.emailOrPhone = req.query.email;
    }

    const users = await User.findAndCountAll({
      where,
      attributes: ["id", "emailOrPhone", "role", "createdAt"],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      message: "Users fetched successfully",
      total: users.count,
      page,
      limit,
      data: users.rows,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
};
