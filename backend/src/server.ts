import express from "express";
import cors from "cors";
import homeRoutes from "./routes/home.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import emergencyRoutes from "./routes/emergency.routes";
import sosRoutes from "./routes/sos.routes";
import { errorHandler } from "./middleware/error.middleware";
import "./config/firebase";
import http from "http";
import { initializeSocket } from "./config/socket";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SwaShakti Backend is Running 🚀",
  });
});

// Home Route
app.use("/api/home", homeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/sos", sosRoutes);

// Global error handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5001;

const httpServer = http.createServer(app);

// Initialize Socket.IO
initializeSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

httpServer.on("error", (err) => {
  console.error("Server error:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});