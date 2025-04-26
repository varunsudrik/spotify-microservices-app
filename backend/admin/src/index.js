import express from "express";
import "dotenv/config";
import morgan from "morgan";
import adminRoutes from "./routes/adminRoutes.js";
import cloudinary from "cloudinary";
let app = express();
app.use(express.json()); // For parsing application/json
import { dbConnect, executeQuery } from "./config/db.js";

app.use(morgan("combined"));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

let PORT = process.env.PORT || 8000;
app.use("/api/v1", adminRoutes);

dbConnect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });
