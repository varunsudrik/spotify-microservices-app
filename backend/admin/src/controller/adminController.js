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

export const addSong = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      res.status(401).json({
        message: "You are not admin",
      });
      return;
    }

    const { title, description, album } = req.body;
    const albumQuery = `
    SELECT * FROM albums WHERE id = $1 ;
`;
    const isAlbum = await executeQuery(albumQuery, [album]);

    if (isAlbum.length === 0) {
      res.status(404).json({
        message: "No album with this id",
      });
      return;
    }

    const file = req.file;

    if (!file) {
      res.status(400).json({
        message: "No file to upload",
      });
      return;
    }

    const fileBuffer = getBuffer(file);

    if (!fileBuffer || !fileBuffer.content) {
      res.status(500).json({
        message: "Failed to generate file buffer",
      });
      return;
    }

    const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
      folder: "songs",
      resource_type: "video",
    });
    const insertquery = `
    INSERT INTO songs (title, description, audio, album_id) VALUES
    ($1, $2, $3, $4)`;

    const insertData = await executeQuery(insertquery, [
      title,
      description,
      cloud.secure_url,
      album,
    ]);

    res.json({
      message: "Song Added",
    });
  } catch (error) {
    console.log("addSong error", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const addThumbnail = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      res.status(401).json({
        message: "You are not admin",
      });
      return;
    }
    const songQuery = `
    SELECT * FROM songs WHERE id = $1 ;
`;
    const song = await executeQuery(songQuery, [req.params.id]);

    if (song.length === 0) {
      res.status(404).json({
        message: "No song with this id",
      });
      return;
    }
    const file = req.file;

    if (!file) {
      res.status(400).json({
        message: "No file to upload",
      });
      return;
    }

    const fileBuffer = getBuffer(file);

    if (!fileBuffer || !fileBuffer.content) {
      res.status(500).json({
        message: "Failed to generate file buffer",
      });
      return;
    }

    const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content);

    const updateQuery = `   
    UPDATE songs SET thumbnail = $1 WHERE id = $2 RETURNING *`;

    const insertData = await executeQuery(updateQuery, [
      cloud.secure_url,
      req.params.id,
    ]);

    res.json({
      message: "Thumbnail added",
      song: insertData[0],
    });
  } catch (error) {
    console.log("addThumbnail error", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const deleteAlbum = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      res.status(401).json({
        message: "You are not admin",
      });
      return;
    }

    const { id } = req.params;

    const albumQuery = `
    SELECT * FROM albums WHERE id = $1 ;
    `;
    const isAlbum = await executeQuery(albumQuery, [req.params.id]);

    if (isAlbum.length === 0) {
      res.status(404).json({
        message: "No album with this id",
      });
      return;
    }

    const deletesongQuery = `
    SELECT * FROM songs WHERE album_id = $1 ;
    `;
    const deletealbumQuery = `
    SELECT * FROM albums WHERE id = $1 ;
    `;

    const delsong = await executeQuery(deletesongQuery, [id]);

    const delalbum = await executeQuery(deletealbumQuery, [id]);

    res.json({
      message: "Album deleted successfully",
    });
  } catch (error) {
    console.log("deleteAlbum error", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
export const deleteSong = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      res.status(401).json({
        message: "You are not admin",
      });
      return;
    }

    const { id } = req.params;
    const songQuery = `
    SELECT * FROM songs WHERE id = $1 ;
    `;
    const song = await executeQuery(songQuery, [req.params.id]);

    if (song.length === 0) {
      res.status(404).json({
        message: "No song with this id",
      });
      return;
    }
    const delSongQuery = `
    DELETE FROM songs WHERE id = $1 ;
    `;
    const delsong = await executeQuery(delSongQuery, [id]);

    res.json({
      message: "Song deleted successfully",
    });
  } catch (error) {
    console.log("delSong error", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
