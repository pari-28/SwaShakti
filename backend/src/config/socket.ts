import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { verifyToken } from "../utils/jwt";
import { registerSOSSocketEvents } from "../socket/sos.socket";

let io: Server;

export const initializeSocket = (httpServer: HttpServer) => {
  const allowedOrigins = [
  process.env.FRONTEND_URL?.replace(/\/+$/, ""),
  "https://swa-shakti-rho.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173",
].filter((origin): origin is string => Boolean(origin));

io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

  io.use((socket: Socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const decoded = verifyToken(token) as { userId: string };

socket.data.userId = decoded.userId;

    next();
  } catch (error) {
    next(new Error("Invalid token"));
  }
});

  io.on("connection", (socket) => {
  const userId = socket.data.userId;

  socket.join(`user:${userId}`);

  registerSOSSocketEvents(io, socket);

  console.log(`🟢 User ${userId} connected`);
  console.log(`Socket ID: ${socket.id}`);
  console.log(`Joined room: user:${userId}`);

  socket.on("disconnect", () => {
    console.log(`🔴 User ${userId} disconnected`);
  });
});

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized.");
  }

  return io;
};