const Workout = require("../models/Workout.model");

exports.getWorkout = async (req, res, next) => {
  try {
    const workouts = await Workout.getAll();
    return res.status(200).json(workouts);
  } catch (e) {
    next(e);
  }
};

exports.getWorkoutById = async (req, res, next) => {
  try {
    const workout = await Workout.getById(req.params.id);
    return res.status(200).json(workout);
  } catch (e) {
    next(e);
  }
};

exports.createWorkout = async (req, res, next) => {
  try {
    const { name, description, price } = req.body;
    const newWorkout = await Workout.create({
      name,
      description,
      price,
    });
    return res.status(201).json(newWorkout);
  } catch (e) {
    next(e);
  }
};

exports.updateWorkout = async (req, res, next) => {
  try {
    const { name, description, price } = req.body;
    const updatedWorkout = await Workout.update(req.params.id, {
      name,
      description,
      price,
    });
    return res.status(200).json(updatedWorkout);
  } catch (e) {
    next(e);
  }
};

exports.deleteWorkout = async (req, res, next) => {
  try {
    await Workout.delete(req.params.id);
    return res.status(200).json({ message: "Workout deleted successfully" });
  } catch (e) {
    next(e);
  }
};
