import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import userRoutes from "./routes/userRoutes.js";
import morgan from "morgan";
import cors from "cors";

let app = express();

app.use(express.json()); // For parsing application/json

app.use(morgan("combined"));
app.use(cors());

let PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI, {
    dbName: "Spotify",
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use("/api/v1", userRoutes);
