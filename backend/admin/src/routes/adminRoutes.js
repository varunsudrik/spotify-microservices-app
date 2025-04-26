import express from "express";
import { addAlbum } from "../controller/adminController.js";
import { isAdmin } from "../middleware/auth.js";
import { uploadFile } from "../middleware/uploadFile.js";

const router = express.Router();

router.post("/album/new", isAdmin, uploadFile, addAlbum);

export default router;
