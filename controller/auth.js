import {User} from "../model/user.js";
import jwt from "jsonwebtoken";
import * as ERROR from "../common/error_message.js";

import argon2  from "argon2"
import "dotenv/config";

const signIn = async (req, res, next) => {
  const { name, email, password, phoneNumber, role } = req.body;

  try {
    // 🔍 Basic validation
    if (!name) throw new Error(ERROR.NAME);
    if (!email) throw new Error(ERROR.EMAIL);
    if (!password) throw new Error(ERROR.PASSWORD);
    
    // ❗ Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) throw new Error(ERROR.ACCOUNT_ALREADY_EXISTS);

    // 🔐 Hash the password
    const hash = await argon2.hash(password);

    // 👤 Create user
    const newUser = new User({
      name,
      email,
      password: hash,
      phoneNumber,
      role: role 
    });

    await newUser.save();

    return res.status(201).json({ massage: "User registered successfully" });

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

    res.status(200).json({ massage: "Logged in successfully", token });
  } catch (err) {
    next(err); // Let the global error handler catch it
  }
};
export { signIn, login };