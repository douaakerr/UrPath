import dotenv from "dotenv";
import express from "express";
import chalk from "chalk";
import connectDB from "./config/connectDb.js";
import morgan from "morgan";
import dns from "dns";
import router from "./routes/index.js"
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT;


dns.setServers(["8.8.8.8", "8.8.4.4"]);


// Middleware

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

//rouring
app.use('/api', router );

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => {
  console.log(chalk.cyan(` UrPath server running on port ${PORT}`));
});
