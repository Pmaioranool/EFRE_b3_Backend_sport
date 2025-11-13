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

  static async create({ Title, Type, BodyPart, Equipment, Level }) {
    if (!Title || !Type || !BodyPart || !Equipment || !Level) {
      throw new Error(
        "Title,type, bodypart, equipment,level are required to create a exercise."
      );
    }

    const exercise = new ExerciseModel(Title, Type, BodyPart, Equipment, Level);
    return await exercise.save();
  }

  static async update(id, { Title, Type, BodyPart, Equipment, Level }) {
    const exercise = await ExerciseModel.findById(id);
    if (!exercise) {
      throw new Error("Exercise not found.");
    }
    if (Title !== undefined) exercise.Title = Title;
    if (Type !== undefined) exercise.Type = Type;
    if (BodyPart !== undefined) exercise.BodyPart = BodyPart;
    if (Equipment !== undefined) exercise.Equipment = Equipment;
    if (Level !== undefined) exercise.Level = Level;
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
