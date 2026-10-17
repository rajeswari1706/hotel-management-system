import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { addNewHotel } from '../redux/hotelSlice';
import { addToast } from '../redux/uiSlice';
import HotelForm from '../components/HotelForm';
import { ArrowLeft } from 'lucide-react';

const AddHotelPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      const created = await dispatch(addNewHotel(formData)).unwrap();
      dispatch(
        addToast({
          message: `Hotel "${created.title}" successfully created!`,
          type: 'success',
        })
      );
      navigate('/');
    } catch (err) {
      dispatch(
        addToast({
          message: err || 'Failed to create hotel record.',
          type: 'error',
        })
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Add New Hotel - HotelHub Admin</title>
        <meta
          name="description"
          content="Create a new hotel listing with custom photos, description, night rates, and GPS location coordinates."
        />
      </Helmet>

      <div className="container" style={{ padding: '30px 0 60px 0' }}>
        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Hotel Directory</span>
        </Link>

        <HotelForm
          onSubmit={handleSubmit}
          isLoading={submitting}
          isEdit={false}
        />
      </div>
    </>
  );
};

export default AddHotelPage;
