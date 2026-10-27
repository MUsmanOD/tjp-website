import mongoose from "mongoose";
import { config } from "./config.js";
import { app } from "./app.js";
await mongoose.connect(config.MONGODB_URI);
await Promise.all(Object.values(mongoose.models).map((model) => model.init()));
const server = app.listen(config.PORT, '127.0.0.1', () =>
  console.info(`TJP API listening on ${config.PORT}`),
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => {
    server.close(() => {
      void mongoose.disconnect().then(() => process.exit(0));
    });
  });
