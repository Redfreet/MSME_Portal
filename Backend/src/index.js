import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./utils/db.js";
import userRoutes from "./routes/user.route.js";
import cors from "cors";
import problemRoutes from "./routes/problem.route.js";
import solutionRoutes from "./routes/solution.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/solutions", solutionRoutes);

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
  connectDB();
});
