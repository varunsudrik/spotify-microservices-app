import express from "express";
import {
  addAlbum,
  addSong,
  addThumbnail,
  deleteAlbum,
  deleteSong,
} from "../controller/adminController.js";
import { isAdmin } from "../middleware/auth.js";
import { uploadFile } from "../middleware/uploadFile.js";

const router = express.Router();

router.post("/album/new", isAdmin, uploadFile, addAlbum);
router.post("/song/new", isAdmin, uploadFile, addSong);
router.post("/song/:id", isAdmin, uploadFile, addThumbnail);
router.delete("/album/:id", isAdmin, deleteAlbum);
router.delete("/song/:id", isAdmin, deleteSong);

export default router;
