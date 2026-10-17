import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSearchTitle,
  setPriceRange,
  resetFilters,
  fetchHotels,
} from '../redux/hotelSlice';
import { Filter, RotateCcw, DollarSign, Search } from 'lucide-react';

const HotelFilters = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.hotels.filters);

  const [titleInput, setTitleInput] = useState(filters.title);
  const [minPriceInput, setMinPriceInput] = useState(filters.minPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(filters.maxPrice);

  useEffect(() => {
    setTitleInput(filters.title);
    setMinPriceInput(filters.minPrice);
    setMaxPriceInput(filters.maxPrice);
  }, [filters]);

  const handleApplyPriceFilter = (e) => {
    e.preventDefault();
    dispatch(
      setPriceRange({
        minPrice: minPriceInput,
        maxPrice: maxPriceInput,
      })
    );
    dispatch(fetchHotels());
  };

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearchTitle(titleInput));
    dispatch(fetchHotels());
  };

  const handleReset = () => {
    setTitleInput('');
    setMinPriceInput('');
    setMaxPriceInput('');
    dispatch(resetFilters());
    dispatch(fetchHotels());
  };

  return (
    <aside className="filters-sidebar">
      <div className="filters-header">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={18} />
          <span>Filters</span>
        </h3>
        <button onClick={handleReset} className="filter-reset-btn" title="Reset all filters">
          Reset all
        </button>
      </div>

      {/* 1. Filter by Title */}
      <div className="filter-section">
        <div className="filter-title">
          <span>Search by Hotel Name</span>
        </div>
        <form onSubmit={handleTitleSubmit} style={{ display: 'flex', gap: '6px' }}>
          <input
            type="text"
            className="form-input"
            style={{ padding: '8px 10px', fontSize: '13px' }}
            placeholder="e.g. Palace, Beach, Inn..."
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-sm" title="Apply title filter">
            <Search size={14} />
          </button>
        </form>
      </div>

      {/* 2. Filter by Price Range */}
      <div className="filter-section">
        <div className="filter-title">
          <span>Price Range ($)</span>
          <DollarSign size={15} color="#1266f1" />
        </div>

        <form onSubmit={handleApplyPriceFilter}>
          <div className="price-inputs-grid">
            <div className="price-field">
              <label>Min</label>
              <input
                type="number"
                min="0"
                placeholder="$0"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
              />
            </div>
            <div className="price-field">
              <label>Max</label>
              <input
                type="number"
                min="0"
                placeholder="$1,000"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="apply-btn">
            Apply Price Filter
          </button>
        </form>
      </div>

      {/* Extra Amenities info matching MDB sample */}
      <div className="filter-section">
        <div className="filter-title">
          <span>Popular Features</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#555' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked /> Free High-Speed Wi-Fi
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked /> Swimming Pool &amp; Spa
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked /> Free Airport Shuttle
          </label>
        </div>
      </div>
    </aside>
  );
};

export default HotelFilters;
