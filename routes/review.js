
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Submit a review
router.post('/:hotelId', async (req, res) => {
  try {
    const { customer_name, rating, message } = req.body;
    const hotelId = Number(req.params.hotelId);
    const stars = Number(rating);

    if (
      !Number.isInteger(hotelId) ||
      hotelId < 1 ||
      !customer_name?.trim() ||
      !Number.isInteger(stars) ||
      stars < 1 ||
      stars > 5 ||
      !message?.trim()
    ) {
      return res.status(400).json({
        message: 'Enter your name, a rating from 1 to 5, and a review.'
      });
    }

    const result = await pool.query(
      `INSERT INTO hotel_reviews
       (hotel_id, customer_name, rating, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [hotelId, customer_name.trim(), stars, message.trim()]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Review error:', error.message);
    res.status(500).json({ message: 'Could not save review.' });
  }
});

// Get reviews for a hotel
router.get('/:hotelId', async (req, res) => {
  try {
    const hotelId = Number(req.params.hotelId);

    if (!Number.isInteger(hotelId) || hotelId < 1) {
      return res.status(400).json({ message: 'Invalid hotel ID.' });
    }

    const result = await pool.query(
      `SELECT id, customer_name, rating, message, created_at
       FROM hotel_reviews
       WHERE hotel_id = $1
       ORDER BY created_at DESC`,
      [hotelId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Review error:', error.message);
    res.status(500).json({ message: 'Could not load reviews.' });
  }
});

module.exports = router;