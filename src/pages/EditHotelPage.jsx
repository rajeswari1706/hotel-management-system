import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchHotelDetails, editHotel } from '../redux/hotelSlice';
import { addToast } from '../redux/uiSlice';
import HotelForm from '../components/HotelForm';
import { ArrowLeft } from 'lucide-react';

const EditHotelPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentHotel, detailLoading, error } = useSelector((state) => state.hotels);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchHotelDetails(id));
  }, [dispatch, id]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const updated = await dispatch(editHotel({ id, formData })).unwrap();
      dispatch(
        addToast({
          message: `Hotel "${updated.title}" successfully updated!`,
          type: 'success',
        })
      );
      navigate(`/hotels/${id}`);
    } catch (err) {
      dispatch(
        addToast({
          message: err || 'Failed to update hotel record.',
          type: 'error',
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (detailLoading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div className="spinner" />
        <p style={{ color: '#777', marginTop: '10px' }}>Loading hotel for editing...</p>
      </div>
    );
  }

  if (error || !currentHotel) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h2>Hotel Not Found</h2>
        <p style={{ color: '#777', margin: '10px 0 20px 0' }}>{error || 'Unable to load hotel details.'}</p>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Hotel Directory</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Edit ${currentHotel.title} - HotelHub Admin`}</title>
        <meta
          name="description"
          content={`Update details, pricing, photos, and GPS coordinates for ${currentHotel.title}.`}
        />
      </Helmet>

      <div className="container" style={{ padding: '30px 0 60px 0' }}>
        <Link to={`/hotels/${id}`} className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Hotel Details</span>
        </Link>

        <HotelForm
          initialData={currentHotel}
          onSubmit={handleSubmit}
          isLoading={submitting}
          isEdit={true}
        />
      </div>
    </>
  );
};

export default EditHotelPage;
