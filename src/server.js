const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3000;
const { pool } = require("./config/db.postgres");
const { connectMongo } = require("./config/db.mongo");

app.use(cors());
app.use(express.json());

// Connexion aux bases de données avant de démarrer le serveur
async function startServer() {
  try {
    // Connexion MongoDB
    await connectMongo();

    // Test PostgreSQL
    await pool.query("SELECT NOW()");
  } catch (error) {
    console.error("Erreur de démarrage:", error);
    process.exit(1);
  }
}

startServer();

// Test des connexions aux bases de données
app.get("/api/test-db", async (req, res) => {
  try {
    // Test PostgreSQL
    const pgResult = await pool.query("SELECT NOW()");

    // Test MongoDB
    await connectMongo();

    res.json({
      status: "ok",
      postgresql: "Connected successfully",
      mongodb: "Connected successfully",
      timestamp: pgResult.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// Mount routes
const exerciseRoutes = require("./routes/exercise.routes");
app.use("/api/exercises", exerciseRoutes);
const workoutRoutes = require("./routes/workout.routes");
app.use("/api/workouts", workoutRoutes);

// Health
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
