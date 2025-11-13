const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite à 100 requêtes par windowMs
  message: {
    error: "Trop de tentatives de connexion",
    message: "Veuillez réessayer dans 15 minutes",
  },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    error: "Trop de requêtes",
    message: "Veuillez réessayer plus tard",
  },
});

// Configuration Helmet
const helmetConfig = helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
});

module.exports = {
  authLimiter,
  apiLimiter,
  helmetConfig,
};
