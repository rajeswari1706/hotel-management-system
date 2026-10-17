/**
 * Validation middleware for Hotel Create and Update requests
 */
const validateHotel = (isUpdate = false) => {
  return (req, res, next) => {
    const { title, description, price, latitude, longitude } = req.body;
    const errors = [];

    // Title validation
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Title is required.');
    } else if (title.trim().length < 3 || title.trim().length > 255) {
      errors.push('Title must be between 3 and 255 characters.');
    }

    // Description validation
    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      errors.push('Description is required.');
    } else if (description.trim().length < 10) {
      errors.push('Description must be at least 10 characters long.');
    }

    // Price validation
    const numPrice = parseFloat(price);
    if (price === undefined || price === null || price === '' || isNaN(numPrice)) {
      errors.push('Price is required and must be a valid number.');
    } else if (numPrice < 0) {
      errors.push('Price cannot be negative.');
    }

    // Latitude validation (-90 to 90)
    const numLat = parseFloat(latitude);
    if (latitude === undefined || latitude === null || latitude === '' || isNaN(numLat)) {
      errors.push('Latitude is required and must be a valid number.');
    } else if (numLat < -90 || numLat > 90) {
      errors.push('Latitude must be between -90.000000 and 90.000000.');
    }

    // Longitude validation (-180 to 180)
    const numLng = parseFloat(longitude);
    if (longitude === undefined || longitude === null || longitude === '' || isNaN(numLng)) {
      errors.push('Longitude is required and must be a valid number.');
    } else if (numLng < -180 || numLng > 180) {
      errors.push('Longitude must be between -180.000000 and 180.000000.');
    }

    // Image validation (required on creation if no existing image is supplied)
    if (!isUpdate && !req.file && !req.body.image_url) {
      errors.push('An image file is required.');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors,
      });
    }

    // Attach parsed numeric values
    req.cleanData = {
      title: title.trim(),
      description: description.trim(),
      price: numPrice,
      latitude: numLat,
      longitude: numLng,
    };

    next();
  };
};

module.exports = {
  validateHotel,
};
