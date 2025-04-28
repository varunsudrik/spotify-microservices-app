import express from "express";
import "dotenv/config";
import { dbConnect } from "./config/db.js";
import morgan from "morgan";
import songRoutes from "./routes/songRoutes.js";
import cors from "cors";

let app = express();
let PORT = process.env.PORT || "8002";

app.use(morgan("combined"));
app.use(cors());
app.use("/api/v1", songRoutes);

dbConnect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to database:", err);
  });
