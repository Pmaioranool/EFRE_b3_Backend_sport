const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const { connectMongo } = require("./config/db.mongo");

app.get("/api/test-db", async (req, res) => {
  try {
    // Test MongoDB
    await connectMongo();

    res.json({
      status: "ok",
      mongodb: "Connected successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

app.use(cors());
app.use(express.json());

// status
app.get("/api/status", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 404
app.use((req, res) => res.status(404).json({ error: "Route inconnue" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(" Erreur serveur:", err.message);
  res.status(500).json({ error: "Erreur interne serveur" });
});

app.listen(PORT, () => console.log(` API prête sur http://localhost:${PORT}`));
