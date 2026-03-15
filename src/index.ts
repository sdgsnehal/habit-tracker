import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import habitRoutes from "./routes/habitRoutes";

const app = express();
const port = 3000;

app.use(cors({ origin: process.env.CORS_ORIGIN_FRONTEND }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Habit routes
app.use("/api/habits", habitRoutes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
