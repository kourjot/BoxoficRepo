

import "dotenv/config";
import {User} from "../model/user.js";
import jwt from "jsonwebtoken";

import * as  ERROR  from "../common/error_message.js";

const googleLogin = async (req, res, next) => {
  try {
    const { name, email, picture, sub: socialId } = req.body;

    if (!email || !socialId) {
      throw new Error(ERROR.GOOGLE_AUTH_MISSING);
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if not found
      user = new User({
        name,
        email,
        picture,
        socialId,
        isGoogleUser: true,
      });

      await user.save();
    }

    // Generate JWT Token
    const token = jwt.sign(
          {
            username: user.name,
            email: user.email,
            userId: user._id,
            role: user.role,
          },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "7d" }
        );

    return res.status(200).json({
      massage: "Google login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        picture: user.picture,
        organization: user.isOrganization,
        role: user.role,
        _id: user._id,
     },
    });
  } catch (error) {
    next(error); // pass error to global error handler
  }
};

export { googleLogin };
