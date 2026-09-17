import dotenv from "dotenv";
import express from "express";
import chalk from "chalk";
import mongoose from "mongoose";
import morgan from "morgan";
import dns from "dns";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

import connectDB from "./config/connectDb.js";
import router from "./routes/index.js";
import "./config/passport.js";
import { startJobs } from "./jobs/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

dns.setServers(["8.8.8.8", "8.8.4.4"]);

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(passport.initialize());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", router);

await connectDB();

startJobs();

const server = app.listen(PORT, () => {
  console.log(chalk.cyan(`UrPath server running on port ${PORT}`));
});

const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);

  server.close(async () => {
    try {
      await mongoose.connection.close();

      console.log("MongoDB connection closed.");
      console.log("UrPath server stopped.");

      process.exit(0);
    } catch (error) {
      console.error("Shutdown error:", error.message);
      process.exit(1);
    }
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));