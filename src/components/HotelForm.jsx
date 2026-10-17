import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, X, MapPin, Loader2 } from 'lucide-react';
import { getImageUrl } from '../services/api';
import '../assets/styles/HotelForm.css';

/**
 * Reusable single form component for both Adding and Editing hotel details
 */
const HotelForm = ({ initialData = null, onSubmit, isLoading = false, isEdit = false }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    latitude: '',
    longitude: '',
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [detectingGeo, setDetectingGeo] = useState(false);

  // Initialize form state when initialData changes (Edit Mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price !== undefined ? initialData.price.toString() : '',
        latitude: initialData.latitude !== undefined ? initialData.latitude.toString() : '',
        longitude: initialData.longitude !== undefined ? initialData.longitude.toString() : '',
      });
      if (initialData.image_url) {
        setPreviewUrl(getImageUrl(initialData.image_url));
      }
    }
  }, [initialData]);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for field once edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Handle image file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors((prev) => ({ ...prev, image: 'Please select a valid image file (JPEG, PNG, WEBP)' }));
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, image: null }));
    }
  };

  // Remove selected image / clear preview
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Browser Geolocation API helper to auto-populate coordinates
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation API is not supported by your browser.');
      return;
    }
    setDetectingGeo(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
        setDetectingGeo(false);
        setErrors((prev) => ({ ...prev, latitude: null, longitude: null }));
      },
      (error) => {
        setDetectingGeo(false);
        alert(`Could not retrieve location: ${error.message}`);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Client-side Validation
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Hotel title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Hotel description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    const priceNum = parseFloat(formData.price);
    if (!formData.price || isNaN(priceNum)) {
      newErrors.price = 'Price is required and must be numeric';
    } else if (priceNum < 0) {
      newErrors.price = 'Price cannot be negative';
    }

    const latNum = parseFloat(formData.latitude);
    if (!formData.latitude || isNaN(latNum)) {
      newErrors.latitude = 'Latitude is required';
    } else if (latNum < -90 || latNum > 90) {
      newErrors.latitude = 'Latitude must be between -90 and 90';
    }

    const lngNum = parseFloat(formData.longitude);
    if (!formData.longitude || isNaN(lngNum)) {
      newErrors.longitude = 'Longitude is required';
    } else if (lngNum < -180 || lngNum > 180) {
      newErrors.longitude = 'Longitude must be between -180 and 180';
    }

    // On Add, image is required
    if (!isEdit && !selectedFile && !previewUrl) {
      newErrors.image = 'An image is required for creating a hotel';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = new FormData();
    data.append('title', formData.title.trim());
    data.append('description', formData.description.trim());
    data.append('price', formData.price);
    data.append('latitude', formData.latitude);
    data.append('longitude', formData.longitude);

    if (selectedFile) {
      data.append('image', selectedFile);
    } else if (previewUrl && isEdit) {
      // Retain existing image
      data.append('image_url', initialData?.image_url || '');
    }

    onSubmit(data);
  };

  return (
    <div className="hotel-form-card">
      <div className="form-header">
        <h2>{isEdit ? 'Edit Hotel Listing' : 'Create New Hotel Listing'}</h2>
        <p>
          {isEdit
            ? 'Update the hotel details, pricing, location coordinates, or replace the photo.'
            : 'Fill in the information below to add a new hotel to the directory.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* 1. Title Input */}
        <div className="form-group">
          <label htmlFor="hotel-title">
            Hotel Title <span className="req">*</span>
          </label>
          <input
            id="hotel-title"
            type="text"
            name="title"
            className={`form-input ${errors.title ? 'has-error' : ''}`}
            placeholder="e.g. Grand Horizon Palace & Spa"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && <div className="error-msg">{errors.title}</div>}
        </div>

        {/* 2. Image Upload with Preview Capability */}
        <div className="form-group">
          <label>
            Hotel Image <span className="req">*</span>
          </label>
          <div className="image-upload-wrapper">
            {previewUrl ? (
              <div className="image-preview-box">
                <img
                  src={previewUrl}
                  alt="Hotel preview"
                  className="image-preview-img"
                />
                <button
                  type="button"
                  className="image-remove-btn"
                  onClick={handleRemoveImage}
                  title="Remove Image"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div
                className={`image-dropzone ${errors.image ? 'has-error' : ''}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="upload-icon-box">
                  <UploadCloud size={24} />
                </div>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                  Click to upload hotel photo
                </div>
                <div style={{ fontSize: '12px', color: '#777' }}>
                  PNG, JPG, WEBP, or SVG (Max 5MB)
                </div>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            {errors.image && <div className="error-msg">{errors.image}</div>}
          </div>
        </div>

        {/* 3. Description Input */}
        <div className="form-group">
          <label htmlFor="hotel-description">
            Description <span className="req">*</span>
          </label>
          <textarea
            id="hotel-description"
            name="description"
            rows={4}
            className={`form-textarea ${errors.description ? 'has-error' : ''}`}
            placeholder="Describe the hotel amenities, ambience, room types, dining, and scenic surroundings..."
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && <div className="error-msg">{errors.description}</div>}
        </div>

        {/* 4. Price Input */}
        <div className="form-group">
          <label htmlFor="hotel-price">
            Price per Night (USD $) <span className="req">*</span>
          </label>
          <input
            id="hotel-price"
            type="number"
            step="0.01"
            min="0"
            name="price"
            className={`form-input ${errors.price ? 'has-error' : ''}`}
            placeholder="e.g. 199.99"
            value={formData.price}
            onChange={handleChange}
          />
          {errors.price && <div className="error-msg">{errors.price}</div>}
        </div>

        {/* 5. Latitude & Longitude Inputs with Geolocation API Detection */}
        <div className="coords-header">
          <label style={{ fontSize: '14px', fontWeight: 600 }}>
            Geographic Coordinates <span className="req">*</span>
          </label>
          <button
            type="button"
            className="geo-btn"
            onClick={handleDetectLocation}
            disabled={detectingGeo}
            title="Use browser Geolocation API to auto-fill your current coordinates"
          >
            <MapPin size={13} />
            {detectingGeo ? 'Detecting Location...' : 'Detect My Location'}
          </button>
        </div>

        <div className="form-row-2">
          <div className="form-group">
            <label htmlFor="hotel-latitude" style={{ fontSize: '13px', fontWeight: 500 }}>
              Latitude (-90 to 90)
            </label>
            <input
              id="hotel-latitude"
              type="number"
              step="any"
              name="latitude"
              className={`form-input ${errors.latitude ? 'has-error' : ''}`}
              placeholder="e.g. 19.0760"
              value={formData.latitude}
              onChange={handleChange}
            />
            {errors.latitude && <div className="error-msg">{errors.latitude}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="hotel-longitude" style={{ fontSize: '13px', fontWeight: 500 }}>
              Longitude (-180 to 180)
            </label>
            <input
              id="hotel-longitude"
              type="number"
              step="any"
              name="longitude"
              className={`form-input ${errors.longitude ? 'has-error' : ''}`}
              placeholder="e.g. 72.8777"
              value={formData.longitude}
              onChange={handleChange}
            />
            {errors.longitude && <div className="error-msg">{errors.longitude}</div>}
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="spinner" style={{ margin: 0, width: 16, height: 16 }} />
                <span>Saving Hotel...</span>
              </>
            ) : (
              <span>{isEdit ? 'Save Changes' : 'Create Hotel'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelForm;
