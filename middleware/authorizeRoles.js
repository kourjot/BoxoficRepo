const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    // console.log("User Role:", userRole); 

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied: insufficient permissions" });
    }

    next(); // Role is allowed
  };
};

export default authorizeRoles;
