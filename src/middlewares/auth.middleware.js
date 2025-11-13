const JWTService = require("../utils/jwt");

exports.authenticateToken = (req, res, next) => {
  try {
    const token = JWTService.extractTokenFromHeader(req.headers.authorization);
    const decoded = JWTService.verifyAccessToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Accès non autorisé",
      message: error.message,
    });
  }
};
