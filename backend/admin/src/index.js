import express from "express";
import "dotenv/config";
import morgan from "morgan";
let app = express();
app.use(express.json()); // For parsing application/json

app.use(morgan("combined"));

let PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
