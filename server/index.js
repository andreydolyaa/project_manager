import http from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { WebSocketServer } from "ws";
import { serverMsg } from "./src/constants/messages.js";
import router from "./src/router.js";
import { setupErrorHandler } from "./src/core/errorHandler.js";
import logger from "./src/core/logger.js";
import { connectToDatabase } from "./src/core/database.js";
import { httpLoggerMiddleware } from "./src/middleware/httpLogger.js";

dotenv.config();

const app = express();
const port = process.env.SERVER_PORT;
const httpServer = http.createServer(app);
const websocketServer = new WebSocketServer({ server: httpServer });
let activeWebsocket = null; // TODO: resolve this

app.use(express.json());
app.use(cors());
app.use(httpLoggerMiddleware);
app.use(router);

const startServers = async () => {
  httpServer.listen(port, (error) => {
    if (error) {
      logger.error(serverMsg.START_ERROR);
      shutdown(1);
    } else {
      logger.info(serverMsg.START_SUCCESS(port));
    }
  });
  websocketServer.on("listening", () => {
    logger.info(serverMsg.START_SUCCESS_WS(port));
  });
};

const shutdown = (code) => {
  logger.error(serverMsg.SHUT_DOWN_IN_PROGRESS);
  websocketServer.close(() => {
    httpServer.close(() => {
      logger.error(serverMsg.SHUT_DOWN_COMPLETE);
      process.exit(code);
    });
  });
};

const initWebsocketListener = () => {
  websocketServer.on("connection", (websocket) => {
    handleNewConnection(websocket);
    websocket.on("message", handleIncomingMessage);
    websocket.on("close", handleDisconnected);
    websocket.on("error", handleWebsocketError);
  });
};

const handleNewConnection = (websocket) => {
  activeWebsocket = websocket;
  logger.info("New client connected");
};

const handleDisconnected = () => {
  activeWebsocket = null;
  logger.info("Client disconnected");
};

const handleIncomingMessage = (data) => {
  console.log("ws message received: ", JSON.parse(data));
};

const handleWebsocketError = () => {
  logger.error("Websocket Error");
};

export const sendWebsocketMessage = (message) => {
  if (activeWebsocket) {
    activeWebsocket.send(message);
    logger.info(`Websocket message sent: ${JSON.stringify(message)}`);
  } else {
    logger.warn("No active websocket connection found");
  }
};

setupErrorHandler(httpServer, websocketServer, logger, shutdown)
  .then(startServers)
  .then(connectToDatabase)
  .then(initWebsocketListener);
