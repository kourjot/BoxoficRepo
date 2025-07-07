import {User} from "../model/user.js";
import jwt from "jsonwebtoken";
import * as ERROR from "../common/error_message.js";
import { sendSuccess} from "../utils/responseHandler.js";
import argon2  from "argon2"
import "dotenv/config";

const signIn = async (req, res, next) => {
  const { name, email, password, phoneNumber, role } = req.body;

  // console.log(name, email, password);
  try {
    // 🔍 Basic validation
    if (!name) throw new Error(ERROR.NAME);
    if (!email) throw new Error(ERROR.EMAIL);
    if (!password) throw new Error(ERROR.PASSWORD);
    
    // ❗ Check if user already exists
    // console.log(name)
    const userExists = await User.findOne({ email });
    // console.log(userExists)
    if (userExists) throw new Error(ERROR.ACCOUNT_ALREADY_EXISTS);

    // 🔐 Hash the password
    const hash = await argon2.hash(password);
    // console.log(hash);

    // 👤 Create user
    const newUser = new User({
      name,
      email,
      password: hash,
      phoneNumber,
      role: role 
    });
    // console.log(newUser);
    // console.log(userExists.name)
    const token = jwt.sign(
      {
        username: newUser.name,
        email: newUser.email,
        userId: newUser._id,
        role: newUser.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    // console.log(token);

    await newUser.save();

    return res.status(201).json({
      message: "User registered  successfully",
      token,
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isOrganization: newUser.isOrganization,
        _id: newUser._id,
      },
    });
  } catch (err) {
    next(err); // ✅ Send to global error handler
  }
};


const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email) throw new Error(ERROR.EMAIL);
    if (!password) throw new Error(ERROR.PASSWORD);

    const userExists = await User.findOne({ email });
    if (!userExists) throw new Error(ERROR.USER_NOT_FOUND);

    const valid = await argon2.verify(userExists.password, password);
    if (!valid) throw new Error(ERROR.INVALID_CREDENTIALS);

    const token = jwt.sign(
      {
        username: userExists.name,
        email: userExists.email,
        userId: userExists._id,
        role: userExists.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    
    return res.status(201).json({
      message:  "Logged in successfully",
      token,
      user: {
        name: userExists.name,
        email:userExists.email,
        role: userExists.role,
        isOrganization: userExists.isOrganization,
        _id: userExists._id,
      },
    });
  } catch (err) {
    next(err); // Let the global error handler catch it
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("organization") // <-- This line will only work if User schema has organization ref
      .select("-password");

    if (!user) {
      throw new Error(ERROR.USER_NOT_FOUND);
    }

    return sendSuccess(res, "User fetched successfully", user);
  } catch (err) {
    next(err);
  }
};

export { signIn, login,getUserById };