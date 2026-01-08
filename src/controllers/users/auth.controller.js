import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/users/user.model.js";
import { Op } from "sequelize";

/* REGISTER */
export const register = async (req, res) => {
  try {
    const {
      userName,
      emailOrPhone,
      phoneNumber,
      password,
      confirmPassword,
      role,
      passwordRecoveryQuestion,
      passwordRecoveryAnswer,
    } = req.body;

    /* Required field check */
    if (!userName || !emailOrPhone || !phoneNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    /* Password match check */
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    /* Check existing user (email OR phone) */
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ emailOrPhone }, { phoneNumber }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email or phone number",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const hashedAnswer = passwordRecoveryAnswer
      ? await bcrypt.hash(passwordRecoveryAnswer, 12)
      : null;

    const user = await User.create({
      userName,
      emailOrPhone,
      phoneNumber,
      password: hashedPassword,
      role,
      passwordRecoveryQuestion,
      passwordRecoveryAnswer: hashedAnswer,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        userName: user.userName,
        emailOrPhone: user.emailOrPhone,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
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

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        userName: user.userName,
        emailOrPhone: user.emailOrPhone,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
    });
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
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

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
    const { resetToken, newPassword, confirmPassword } = req.body;

    // 1️⃣ Validate input
    if (!resetToken || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 2️⃣ Match passwords
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // 3️⃣ Verify token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // 4️⃣ Find user
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 5️⃣ Hash & update password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    return res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);
    return res.status(500).json({ message: "Error resetting password" });
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
      attributes: [
        "id",
        "userName",
        "emailOrPhone",
        "phoneNumber",
        "role",
        "createdAt",
      ],
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

/* ADMIN UPDATE USER */
export const updateUserByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, emailOrPhone, phoneNumber, role, password } = req.body;

    // 1️⃣ Check user exists
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ 🔒 Check duplicate email or phone (EXCEPT current user)
    if (emailOrPhone || phoneNumber) {
      const existingUser = await User.findOne({
        where: {
          id: { [Op.ne]: id },
          [Op.or]: [
            emailOrPhone ? { emailOrPhone } : null,
            phoneNumber ? { phoneNumber } : null,
          ].filter(Boolean),
        },
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Email or phone already in use by another user",
        });
      }
    }

    // 3️⃣ Prepare update data
    const updatedData = {};

    if (userName) updatedData.userName = userName;
    if (emailOrPhone) updatedData.emailOrPhone = emailOrPhone;
    if (phoneNumber) updatedData.phoneNumber = phoneNumber;
    if (role) updatedData.role = role;

    if (password) {
      updatedData.password = await bcrypt.hash(password, 12);
    }

    // 4️⃣ Update user
    await User.update(updatedData, { where: { id } });

    res.json({
      message: "User updated successfully by admin",
      updatedFields: Object.keys(updatedData),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
};

/* GET LOGGED IN USER (USING TOKEN) */
export const getLoggedInUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: [
        "id",
        "userName",
        "emailOrPhone",
        "phoneNumber",
        "role",
        "createdAt",
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Logged in user fetched",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching logged in user",
      error: error.message,
    });
  }
};
