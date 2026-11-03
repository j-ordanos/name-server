require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { pool, initializeDatabase } = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend is running" });
});

// Save a name
app.post("/api/names", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        error: "A valid name is required",
      });
    }

    const result = await pool.query(
      "INSERT INTO names (name) VALUES ($1) RETURNING *",
      [name.trim()],
    );

    res.status(201).json({
      message: "Name saved successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ error: "Failed to save name" });
  }
});

// Retrieve all names
app.get("/api/names", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM names ORDER BY created_at DESC",
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to retrieve names" });
  }
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error);
    process.exit(1);
  }
}

startServer();
