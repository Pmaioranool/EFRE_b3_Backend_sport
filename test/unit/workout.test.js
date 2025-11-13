const Workout = require("../../src/models/Workout.model");
const WorkoutController = require("../../src/controllers/Workout.controller");

jest.mock("../../src/models/Workout.model");

describe("Workout Controller (with exercises populated)", () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {}, query: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("getWorkout", () => {
    it("should return all workouts with populated exercises", async () => {
      const mockWorkouts = [
        {
          _id: "1",
          name: "Full Body",
          duration: 45,
          exercises: [
            { _id: "e1", Title: "Push Up", Level: "Beginner" },
            { _id: "e2", Title: "Squat", Level: "Beginner" },
          ],
        },
      ];
      Workout.getAll.mockResolvedValue(mockWorkouts);

      await WorkoutController.getWorkout(req, res, next);

      expect(Workout.getAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockWorkouts);

      // extra assertions on exercises presence
      const returned = res.json.mock.calls[0][0];
      expect(returned[0].exercises).toBeInstanceOf(Array);
      expect(returned[0].exercises[0].Title).toBe("Push Up");
    });

    it("should call next on error", async () => {
      const err = new Error("DB fail");
      Workout.getAll.mockRejectedValue(err);

      await WorkoutController.getWorkout(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe("getWorkoutById", () => {
    it("should return a workout by id with exercises populated", async () => {
      const mockWorkout = {
        _id: "1",
        name: "Core",
        duration: 30,
        exercises: [{ _id: "e3", Title: "Plank", Level: "Intermediate" }],
      };
      req.params.id = "1";
      Workout.getById.mockResolvedValue(mockWorkout);

      await WorkoutController.getWorkoutById(req, res, next);

      expect(Workout.getById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockWorkout);

      const returned = res.json.mock.calls[0][0];
      expect(returned.exercises).toHaveLength(1);
      expect(returned.exercises[0].Title).toBe("Plank");
    });

    it("should call next on error", async () => {
      const err = new Error("Not found");
      req.params.id = "bad";
      Workout.getById.mockRejectedValue(err);

      await WorkoutController.getWorkoutById(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe("createWorkout", () => {
    it("should create a workout and return 201 including exercises", async () => {
      const newWorkout = {
        _id: "10",
        name: "Leg Day",
        duration: 60,
        exercises: [{ _id: "e4", Title: "Lunge", Level: "Intermediate" }],
      };

      // controller will forward body to model.create (mocked)
      req.body = {
        name: "Leg Day",
        duration: 60,
        exercises: ["e4"],
      };
      Workout.create.mockResolvedValue(newWorkout);

      await WorkoutController.createWorkout(req, res, next);

      expect(Workout.create).toHaveBeenCalledWith({
        name: "Leg Day",
        duration: 60,
        exercises: ["e4"],
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newWorkout);

      const returned = res.json.mock.calls[0][0];
      expect(returned.exercises[0].Title).toBe("Lunge");
    });

    it("should call next on creation error", async () => {
      const err = new Error("Invalid");
      req.body = {};
      Workout.create.mockRejectedValue(err);

      await WorkoutController.createWorkout(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe("updateWorkout", () => {
    it("should update a workout and return it with exercises", async () => {
      const updated = {
        _id: "1",
        name: "Updated",
        duration: 50,
        exercises: [{ _id: "e5", Title: "Deadlift", Level: "Advanced" }],
      };
      req.params.id = "1";
      req.body = { name: "Updated", duration: 50, exercises: ["e5"] };
      Workout.update.mockResolvedValue(updated);

      await WorkoutController.updateWorkout(req, res, next);

      expect(Workout.update).toHaveBeenCalledWith("1", {
        name: "Updated",
        duration: 50,
        exercises: ["e5"],
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updated);

      const returned = res.json.mock.calls[0][0];
      expect(returned.exercises[0].Title).toBe("Deadlift");
    });

    it("should call next on update error", async () => {
      const err = new Error("Update fail");
      req.params.id = "bad";
      Workout.update.mockRejectedValue(err);

      await WorkoutController.updateWorkout(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe("deleteWorkout", () => {
    it("should delete a workout and return success message", async () => {
      req.params.id = "1";
      Workout.delete.mockResolvedValue({ _id: "1", name: "W1" });

      await WorkoutController.deleteWorkout(req, res, next);

      expect(Workout.delete).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Workout deleted successfully",
      });
    });

    it("should call next on delete error", async () => {
      const err = new Error("Delete fail");
      req.params.id = "bad";
      Workout.delete.mockRejectedValue(err);

      await WorkoutController.deleteWorkout(req, res, next);

      expect(next).toHaveBeenCalledWith(err);
    });
  });
});
