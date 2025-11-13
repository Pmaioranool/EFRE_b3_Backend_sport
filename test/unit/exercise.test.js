const Exercise = require("../../src/models/Exercise.model");
const ExerciseController = require("../../src/controllers/Exercise.controller");

jest.mock("../../src/models/Exercise.model");

describe("Exercise Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      params: {},
      query: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("getExercise", () => {
    it("should get all exercises with filters", async () => {
      const mockExercises = [
        { _id: "1", Title: "Push Up", Level: "Beginner" },
        { _id: "2", Title: "Pull Up", Level: "Intermediate" },
      ];

      req.query = { title: "Push", level: "Beginner", limit: 10 };
      Exercise.getAll.mockResolvedValue(mockExercises);

      await ExerciseController.getExercise(req, res, next);

      expect(Exercise.getAll).toHaveBeenCalledWith({
        title: "Push",
        level: "Beginner",
        rating: undefined,
        limit: 10,
        all: undefined,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockExercises);
    });

    it("should handle errors", async () => {
      const error = new Error("Database error");
      Exercise.getAll.mockRejectedValue(error);

      await ExerciseController.getExercise(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("getExerciseById", () => {
    it("should get exercise by id", async () => {
      const mockExercise = { _id: "1", Title: "Push Up", Level: "Beginner" };

      req.params.id = "1";
      Exercise.getById.mockResolvedValue(mockExercise);

      await ExerciseController.getExerciseById(req, res, next);

      expect(Exercise.getById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockExercise);
    });

    it("should handle errors when exercise not found", async () => {
      const error = new Error("Exercise not found");
      req.params.id = "invalid";
      Exercise.getById.mockRejectedValue(error);

      await ExerciseController.getExerciseById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("createExercise", () => {
    it("should create a new exercise", async () => {
      const newExercise = {
        _id: "1",
        name: "Push Up",
        description: "Upper body exercise",
        price: 0,
      };

      req.body = {
        name: "Push Up",
        description: "Upper body exercise",
        price: 0,
      };
      Exercise.create.mockResolvedValue(newExercise);

      await ExerciseController.createExercise(req, res, next);

      expect(Exercise.create).toHaveBeenCalledWith({
        name: "Push Up",
        description: "Upper body exercise",
        price: 0,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newExercise);
    });

    it("should handle creation errors", async () => {
      const error = new Error("Name and duration are required");
      req.body = { description: "No name" };
      Exercise.create.mockRejectedValue(error);

      await ExerciseController.createExercise(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("updateExercise", () => {
    it("should update an exercise", async () => {
      const updatedExercise = {
        _id: "1",
        name: "Modified Push Up",
        description: "Modified description",
        price: 10,
      };

      req.params.id = "1";
      req.body = {
        name: "Modified Push Up",
        description: "Modified description",
        price: 10,
      };
      Exercise.update.mockResolvedValue(updatedExercise);

      await ExerciseController.updateExercise(req, res, next);

      expect(Exercise.update).toHaveBeenCalledWith("1", {
        name: "Modified Push Up",
        description: "Modified description",
        price: 10,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedExercise);
    });

    it("should handle update errors", async () => {
      const error = new Error("Exercise not found");
      req.params.id = "invalid";
      Exercise.update.mockRejectedValue(error);

      await ExerciseController.updateExercise(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("deleteExercise", () => {
    it("should delete an exercise", async () => {
      req.params.id = "1";
      Exercise.delete.mockResolvedValue({ _id: "1", Title: "Push Up" });

      await ExerciseController.deleteExercise(req, res, next);

      expect(Exercise.delete).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Exercise deleted successfully",
      });
    });

    it("should handle delete errors", async () => {
      const error = new Error("Exercise not found");
      req.params.id = "invalid";
      Exercise.delete.mockRejectedValue(error);

      await ExerciseController.deleteExercise(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
