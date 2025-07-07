import jwt from "jsonwebtoken"
import "dotenv/config"

import * as ERROR from "../common/error_message.js";  // adjust path as needed

const tokenVerify = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  try {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error(ERROR.TOKEN_MISSING);
    }

    const token = authHeader.split(" ")[1];
    const verification = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!verification) throw new Error(ERROR.TOKEN_INVALID);

    req.user = verification;
    next();
  } catch (err) {
    next(err); // ✅ Forward to global error handler
  }
};

export { tokenVerify };
