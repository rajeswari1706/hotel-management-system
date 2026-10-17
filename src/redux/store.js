import { configureStore } from '@reduxjs/toolkit';
import hotelReducer from './hotelSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    hotels: hotelReducer,
    ui: uiReducer,
  },
});

export default store;
