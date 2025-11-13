const User = require("../models/User.model");
const JWTService = require("../utils/jwt");

class AuthController {
  async register(req, res, next) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          error: "Données manquantes",
          message: "Le nom, email et mot de passe sont requis",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          error: "Mot de passe trop court",
          message: "Le mot de passe doit contenir au moins 6 caractères",
        });
      }

      const existingUser = await User.getByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          error: "Utilisateur déjà existant",
          message: "Un utilisateur avec cet email existe déjà",
        });
      }

      const newUser = await User.create({
        name,
        email,
        password,
      });

      const userPayload = {
        userId: newUser.id,
        email: newUser.email,
      };

      const accessToken = JWTService.generateAccessToken(userPayload);
      const refreshToken = JWTService.generateRefreshToken(userPayload);

      res.status(201).json({
        message: "Utilisateur créé avec succès",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          error: "Données manquantes",
          message: "L'email et le mot de passe sont requis",
        });
      }

      const user = await User.getByEmail(email);
      if (!user) {
        return res.status(401).json({
          error: "Identifiants invalides",
          message: "Email ou mot de passe incorrect",
        });
      }

      const isPasswordValid = await JWTService.comparePassword(
        password,
        user.password
      );
      if (!isPasswordValid) {
        return res.status(401).json({
          error: "Identifiants invalides",
          message: "Email ou mot de passe incorrect",
        });
      }

      const userPayload = {
        userId: user.id,
        email: user.email,
      };

      const accessToken = JWTService.generateAccessToken(userPayload);
      const refreshToken = JWTService.generateRefreshToken(userPayload);

      await User.updateLastLogin(user.id, new Date().toISOString());

      res.json({
        message: "Connexion réussie",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          last_login: user.last_login,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          error: "Refresh token requis",
        });
      }

      const tokens = JWTService.refreshTokens(refreshToken);

      res.json({
        message: "Tokens rafraîchis avec succès",
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        user: tokens.user,
      });
    } catch (error) {
      return res.status(401).json({
        error: "Refresh token invalide",
        message: error.message,
      });
    }
  }

  async getProfile(req, res, next) {
    try {
      const user = await User.getById(req.user.userId);

      if (!user) {
        return res.status(404).json({
          error: "Utilisateur non trouvé",
        });
      }

      const { password, ...userWithoutPassword } = user;

      res.json({
        user: userWithoutPassword,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      res.json({
        message: "Déconnexion réussie",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
