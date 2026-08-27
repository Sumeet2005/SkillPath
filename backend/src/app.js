const express = require("express");
const cors = require("cors");
const { checkDatabaseConnection } = require("./db/driver");

const skillsRouter = require("./routes/skills");
const jobsRouter = require("./routes/jobs");
const pathRouter = require("./routes/path");
const recommendationsRouter = require("./routes/recommendations");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Deployment-safe CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://skill-path-sumeet17.vercel.app",
  "https://skill-path-orpin-seven.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(new Error("CORS policy violation: Origin not allowed"));
    },
    credentials: true,
  })
);

app.use(express.json());

// API Routes
app.use("/api/skills", skillsRouter);
app.use("/api/jobs", jobsRouter);
app.use("/api/path", pathRouter);
app.use("/api/recommendations", recommendationsRouter);

// Health check endpoint with CognoDB status
app.get("/api/health", async (req, res) => {
  const isDbConnected = await checkDatabaseConnection();
  res.json({
    status: "ok",
    success: true,
    message: "SkillPath backend is running",
    database: isDbConnected ? "connected" : "disconnected",
  });
});

// 404 Not Found & Centralized Error Handler Middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
