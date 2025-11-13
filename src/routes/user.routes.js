const router = require("express").Router();
const ctrl = require("../controllers/User.controller");

router.get("/", ctrl.getUser);
router.get("/:id", ctrl.getUserById);
router.post("/", ctrl.createUser);
router.put("/:id", ctrl.updateUser);
router.put("/:id/password", ctrl.updateUserPassword);
router.put("/:id/last-login", ctrl.updateUserLastLogin);
router.put("/:id/workouts-completed", ctrl.incrementUserWorkoutsCompleted);
router.delete("/:id", ctrl.deleteUser);
module.exports = router;
