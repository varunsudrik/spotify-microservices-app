import { executeQuery } from "../config/db.js";

export const getAllAlbums = async (req, res) => {
  try {
    const query = `
            SELECT * FROM albums;
          `;

    const getAlbums = await executeQuery(query);
    res.json(getAlbums);
  } catch (error) {
    console.log("getAllAlbums error", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
export const getAllSongs = async (req, res) => {
  try {
    const query = `
            SELECT * FROM songs;
          `;

    const getSongs = await executeQuery(query);
    res.json(getSongs);
  } catch (error) {
    console.log("getAllSongs error", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
export const getAllSongsOfAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
            SELECT * FROM albums where id = $1;
          `;

    const albums = await executeQuery(query, [id]);

    if (albums.length == 0) {
      return res.status(404).json({
        message: "No album with this id",
      });
    }

    const songQuery = `
            SELECT * FROM songs where albumid = $1;
          `;

    const songs = await executeQuery(songQuery, [id]);

    const response = { songs, album: albums[0] };
    res.json(response);
  } catch (error) {
    console.log("getAllSongsOfAlbum error", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getSingleSong = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
              SELECT * FROM songs where id = $1;
            `;

    const getSongs = await executeQuery(query, [id]);
    res.json(getSongs[0]);
  } catch (error) {
    console.log("getSingleSong error", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
