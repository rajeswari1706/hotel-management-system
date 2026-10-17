const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { validateHotel } = require('../middleware/validator');
const {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
} = require('../controllers/hotelController');

// 1. GET /api/hotels - List with filters & pagination
router.get('/', getAllHotels);

// 2. GET /api/hotels/:id - Detail view
router.get('/:id', getHotelById);

// 3. POST /api/hotels - Create new hotel with image upload & validation
router.post('/', upload.single('image'), validateHotel(false), createHotel);

// 4. PUT /api/hotels/:id - Update existing hotel with optional new image & validation
router.put('/:id', upload.single('image'), validateHotel(true), updateHotel);

// 5. DELETE /api/hotels/:id - Delete hotel & its image
router.delete('/:id', deleteHotel);

module.exports = router;
