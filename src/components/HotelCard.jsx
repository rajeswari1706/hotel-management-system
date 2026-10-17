import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openDeleteModal } from '../redux/uiSlice';
import { Star, MapPin, Eye, Edit3, Trash2 } from 'lucide-react';
import { getImageUrl } from '../services/api';
import '../assets/styles/HotelCard.css';

const resortImages = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&auto=format&fit=crop&q=80',
];

const getResortImage = (hotel) => {
  const id = Number(hotel.id) || 1;
  return resortImages[(id - 1) % resortImages.length];
};


const HotelCard = ({ hotel }) => {
  const dispatch = useDispatch();

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    dispatch(openDeleteModal({ id: hotel.id, title: hotel.title }));
  };

  return (
    <article className="hotel-card">
      {/* 1. Hotel Image with Alt Tag for SEO */}
      <div className="hotel-card-media">
        <img
         src={getResortImage(hotel)}
          alt={`Exterior view and luxury suites at ${hotel.title}`}
          className="hotel-card-img"
          loading="lazy"
          onError={(e) => {
  e.currentTarget.onerror = null;
  e.currentTarget.src = resortImages[0];
}}
        />
        <div className="hotel-card-badge">
          <Star size={12} fill="#f59e0b" color="#f59e0b" />
          <span>4.8 Star</span>
        </div>
      </div>

      {/* 2. Hotel Details (Title, Description, Coordinates) */}
      <div className="hotel-card-body">
        <div>
          <h2 className="hotel-card-title">
            <Link to={`/hotels/${hotel.id}`} title={`View details for ${hotel.title}`}>
              {hotel.title}
            </Link>
          </h2>

          <div className="hotel-card-rating">
            <div className="stars">
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
            </div>
            <span className="rating-score">4.8</span>
            <span className="reviews-count">(120+ verified reviews)</span>
          </div>

          <p className="hotel-card-desc">
            {hotel.description}
          </p>
        </div>
<div className="hotel-card-coords">
  <MapPin size={15} />
  <span>
    {hotel.location ||
      (hotel.latitude && hotel.longitude
        ? `${Number(hotel.latitude).toFixed(4)}° N, ${Number(hotel.longitude).toFixed(4)}° E`
        : "Location not available")}
  </span>
</div>
      </div>

      {/* 3. Price & Action Buttons */}
      <div className="hotel-card-sidebar">
        <div className="hotel-price-wrap">
          <div className="price-val">${Number(hotel.price).toFixed(2)}</div>
          <div className="price-sub">per night / taxes included</div>
          <div className="perk-tag">✓ Free cancellation</div>
        </div>

        <div className="hotel-actions-group">
          <Link
            to={`/hotels/${hotel.id}`}
            className="btn btn-primary"
            title={`View full details of ${hotel.title}`}
          >
            <Eye size={15} />
            <span>View Details</span>
          </Link>

          <div className="actions-row">
            <Link
              to={`/hotels/edit/${hotel.id}`}
              className="btn btn-secondary btn-sm"
              title={`Edit ${hotel.title}`}
            >
              <Edit3 size={14} />
              <span>Edit</span>
            </Link>

            <button
              onClick={handleDeleteClick}
              className="btn btn-danger btn-sm"
              title={`Delete ${hotel.title}`}
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default HotelCard;
