import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(403).json({
        message: "No token provided",
      });
    }
    const decoded = jwt.verify(token, `${process.env.JWT_Token}`);
    if (decoded?._id) {
      const user = await User.findById(decoded?._id).select("-password");
      req.user = user;
      next();
    } else {
      return res.status(403).json({
        message: "Invalid token",
      });
    }
  } catch (error) {
    console.log("isAuth", error);
    return res.status(403).json({
      message: "No token provided",
    });
  }
};
