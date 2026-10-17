import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../services/api';

// Async Thunk: Fetch Paginated & Filtered Hotels
export const fetchHotels = createAsyncThunk(
  'hotels/fetchHotels',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { filters, pagination } = getState().hotels;
      const params = {
        title: filters.title || undefined,
        min_price: filters.minPrice !== '' ? filters.minPrice : undefined,
        max_price: filters.maxPrice !== '' ? filters.maxPrice : undefined,
        sort: filters.sort,
        limit: pagination.limit,
        offset: (pagination.currentPage - 1) * pagination.limit,
      };

      const result = await api.getHotels(params);
      return result;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch hotels'
      );
    }
  }
);

// Async Thunk: Fetch Single Hotel Detail
export const fetchHotelDetails = createAsyncThunk(
  'hotels/fetchHotelDetails',
  async (id, { rejectWithValue }) => {
    try {
      const result = await api.getHotelById(id);
      return result.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch hotel details'
      );
    }
  }
);

// Async Thunk: Create New Hotel
export const addNewHotel = createAsyncThunk(
  'hotels/addNewHotel',
  async (formData, { dispatch, rejectWithValue }) => {
    try {
      const result = await api.createHotel(formData);
      dispatch(fetchHotels());
      return result.data;
    } catch (err) {
      const message = err.response?.data?.errors?.join(', ') ||
                      err.response?.data?.message ||
                      'Failed to create hotel';
      return rejectWithValue(message);
    }
  }
);

// Async Thunk: Update Hotel
export const editHotel = createAsyncThunk(
  'hotels/editHotel',
  async ({ id, formData }, { dispatch, rejectWithValue }) => {
    try {
      const result = await api.updateHotel(id, formData);
      dispatch(fetchHotels());
      return result.data;
    } catch (err) {
      const message = err.response?.data?.errors?.join(', ') ||
                      err.response?.data?.message ||
                      'Failed to update hotel';
      return rejectWithValue(message);
    }
  }
);

// Async Thunk: Delete Hotel
export const removeHotel = createAsyncThunk(
  'hotels/removeHotel',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const result = await api.deleteHotel(id);
      dispatch(fetchHotels());
      return result.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to delete hotel'
      );
    }
  }
);

const initialState = {
  items: [],
  currentHotel: null,
  loading: false,
  detailLoading: false,
  error: null,
  filters: {
    title: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest',
  },
  pagination: {
    total: 0,
    limit: 8,
    currentPage: 1,
    totalPages: 1,
  },
};

const hotelSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {
    setSearchTitle: (state, action) => {
      state.filters.title = action.payload;
      state.pagination.currentPage = 1;
    },
    setPriceRange: (state, action) => {
      state.filters.minPrice = action.payload.minPrice;
      state.filters.maxPrice = action.payload.maxPrice;
      state.pagination.currentPage = 1;
    },
    setSort: (state, action) => {
      state.filters.sort = action.payload;
      state.pagination.currentPage = 1;
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    resetFilters: (state) => {
      state.filters.title = '';
      state.filters.minPrice = '';
      state.filters.maxPrice = '';
      state.filters.sort = 'newest';
      state.pagination.currentPage = 1;
    },
    clearCurrentHotel: (state) => {
      state.currentHotel = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Hotels List
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination.total = action.payload.pagination.total;
        state.pagination.totalPages = action.payload.pagination.totalPages;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Single Hotel
      .addCase(fetchHotelDetails.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchHotelDetails.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.currentHotel = action.payload;
      })
      .addCase(fetchHotelDetails.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSearchTitle,
  setPriceRange,
  setSort,
  setPage,
  resetFilters,
  clearCurrentHotel,
} = hotelSlice.actions;

export default hotelSlice.reducer;
