const path = require('path');
const fs = require('fs');
const db = require('../config/db');

/**
 * Helper to safely delete an uploaded image from local storage
 */
const deleteLocalImage = (imageUrl) => {
  if (!imageUrl) return;
  // Only remove if it's within /uploads/ and not a seed or external URL
  if (imageUrl.startsWith('/uploads/')) {
    const filename = path.basename(imageUrl);
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`Deleted local image file: ${filePath}`);
      } catch (err) {
        console.error(`Failed to delete local image: ${filePath}`, err);
      }
    }
  }
};

/**
 * 1. GET /api/hotels
 * Supports search filters (title, price range min/max) and pagination (limit, offset)
 * Uses Native SQL queries
 */
const getAllHotels = async (req, res, next) => {
  try {
    const { title, min_price, max_price, limit = 6, offset = 0, sort = 'newest' } = req.query;

    const parsedLimit = Math.max(1, parseInt(limit, 10) || 6);
    const parsedOffset = Math.max(0, parseInt(offset, 10) || 0);

    const conditions = [];
    const values = [];

    // Filter by title
    if (title && title.trim()) {
      values.push(`%${title.trim().toLowerCase()}%`);
      conditions.push(`LOWER(title) LIKE $${values.length}`);
    }

    // Filter by min_price
    if (min_price !== undefined && min_price !== '') {
      const minP = parseFloat(min_price);
      if (!isNaN(minP)) {
        values.push(minP);
        conditions.push(`price >= $${values.length}`);
      }
    }

    // Filter by max_price
    if (max_price !== undefined && max_price !== '') {
      const maxP = parseFloat(max_price);
      if (!isNaN(maxP)) {
        values.push(maxP);
        conditions.push(`price <= $${values.length}`);
      }
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Sorting
    let orderByClause = 'ORDER BY created_at DESC';
    if (sort === 'price_asc') {
      orderByClause = 'ORDER BY price ASC';
    } else if (sort === 'price_desc') {
      orderByClause = 'ORDER BY price DESC';
    } else if (sort === 'title_asc') {
      orderByClause = 'ORDER BY title ASC';
    }

    // Native SQL query for total count
    const countQuery = `SELECT COUNT(*) AS total FROM hotels ${whereClause}`;
    const countResult = await db.query(countQuery, values);
    const total = parseInt(countResult.rows[0].total, 10);

    // Native SQL query for paginated results
    const dataValues = [...values, parsedLimit, parsedOffset];
    const dataQuery = `
      SELECT id, title, description, price, latitude, longitude, image_url, created_at, updated_at
      FROM hotels
      ${whereClause}
      ${orderByClause}
      LIMIT $${dataValues.length - 1} OFFSET $${dataValues.length}
    `;

    const dataResult = await db.query(dataQuery, dataValues);

    const currentPage = Math.floor(parsedOffset / parsedLimit) + 1;
    const totalPages = Math.ceil(total / parsedLimit);

    res.status(200).json({
      success: true,
      data: dataResult.rows,
      pagination: {
        total,
        limit: parsedLimit,
        offset: parsedOffset,
        currentPage,
        totalPages,
        hasMore: currentPage < totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 2. GET /api/hotels/:id
 * Fetches single hotel details by ID using Native SQL
 */
const getHotelById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM hotels WHERE id = $1';
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Hotel with ID ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 3. POST /api/hotels
 * Creates a new hotel record with image upload
 * Uses Native SQL INSERT
 */
const createHotel = async (req, res, next) => {
  try {
    const { title, description, price, latitude, longitude } = req.cleanData;

    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.image_url) {
      imageUrl = req.body.image_url;
    }

    const insertQuery = `
      INSERT INTO hotels (title, description, price, latitude, longitude, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [title, description, price, latitude, longitude, imageUrl];

    const result = await db.query(insertQuery, values);
    const newHotel = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Hotel record created successfully',
      data: newHotel,
    });
  } catch (error) {
    // If insertion failed, cleanup uploaded file if any
    if (req.file) {
      deleteLocalImage(`/uploads/${req.file.filename}`);
    }
    next(error);
  }
};

/**
 * 4. PUT /api/hotels/:id
 * Updates an existing hotel record by ID
 * Uses Native SQL UPDATE
 */
const updateHotel = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, price, latitude, longitude } = req.cleanData;

    // Check if record exists
    const checkQuery = 'SELECT * FROM hotels WHERE id = $1';
    const checkResult = await db.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      if (req.file) {
        deleteLocalImage(`/uploads/${req.file.filename}`);
      }
      return res.status(404).json({
        success: false,
        message: `Hotel with ID ${id} not found`,
      });
    }

    const existingHotel = checkResult.rows[0];
    let newImageUrl = existingHotel.image_url;

    // If new image uploaded, replace old image
    if (req.file) {
      newImageUrl = `/uploads/${req.file.filename}`;
      // Clean up previous image file if it's not seed
      if (!existingHotel.image_url.includes('seed_')) {
        deleteLocalImage(existingHotel.image_url);
      }
    } else if (req.body.image_url && req.body.image_url !== existingHotel.image_url) {
      newImageUrl = req.body.image_url;
    }

    const updateQuery = `
      UPDATE hotels
      SET title = $1, description = $2, price = $3, latitude = $4, longitude = $5, image_url = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `;
    const values = [title, description, price, latitude, longitude, newImageUrl, id];

    const result = await db.query(updateQuery, values);
    const updatedHotel = result.rows[0];

    res.status(200).json({
      success: true,
      message: 'Hotel record updated successfully',
      data: updatedHotel,
    });
  } catch (error) {
    if (req.file) {
      deleteLocalImage(`/uploads/${req.file.filename}`);
    }
    next(error);
  }
};

/**
 * 5. DELETE /api/hotels/:id
 * Deletes a hotel record and removes its uploaded image
 * Uses Native SQL DELETE
 */
const deleteHotel = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Native SQL DELETE with RETURNING
    const deleteQuery = 'DELETE FROM hotels WHERE id = $1 RETURNING *';
    const result = await db.query(deleteQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Hotel with ID ${id} not found`,
      });
    }

    const deletedHotel = result.rows[0];

    // Delete associated image file from disk if not a seed placeholder
    if (deletedHotel.image_url && !deletedHotel.image_url.includes('seed_')) {
      deleteLocalImage(deletedHotel.image_url);
    }

    res.status(200).json({
      success: true,
      message: 'Hotel record deleted successfully',
      data: deletedHotel,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
};
