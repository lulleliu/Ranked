import express from "express";
import dotenv from "dotenv";
import helloRoute from "./routes/hello.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON requests

// Routes
app.use("/api/hello", helloRoute);

// Root route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.listen(PORT, () => {
  console.log(`✅ Backend listening on http://localhost:${PORT}`);
});
