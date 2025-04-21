import express from "express";
import {
  registerUser,
  LoginUser,
  myProfile,
} from "../controller/userController.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/user/register", registerUser);
router.post("/user/login", LoginUser);
router.get("/user/me", isAuth, myProfile);
export default router;
