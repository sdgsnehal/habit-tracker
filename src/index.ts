import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors({ origin: process.env.CORS_ORIGIN_FRONTEND }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
