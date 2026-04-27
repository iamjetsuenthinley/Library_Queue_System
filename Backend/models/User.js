const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const User = {
  // Create new user
  create: async (name, email, password, role = 'student') => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, role]
    );
    return result.rows[0];
  },

  // Find user by email
  findByEmail: async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  // Find user by id
  findById: async (id) => {
    const result = await pool.query('SELECT id, name, email, role FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Compare password
  comparePassword: async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  }
};

module.exports = User;