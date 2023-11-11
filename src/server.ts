import mongoose from "mongoose";
import app from "./app";
import config from "./config";
import { errorLogger, infoLogger } from "./shared/logger";
import { Server } from "http";

let server: Server;

process.on("uncaughtException", err => {
  errorLogger.error(err);
  if (server) {
    server.close(() => {
      process.exitCode = 1;
    });
  } else {
    process.exitCode = 1;
  }
});

async function main() {
  try {
    await mongoose.connect(config.db_url as string);
    infoLogger.info("DB Connected!");

    server = app.listen(config.port, () => {
      infoLogger.info(`Application is listening on port ${config.port}`);
    });
  } catch (error) {
    errorLogger.error("Failed to connect database", error);
  }

  process.on("unhandledRejection", err => {
    if (server) {
      server.close(() => {
        errorLogger.error(err);
        process.exit(1);
      });
    } else {
      errorLogger.error(err);
      process.exit(1);
    }
  });
}

main();

process.on("SIGTERM", () => {
  infoLogger.info("SIGTERM received");

  if (server) {
    server.close(() => {
      // Optionally, you can perform any additional cleanup here
      process.exit(0); // Exit gracefully with code 0
    });
  } else {
    // No server to close, exit gracefully
    process.exit(0);
  }
});
