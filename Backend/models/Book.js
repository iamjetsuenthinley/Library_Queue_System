const pool = require('../config/database');

const Book = {
  // Get all books
  getAll: async () => {
    const result = await pool.query('SELECT * FROM books ORDER BY id');
    return result.rows;
  },

  // Get book by id
  getById: async (id) => {
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Create book
  create: async (title, author, img, description, year) => {
    const result = await pool.query(
      'INSERT INTO books (title, author, img, description, year, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, author, img, description, year, 'available']
    );
    return result.rows[0];
  },

  // Update book status
  updateStatus: async (id, status, borrowerId = null) => {
    const result = await pool.query(
      'UPDATE books SET status = $1, current_borrower_id = $2 WHERE id = $3 RETURNING *',
      [status, borrowerId, id]
    );
    return result.rows[0];
  },

  // Delete book - ADD THIS
  delete: async (id) => {
    const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }
};

module.exports = Book;