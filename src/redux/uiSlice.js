import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toasts: [],
  deleteModal: {
    isOpen: false,
    hotelId: null,
    hotelTitle: '',
  },
};

let toastIdCounter = 0;

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    addToast: (state, action) => {
      // payload can be string or { message, type }
      const message = typeof action.payload === 'string' ? action.payload : action.payload.message;
      const type = typeof action.payload === 'object' && action.payload.type ? action.payload.type : 'success';
      state.toasts.push({
        id: ++toastIdCounter,
        message,
        type,
      });
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    openDeleteModal: (state, action) => {
      state.deleteModal = {
        isOpen: true,
        hotelId: action.payload.id,
        hotelTitle: action.payload.title,
      };
    },
    closeDeleteModal: (state) => {
      state.deleteModal = {
        isOpen: false,
        hotelId: null,
        hotelTitle: '',
      };
    },
  },
});

export const { addToast, removeToast, openDeleteModal, closeDeleteModal } = uiSlice.actions;

export default uiSlice.reducer;
