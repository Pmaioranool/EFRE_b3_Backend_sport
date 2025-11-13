const { pool } = require("../config/db.postgres");
const Workout = require("./Workout.model");
const bcrypt = require("bcrypt");

class User {
  static async getAll() {
    const res = await pool.query("SELECT * FROM users ORDER BY id");
    return res.rows;
  }

  static async getById(id) {
    const res = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return res.rows[0] || null;
  }

  static async create({ name, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const res = await pool.query(
      "INSERT INTO users (name,email,password) VALUES ($1, $2) RETURNING *",
      [name, email, hashedPassword]
    );
    return res.rows[0];
  }

  static async update(id, { name, email }) {
    const res = await pool.query(
      "UPDATE users SET name = $1, email = $2 WHERE id = $4 RETURNING *",
      [name, email, id]
    );
    return res.rows[0] || null;
  }

  static async updatePassword(id, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const res = await pool.query(
      "UPDATE users SET password = $1 WHERE id = $2 RETURNING *",
      [hashedPassword, id]
    );
    return res.rows[0] || null;
  }

  static async updateLastLogin(id, lastLogin) {
    const res = await pool.query(
      "UPDATE users SET last_login = $1 WHERE id = $2 RETURNING *",
      [lastLogin, id]
    );
    return res.rows[0] || null;
  }

  static async incrementWorkoutsCompleted(id, workoutId) {
    const res = await pool.query(
      "UPDATE users SET workouts_completed = workouts_completed + 1 WHERE id = $1 RETURNING *",
      [id]
    );

    const user = res.rows[0];
    if (!user) return null;

    const workout = await Workout.findById(workoutId);
    if (!workout) return null;

    if (!workout.userId.includes(id)) {
      workout.userId.push(id);
    }

    await workout.save();

    return { user };
  }

  static async delete(id) {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
    return { deleted: true };
  }
}

module.exports = User;
