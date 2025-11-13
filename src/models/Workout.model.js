const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkoutSchema = new Schema(
  {
    name: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    exercises: [{ type: Schema.Types.ObjectId, ref: "Exercise" }],
    userId: [{ type: Number }],
  },
  {
    timestamps: true,
  }
);

const WorkoutModel = mongoose.model("Workout", WorkoutSchema);

class Workout {
  static async getAll() {
    return await WorkoutModel.find().populate("exercises").exec();
  }

  static async getById(id) {
    return await WorkoutModel.findById(id).populate("exercises").exec();
  }

  static async create({ name, duration, date, exercises = [] }) {
    if (!name || !duration) {
      throw new Error("Name and duration are required to create a workout.");
    }

    if (date && isNaN(new Date(date).getTime())) {
      throw new Error("Invalid date format.");
    }

    if (exercises && !Array.isArray(exercises)) {
      throw new Error("Exercises must be an array of exercise IDs.");
    }

    const workout = new WorkoutModel({
      name,
      duration,
      date: date || new Date(),
      exercises,
    });

    return await workout.save();
  }

  static async update(id, { name, duration, date, exercises }) {
    const workout = await WorkoutModel.findById(id);
    if (!workout) {
      throw new Error("Workout not found.");
    }

    // CORRECTION : Assignation correcte de tous les champs
    if (name !== undefined) workout.name = name;
    if (duration !== undefined) workout.duration = duration;
    if (date !== undefined) {
      if (isNaN(new Date(date).getTime())) {
        throw new Error("Invalid date format.");
      }
      workout.date = date;
    }
    if (exercises !== undefined) {
      if (!Array.isArray(exercises)) {
        throw new Error("Exercises must be an array of exercise IDs.");
      }
      workout.exercises = exercises;
    }

    return await workout.save();
  }

  static async delete(id) {
    const workout = await WorkoutModel.findByIdAndDelete(id);
    if (!workout) {
      throw new Error("Workout not found.");
    }
    return workout;
  }
}

module.exports = Workout;
