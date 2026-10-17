import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchHotelDetails, clearCurrentHotel } from '../redux/hotelSlice';
import { openDeleteModal } from '../redux/uiSlice';
import MapView from '../components/MapView';
import { getImageUrl } from '../services/api';
import {
  ArrowLeft,
  MapPin,
  Star,
  DollarSign,
  Edit3,
  Trash2,
  ShieldCheck,
  Coffee,
  Wifi,
  Sparkles,
} from 'lucide-react';
import '../assets/styles/HotelDetail.css';

const HotelDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState('');
const [checkOut, setCheckOut] = useState('');
const [guests, setGuests] = useState(1);
const [customerName, setCustomerName] = useState('');
const [rating, setRating] = useState('5');
const [reviewMessage, setReviewMessage] = useState('');
const [reviews, setReviews] = useState([]);
const sampleReviews = [
  { id: 1, customer_name: 'Arun', rating: 5, message: 'Excellent hotel, clean rooms and friendly staff!' },
  { id: 2, customer_name: 'Priya', rating: 4, message: 'Very comfortable stay. Food was good.' },
  { id: 3, customer_name: 'Karthik', rating: 5, message: 'Beautiful rooms and great service.' },
  { id: 4, customer_name: 'Divya', rating: 4, message: 'Good location and a pleasant experience.' },
  { id: 5, customer_name: 'Sanjay', rating: 5, message: 'Amazing stay. Would recommend this hotel!' },
];
const [reviewStatus, setReviewStatus] = useState('');
const [reviewLoading, setReviewLoading] = useState(false);

  const { currentHotel, detailLoading, error } = useSelector((state) => state.hotels);
  
  useEffect(() => {
    dispatch(fetchHotelDetails(id));

    return () => {
      dispatch(clearCurrentHotel());
    };
  }, [dispatch, id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/reviews/${id}`
        );

        if (!response.ok) {
          throw new Error('Failed to load reviews');
        }

        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error loading reviews:', error);
      }
    };

    fetchReviews();
  }, [id]);

 

  const handleDelete = () => {
    if (currentHotel) {
      dispatch(openDeleteModal({ id: currentHotel.id, title: currentHotel.title }));
    }
  };
const handleReviewSubmit = async (e) => {
  e.preventDefault();
  setReviewStatus('');
  setReviewLoading(true);

  try {
    const response = await fetch(
      `http://localhost:5000/api/reviews/${id}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          rating: Number(rating),
          message: reviewMessage,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Review submit failed');
    }

    setReviews((previous) => [data, ...previous]);
    setCustomerName('');
    setRating('5');
    setReviewMessage('');
    setReviewStatus('Review submitted successfully!');
  } catch (error) {
    setReviewStatus(error.message || 'Could not submit review.');
  } finally {
    setReviewLoading(false);
  }
};

  if (detailLoading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div className="spinner" />
        <p style={{ color: '#777', marginTop: '10px' }}>Loading hotel details...</p>
      </div>
    );
  }

  if (error || !currentHotel) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>Hotel Not Found</h2>
        <p style={{ color: '#777', margin: '10px 0 20px 0' }}>
          {error || 'The requested hotel could not be retrieved.'}
        </p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Hotel Directory</span>
        </Link>
      </div>
    );
  }

  const snippet = currentHotel.description?.slice(0, 150) || '';
  const nights =
  checkIn && checkOut && new Date(checkOut) > new Date(checkIn)
    ? Math.round(
        (new Date(checkOut) - new Date(checkIn)) / 86400000
      )
    : 0;

const pricePerNight = Number(currentHotel.price || 0);
const subtotal = nights * pricePerNight;
const discount = subtotal * 0.10;
const totalPrice = subtotal - discount;
  
