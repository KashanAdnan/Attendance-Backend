import jwt from "jsonwebtoken";
import config from "../config/config.mjs";
import { student_model } from "../model/student_model.mjs";

const isAuthenticateUser = async (req, res, next) => {
  const token = req.body.student_token;
  if (!token) {
    res.status(401).json({
      scuccess: false,
      message: "Please Login To Acess This Resource",
    });
    return;
  }
  const decodedData = jwt.verify(token, config.JWTSecret);
  req.user = await student_model.findById(decodedData.id);

  next();
};
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(401).json({
        scuccess: false,
        message: "Student Role is Not  Allowed To use this",
      });
      return;
    }
    next();
  };
};

export default {
  isAuthenticateUser,
  authorizeRole,
};
