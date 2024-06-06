const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

require("dotenv").config();

exports.authMiddleware = (...requiredRoles) => {
  return (req, res, next) => {
    let authorization = req.headers["authorization"];
    let token = authorization?.split(" ")[1];
    // console.log(authorization)

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      // console.log(token)
      if (err) {
        res.status(401).json({ status: "unauthorized" });
        // console.log(err)
      } else {
        const userId = decoded["userId"];
        const role = decoded["role"];
        req.headers.userId = userId;
        req.headers.role = role;

        // console.log(role)
        if (requiredRoles.length && !requiredRoles.includes(role)) {
          return next(new AppError(401, "You are not permitted!"));
        }

        next();
      }
    });
  };
};
