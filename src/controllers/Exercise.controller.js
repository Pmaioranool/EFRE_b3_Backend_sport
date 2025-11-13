const Exercise = require("../models/Exercise.model");

exports.getExercise = async (req, res, next) => {
  try {
    const { title, level, rating, limit, all } = req.query;

    const exercises = await Exercise.getAll({
      title,
      level,
      rating,
      limit,
      all,
    });
    return res.status(200).json(exercises);
  } catch (e) {
    next(e);
  }
};

exports.getExerciseById = async (req, res, next) => {
  try {
    const exercise = await Exercise.getById(req.params.id);
    return res.status(200).json(exercise);
  } catch (e) {
    next(e);
  }
};

exports.createExercise = async (req, res, next) => {
  try {
    const { name, description, price } = req.body;
    const newExercise = await Exercise.create({
      name,
      description,
      price,
    });
    return res.status(201).json(newExercise);
  } catch (e) {
    next(e);
  }
};

exports.updateExercise = async (req, res, next) => {
  try {
    const { name, description, price } = req.body;
    const updatedExercise = await Exercise.update(req.params.id, {
      name,
      description,
      price,
    });
    return res.status(200).json(updatedExercise);
  } catch (e) {
    next(e);
  }
};

exports.deleteExercise = async (req, res, next) => {
  try {
    await Exercise.delete(req.params.id);
    return res.status(200).json({ message: "Exercise deleted successfully" });
  } catch (e) {
    next(e);
  }
};
