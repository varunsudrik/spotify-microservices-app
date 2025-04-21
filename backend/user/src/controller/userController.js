import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";
import { signUpSchema, LoginSchema } from "../validator/userSchema.js";

export const registerUser = async (req, res) => {
  try {
    const parsed = signUpSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: false,
        message: "Invalid request data",
      });
    }

    let { name, password, email } = req.body;
    let userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        message: "User Already Exist",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    if (createUser) {
      const token = jwt.sign(
        {
          _id: createUser._id,
        },
        process.env.JWT_Token,
        { expiresIn: "24h" }
      );
      const userObj = createUser.toObject();
      delete userObj.password;

      return res.status(201).json({
        message: "User Registered",
        createUser: userObj,
        token,
      });
    }
  } catch (error) {
    console.log("registerUser error:", error);
  }
};
export const LoginUser = async (req, res) => {
  try {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        status: false,
        message: "Invalid request data",
      });
    }

    let { password, email } = req.body;
    let userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({
        message: "User Not Exist",
      });
    }
    const passwordMatch = await bcrypt.compare(password, userExist.password);
    if (passwordMatch) {
      const token = jwt.sign(
        {
          _id: userExist._id,
        },
        process.env.JWT_Token,
        { expiresIn: "24h" }
      );
      const userObj = userExist.toObject();
      delete userObj.password;

      return res.status(200).json({
        message: "User Loggedin",
        user: userObj,
        token,
      });
    } else {
      return res.status(401).json({
        message: "Invalid Password",
      });
    }
  } catch (error) {
    console.log("loginUser error:", error);
    return res.status(401).json({
      message: "Internal Server Error",
    });
  }
};

export const myProfile = async (req, res) => {
  try {
    const user = req.user;
    return res.json(user);
  } catch (error) {
    console.log("myProfile error:", error);
    return res.status(401).json({
      message: "Internal Server Error",
    });
  }
};
