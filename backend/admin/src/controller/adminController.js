import axios from "axios";
import "dotenv/config";
import { getBuffer } from "../config/dataUri.js";
import cloudinary from "cloudinary";
import { executeQuery } from "../config/db.js";
export const addAlbum = async (req, res, next) => {
  try {
    console.log("role", req?.user.role);
    if (req?.user.role != "admin") {
      return res.status(403).json({
        message: "Not Admin",
      });
    }
    const { title, description } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "No File To Upload",
      });
    }

    const fileBuffer = await getBuffer(file);

    if (!fileBuffer || !fileBuffer.content) {
      return res.status(500).json({
        message: "Failed to generate buffer",
      });
    }
    const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
      folder: "albums",
    });

    const query = `
    INSERT INTO albums (title, description, thumbnail)
    VALUES ($1, $2, $3)
  `;

    const insertData = await executeQuery(query, [
      title,
      description,
      cloud.secure_url,
    ]);

    return res.status(201).json({
      message: "Album Created",
    });
  } catch (error) {
    console.log("addAlbum error", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
