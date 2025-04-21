import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";
import { signUpSchema } from "../validator/userSchema.js";
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
    console.log(req.body);
    let userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        message: "User Already Exist",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = User.create({
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

      return res.status(201).json({
        message: "User Registered",
        token,
      });
    }
  } catch (error) {
    console.log("registerUser error:", error);
  }
};
