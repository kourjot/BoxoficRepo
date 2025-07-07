import * as ERROR from "../common/error_message.js";


const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      //  Not allowed
      throw new Error(ERROR.ACCESS_DENIED);
    }

    next(); // Role is allowed
  };
};

export { authorizeRoles };