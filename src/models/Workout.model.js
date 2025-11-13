const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkoutSchema = new Schema(
  {
    name: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    exercises: [{ type: Schema.Types.ObjectId, ref: "Exercise" }],
  },
  {
    _id: true,
    timestamps: true,
  }
);

const WorkoutModel = mongoose.model("Workout", WorkoutSchema);
