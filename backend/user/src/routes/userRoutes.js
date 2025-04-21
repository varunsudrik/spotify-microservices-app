import express from "express";
import { registerUser } from "../controller/userController.js";

const router = express.Router();

router.post("/user/register", registerUser);
export default router;
