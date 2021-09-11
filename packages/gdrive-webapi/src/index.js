import http from "http";
import { logger } from "./logger.js";
import { Server } from "socket.io";
import Routes from "./routes.js";

const PORT = process.env.PORT || 3000;

const routes = new Routes();
const server = http.createServer(routes.handler.bind(routes));

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: false,
  },
});

routes.setSocketInstance(io);

io.on("connection", (socket) => logger.info(`someone connected: ${socket.id}`));

const startServer = () => {
  const { address, port } = server.address();

  logger.info(`app running at http://${address}:${port}`);
};

server.listen(PORT, startServer);
