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
        Title: "Push Up",
        Desc: "Upper body exercise",
        Type: "Strength",
        BodyPart: "Chest",
        Equipment: "Bodyweight",
        Level: "Beginner",
        Rating: 0,
        RatingDesc: "",
      };

      req.body = {
        Title: "Push Up",
        Desc: "Upper body exercise",
        Type: "Strength",
        BodyPart: "Chest",
        Equipment: "Bodyweight",
        Level: "Beginner",
        Rating: 0,
        RatingDesc: "",
      };
      Exercise.create.mockResolvedValue(newExercise);

      await ExerciseController.createExercise(req, res, next);

      expect(Exercise.create).toHaveBeenCalledWith({
        Title: "Push Up",
        Desc: "Upper body exercise",
        Type: "Strength",
        BodyPart: "Chest",
        Equipment: "Bodyweight",
        Level: "Beginner",
        Rating: 0,
        RatingDesc: "",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newExercise);
    });

    it("should handle creation errors", async () => {
      const error = new Error("Name and duration are required");
      req.body = { Desc: "No name" };
      Exercise.create.mockRejectedValue(error);

      await ExerciseController.createExercise(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("updateExercise", () => {
    it("should update an exercise", async () => {
      const updatedExercise = {
        _id: "1",
        Title: "Modified Push Up",
        Desc: "Modified description",
        Type: "Strength",
        BodyPart: "Chest",
        Equipment: "Bodyweight",
        Level: "Intermediate",
        Rating: 5,
        RatingDesc: "Great",
      };

      req.params.id = "1";
      req.body = {
        Title: "Modified Push Up",
        Desc: "Modified description",
        Type: "Strength",
        BodyPart: "Chest",
        Equipment: "Bodyweight",
        Level: "Intermediate",
        Rating: 5,
        RatingDesc: "Great",
      };
      Exercise.update.mockResolvedValue(updatedExercise);

      await ExerciseController.updateExercise(req, res, next);

      expect(Exercise.update).toHaveBeenCalledWith("1", {
        Title: "Modified Push Up",
        Desc: "Modified description",
        Type: "Strength",
        BodyPart: "Chest",
        Equipment: "Bodyweight",
        Level: "Intermediate",
        Rating: 5,
        RatingDesc: "Great",
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
});
