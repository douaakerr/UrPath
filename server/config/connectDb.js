import mongoose from "mongoose";
import chalk from "chalk";
import dns from "dns";

const connectDB = async () => {
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
    await mongoose.connect(process.env.MONGO_URI);

    console.log(chalk.magenta("MongoDB connected successfully"));
  } catch (error) {
    console.error(
      chalk.red(" MongoDB connection failed:"),
      chalk.red(error.message)
    );

    process.exit(1);
  }
};

export default connectDB;