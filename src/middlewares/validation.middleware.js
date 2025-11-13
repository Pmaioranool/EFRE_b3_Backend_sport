const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Données invalides",
      details: errors.array(),
    });
  }
  next();
};

const validateUserRegistration = [
  body("name")
    .isLength({ min: 2 })
    .withMessage("Le nom doit contenir au moins 2 caractères"),
  body("email").isEmail().withMessage("Email invalide"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères"),
  handleValidationErrors,
];

const validateUserLogin = [
  body("email").isEmail().withMessage("Email invalide"),
  body("password").notEmpty().withMessage("Le mot de passe est requis"),
  handleValidationErrors,
];

const validateExercise = [
  body("Title")
    .isLength({ min: 2 })
    .withMessage("Le titre doit contenir au moins 2 caractères"),
  body("Type").notEmpty().withMessage("Le type est requis"),
  body("BodyPart").notEmpty().withMessage("La partie du corps est requise"),
  handleValidationErrors,
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateExercise,
  handleValidationErrors,
};