const galleryImages = [
  getImageUrl(currentHotel.image_url),
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1000&auto=format&fit=crop&q=80',
];


  return (
    <>
      {/* Dynamic SEO Meta Tags with React Helmet */}
      <Helmet>
        <title>{`${currentHotel.title} - Hotel Details & Map Location`}</title>
        <meta
          name="description"
          content={`${currentHotel.title}: ${snippet}... Reserve rooms at $${Number(currentHotel.price).toFixed(2)}/night.`}
        />
        <meta property="og:title" content={`${currentHotel.title} - Luxury Stay`} />
        <meta property="og:description" content={snippet} />
        <meta property="og:image" content={getImageUrl(currentHotel.image_url)} />
        <meta property="og:type" content="place" />
      </Helmet>

      <div className="hotel-detail-container container">
        {/* Navigation link */}
        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to All Hotels</span>
        </Link>

        <div className="hotel-detail-layout">
          {/* Main Column */}
          <div className="detail-main-card">
            
<div className="detail-gallery">
  {galleryImages.map((image, index) => (
    <img
      key={index}
      src={image}
      alt={`${currentHotel.title} gallery image ${index + 1}`}
      className={index === 0 ? 'detail-gallery-main' : 'detail-gallery-small'}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  ))}
</div>


            <div className="detail-body">
              <h1 className="detail-title">{currentHotel.title}</h1>

              <div className="detail-meta-row">
                <div className="detail-meta-item">
                  <Star size={16} fill="#f59e0b" color="#f59e0b" />
                  <span style={{ fontWeight: 600 }}>4.9 Superb</span>
                  <span style={{ color: '#9e9e9e' }}>(184 verified guests)</span>
                </div>

                <div className="detail-meta-item">
                  <MapPin size={16} color="#1266f1" />
                  <span>
                    Lat: {Number(currentHotel.latitude).toFixed(6)}, Lng: {Number(currentHotel.longitude).toFixed(6)}
                  </span>
                </div>
              </div>

              {/* Perks Row */}
              <div
                style={{
                  display: 'flex',
                  gap: '16px',
                  padding: '14px 0',
                  borderTop: '1px solid #e0e0e0',
                  borderBottom: '1px solid #e0e0e0',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#4b5563' }}>
                  <Wifi size={16} color="#10b981" /> Free High-Speed Wi-Fi
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#4b5563' }}>
                  <Coffee size={16} color="#10b981" /> Complimentary Gourmet Breakfast
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#4b5563' }}>
                  <ShieldCheck size={16} color="#10b981" /> Free Cancellation up to 24h
                </div>
              </div>

              {/* Description Box */}
              <div className="detail-desc-box">
                <h3>About This Hotel</h3>
                <p className="detail-desc-text">{currentHotel.description}</p>
<section className="customer-reviews">
  <h2>Customer Reviews</h2>

  <form onSubmit={handleReviewSubmit} className="review-form">
    <label>Your Name</label>
    <input
      type="text"
      value={customerName}
      onChange={(e) => setCustomerName(e.target.value)}
      placeholder="Enter your name"
      maxLength={100}
      required
    />

    <label>Rating</label>
    <select
      value={rating}
      onChange={(e) => setRating(e.target.value)}
    >
      <option value="5">⭐⭐⭐⭐⭐ - Excellent</option>
      <option value="4">⭐⭐⭐⭐ - Very Good</option>
      <option value="3">⭐⭐⭐ - Good</option>
      <option value="2">⭐⭐ - Fair</option>
      <option value="1">⭐ - Poor</option>
    </select>

    <label>Your Review</label>
    <textarea
      value={reviewMessage}
      onChange={(e) => setReviewMessage(e.target.value)}
      placeholder="Write your experience..."
      maxLength={2000}
      required
    />

    <button
      type="submit"
      className="btn btn-primary"
      disabled={reviewLoading}
    >
      {reviewLoading ? 'Submitting...' : 'Submit Review'}
    </button>

    {reviewStatus && <p>{reviewStatus}</p>}
  </form>

  <div className="review-list">
   {[...reviews, ...sampleReviews]
  .filter((review, index, arr) =>
    arr.findIndex((item) => item.id === review.id) === index
  )
  .map((review) => (
      <article key={review.id} className="review-item">
        <h3>{review.customer_name}</h3>
        <p>{'⭐'.repeat(review.rating)}</p>
        <p>{review.message}</p>
      </article>
    ))}
  </div>
</section>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="detail-sidebar">
            
<div className="booking-card">
  <div className="booking-price-header">
    <div className="price-big">
      ${pricePerNight.toFixed(2)}
    </div>
    <div style={{ fontSize: '13px', color: '#757575' }}>
      per night / includes all taxes &amp; fees
    </div>
  </div>

  <div style={{ padding: '16px 0' }}>
    <h3>Book Your Stay</h3>

    <label>Check-in Date</label>
    <input
      type="date"
      value={checkIn}
      min={new Date().toLocaleDateString('en-CA')}
      onChange={(e) => {
        setCheckIn(e.target.value);
        if (checkOut && e.target.value >= checkOut) {
          setCheckOut('');
        }
      }}
      required
      style={{ width: '100%', padding: '10px', margin: '6px 0 14px' }}
    />

    <label>Check-out Date</label>
    <input
      type="date"
      value={checkOut}
      min={checkIn || new Date().toLocaleDateString('en-CA')}
      onChange={(e) => setCheckOut(e.target.value)}
      required
      style={{ width: '100%', padding: '10px', margin: '6px 0 14px' }}
    />

    <label>Guests</label>
    <input
      type="number"
      min="1"
      max="20"
      value={guests}
      onChange={(e) =>
        setGuests(Math.max(1, Math.min(20, Number(e.target.value) || 1)))
      }
      style={{ width: '100%', padding: '10px', margin: '6px 0 14px' }}
    />

    {nights > 0 && (
      <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '8px' }}>
        <p>{nights} night(s) × ${pricePerNight.toFixed(2)}</p>
        <p style={{ color: '#15803d' }}>Special Offer: 10% off</p>
        <p>Discount: ${discount.toFixed(2)}</p>
        <h3>Total: ${totalPrice.toFixed(2)}</h3>
      </div>
    )}
  </div>


              <div className="booking-actions">
               <button
  type="button"
  className="btn btn-primary"
  disabled={!checkIn || !checkOut || nights <= 0}
  onClick={() =>
    alert(
      `Booking Demo\nHotel: ${currentHotel.title}\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nGuests: ${guests}\nTotal: $${totalPrice.toFixed(2)}`
    )
  }
>
  <Sparkles size={16} />
  <span>Reserve Room Now</span>
</button>
                <Link
                  to={`/hotels/edit/${currentHotel.id}`}
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                >
                  <Edit3 size={15} />
                  <span>Edit Hotel Listing</span>
                </Link>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn btn-danger"
                  style={{ width: '100%' }}
                >
                  <Trash2 size={15} />
                  <span>Delete Listing</span>
                </button>
              </div>
            </div>

            {/* Interactive Map Card with Geolocation API */}
            <div className="map-card">
              <div className="map-header">
                <h3>Location Map</h3>
                <span className="map-coords-badge">GPS Verified</span>
              </div>

              <MapView
                latitude={currentHotel.latitude}
                longitude={currentHotel.longitude}
                hotelTitle={currentHotel.title}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HotelDetailPage;
