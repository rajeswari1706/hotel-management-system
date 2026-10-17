import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeDeleteModal, addToast } from '../redux/uiSlice';
import { removeHotel } from '../redux/hotelSlice';
import { AlertTriangle } from 'lucide-react';
import '../assets/styles/Toast.css';

const DeleteModal = () => {
  const dispatch = useDispatch();
  const { isOpen, hotelId, hotelTitle } = useSelector((state) => state.ui.deleteModal);

  if (!isOpen) return null;

  const handleConfirmDelete = async () => {
    try {
      await dispatch(removeHotel(hotelId)).unwrap();
      dispatch(closeDeleteModal());
      // Show success popup upon successful deletion as required!
      dispatch(
        addToast({
          message: `"${hotelTitle}" has been successfully deleted!`,
          type: 'success',
        })
      );
    } catch (err) {
      dispatch(
        addToast({
          message: err || 'Failed to delete hotel.',
          type: 'error',
        })
      );
    }
  };

  return (
    <div className="modal-overlay" onClick={() => dispatch(closeDeleteModal())}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon-danger">
            <AlertTriangle size={22} />
          </div>
          <h3>Delete Hotel Record</h3>
        </div>

        <div className="modal-body">
          Are you sure you want to delete <strong>"{hotelTitle}"</strong>?
          This action will permanently remove the record from the PostgreSQL database and delete the associated image file from the server.
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => dispatch(closeDeleteModal())}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleConfirmDelete}
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
