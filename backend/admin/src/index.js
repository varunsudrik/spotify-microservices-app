import express from "express";
import "dotenv/config";
import morgan from "morgan";
let app = express();
app.use(express.json()); // For parsing application/json
import { dbConnect, executeQuery } from "./config/db.js";

app.use(morgan("combined"));

let PORT = process.env.PORT || 8000;

dbConnect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });
