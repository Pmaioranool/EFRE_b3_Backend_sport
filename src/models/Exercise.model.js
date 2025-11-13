const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExerciseSchema = new Schema(
  {
    Title: { type: String, required: true },
    Desc: { type: String },
    Type: { type: String, required: true },
    BodyPart: { type: String, required: true },
    Equipment: { type: String, required: true },
    Level: { type: String, required: true },
    Rating: { type: Number },
    RatingDesc: { type: String },
  },
  {
    _id: true,
    timestamps: true,
  }
);

const ExerciseModel = mongoose.model("Exercise", ExerciseSchema);

class Exercise {
  static async getAll() {
    return await ExerciseModel.find().exec();
  }

  static async getById(id) {
    return await ExerciseModel.findById(id).exec();
  }

  static async create({ name, duration, date, exercises = [] }) {
    if (!name || !duration) {
      throw new Error("Name and duration are required to create a exercise.");
    }
    if (date && isNaN(new Date(date).getTime())) {
      throw new Error("Invalid date format.");
    }

    const exercise = new ExerciseModel(name, duration, date, exercises);
    return await exercise.save();
  }

  static async update(id, { name, duration, date, exercises }) {
    const exercise = await ExerciseModel.findById(id);
    if (!exercise) {
      throw new Error("Exercise not found.");
    }
    if (name !== undefined) exercise.name = name;
    if (duration !== undefined) exercise.duration = duration;
  }

  static async delete(id) {
    const exercise = await ExerciseModel.findByIdAndDelete(id);
    if (!exercise) {
      throw new Error("Exercise not found.");
    }
    return exercise;
  }
}

module.exports = Exercise;
