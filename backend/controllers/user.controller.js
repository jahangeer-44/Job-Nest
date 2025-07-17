import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import { v2 as cloudinary } from "cloudinary";

// Register User
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists.",
        success: false,
      });
    }

    let profilePhotoUrl = null;
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const upload = await cloudinary.uploader.upload(fileUri.content);
      profilePhotoUrl = upload.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: profilePhotoUrl,
      },
    });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(403).json({
        message: "Account doesn't exist with the selected role.",
        success: false,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true, // Use true in HTTPS environments
        sameSite: "none", // Required for cross-origin cookies
      })
      .json({
        message: `Welcome back, ${user.fullname}`,
        success: true,
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          profile: user.profile,
        },
      });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

// Logout User
export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        maxAge: 0,
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .json({
        message: "Logged out successfully.",
        success: true,
      });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;

    const user = await User.findById(req.id); // req.id should be set by auth middleware

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;

    if (skills) {
      user.profile.skills = skills.split(",").map((skill) => skill.trim());
    }

    if (req.file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          message: "Only JPG, JPEG, or PNG images are allowed for resume.",
          success: false,
        });
      }

      const fileUri = getDataUri(req.file);
      const upload = await cloudinary.uploader.upload(fileUri.content, {
        folder: "resumes", // Optional: folder in Cloudinary
        resource_type: "image",
      });

      user.profile.resume = upload.secure_url;
      user.profile.resumeOriginalName = req.file.originalname;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully.",
      success: true,
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};
