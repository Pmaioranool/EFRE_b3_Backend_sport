const router = require("express").Router();
const ctrl = require("../controllers/Exercise.controller");

router.get("/", ctrl.getExercise);
router.get("/:id", ctrl.getExerciseById);
router.post("/", ctrl.createExercise);
router.put("/:id", ctrl.updateExercise);
router.delete("/:id", ctrl.deleteExercise);
module.exports = router;
