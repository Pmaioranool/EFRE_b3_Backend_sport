const { pool } = require("../config/db.postgres");
const Workout = require("./Workout.model");
const bcrypt = require("bcrypt");
const JWTService = require("../utils/jwt");

class User {
  static async getAll() {
    const res = await pool.query(
      "SELECT id, name, email, role, workouts_completed, last_login, created_at, updated_at FROM users ORDER BY id"
    );
    return res.rows;
  }

  static async getById(id) {
    const res = await pool.query(
      "SELECT id, name, email, role, workouts_completed, last_login, created_at, updated_at FROM users WHERE id = $1",
      [id]
    );
    return res.rows[0] || null;
  }

  static async getByEmail(email) {
    const res = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return res.rows[0] || null;
  }

  static async create({ name, email, password, role = "user" }) {
    const hashedPassword = await JWTService.hashPassword(password);
    const res = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, workouts_completed, last_login, created_at, updated_at",
      [name, email, hashedPassword, role]
    );
    return res.rows[0];
  }

  static async update(id, { name, email, role }) {
    const res = await pool.query(
      "UPDATE users SET name = $1, email = $2, role = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, name, email, role, workouts_completed, last_login, created_at, updated_at",
      [name, email, role, id]
    );
    return res.rows[0] || null;
  }

  static async updatePassword(id, password) {
    const hashedPassword = await JWTService.hashPassword(password);
    const res = await pool.query(
      "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, name, email, role, workouts_completed, last_login, created_at, updated_at",
      [hashedPassword, id]
    );
    return res.rows[0] || null;
  }

  static async updateLastLogin(id, lastLogin) {
    const res = await pool.query(
      "UPDATE users SET last_login = $1 WHERE id = $2 RETURNING id, name, email, role, workouts_completed, last_login, created_at, updated_at",
      [lastLogin, id]
    );
    return res.rows[0] || null;
  }

  static async incrementWorkoutsCompleted(id, workoutId) {
    const res = await pool.query(
      "UPDATE users SET workouts_completed = workouts_completed + 1 WHERE id = $1 RETURNING id, name, email, role, workouts_completed, last_login, created_at, updated_at",
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
