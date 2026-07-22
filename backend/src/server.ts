import express from "express";
import cors from "cors";
import homeRoutes from "./routes/home.routes";

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

// Start Server
const PORT = 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});