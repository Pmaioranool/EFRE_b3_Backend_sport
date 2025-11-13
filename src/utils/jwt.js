const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class JWTService {
  constructor() {
    this.accessTokenSecret =
      process.env.JWT_ACCESS_SECRET || "your-access-secret-key";
    this.refreshTokenSecret =
      process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key";
    this.accessTokenExpiry = "15m";
    this.refreshTokenExpiry = "7d";
  }

  generateAccessToken(payload) {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: this.accessTokenExpiry,
      issuer: "fitness-api",
      audience: "fitness-app",
    });
  }

  generateRefreshToken(payload) {
    return jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiry,
      issuer: "fitness-api",
      audience: "fitness-app",
    });
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, this.accessTokenSecret);
    } catch (error) {
      throw new Error("Token d'accès invalide");
    }
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, this.refreshTokenSecret);
    } catch (error) {
      throw new Error("Refresh token invalide");
    }
  }

  async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  extractTokenFromHeader(authHeader) {
    if (!authHeader) {
      throw new Error("Header Authorization manquant");
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new Error("Format Authorization header invalide");
    }

    return parts[1];
  }

  refreshTokens(refreshToken) {
    const decoded = this.verifyRefreshToken(refreshToken);

    const userPayload = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    const newAccessToken = this.generateAccessToken(userPayload);
    const newRefreshToken = this.generateRefreshToken(userPayload);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: userPayload,
    };
  }
}

module.exports = new JWTService();
