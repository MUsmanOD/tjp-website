import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";

const port = Number(process.env.PORT ?? 5000);
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI must be set before starting the API");
}

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be a valid TCP port");
}

try {
  await mongoose.connect(mongoUri);

  app.listen(port, () => {
    console.info(`API listening on port ${port}`);
  });
} catch (error) {
  console.error("Failed to connect to MongoDB:", error);
  process.exitCode = 1;
}
