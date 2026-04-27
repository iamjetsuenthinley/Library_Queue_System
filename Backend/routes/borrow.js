const express = require('express');
const Borrow = require('../models/Borrow');
const Book = require('../models/Book');
const { authMiddleware, isLibrarian } = require('../middleware/auth');
const router = express.Router();

// Request to borrow (student)
router.post('/request', authMiddleware, async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;
    
    const book = await Book.getById(bookId);
    if (book.status !== 'available') {
      return res.status(400).json({ error: 'Book not available' });
    }
    
    const request = await Borrow.request(userId, bookId);
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pending requests (librarian)
router.get('/pending', authMiddleware, isLibrarian, async (req, res) => {
  try {
    const requests = await Borrow.getPendingRequests();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve request (librarian)
router.put('/approve/:id', authMiddleware, isLibrarian, async (req, res) => {
  try {
    const request = await Borrow.approve(req.params.id, req.user.id);
    await Book.updateStatus(request.book_id, 'borrowed', request.user_id);
    res.json(request);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get my active borrows (student)
router.get('/my-borrows', authMiddleware, async (req, res) => {
  try {
    const borrows = await Borrow.getUserActiveBorrows(req.user.id);
    res.json(borrows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;