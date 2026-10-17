import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { fetchHotels, setPage, setSort } from '../redux/hotelSlice';
import HotelCard from '../components/HotelCard';
import HotelFilters from '../components/HotelFilters';
import Pagination from '../components/Pagination';
import { Building, Sparkles } from 'lucide-react';
import '../assets/styles/HotelList.css';

const HomePage = () => {
  const dispatch = useDispatch();
  const { items, loading, error, pagination, filters } = useSelector(
    (state) => state.hotels
  );

  useEffect(() => {
    dispatch(fetchHotels());
  }, [dispatch, pagination.currentPage, filters.sort]);

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (e) => {
    dispatch(setSort(e.target.value));
  };

  return (
    <>
      {/* Dynamic SEO Meta Tags via React Helmet */}
      <Helmet>
        <title>Hotel Directory - Find &amp; Compare Luxury Stays</title>
        <meta
          name="description"
          content="Explore top rated hotels, oceanfront villas, mountain chalets and boutique suites. Filter by price, search by title, and book your dream stay."
        />
        <meta property="og:title" content="Hotel Directory - Luxury Stays &amp; Suites" />
        <meta
          property="og:description"
          content="Discover premier hotel accommodations, view precise coordinates on map, and manage listings."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <main className="container">
        <div className="hotels-layout">
          {/* Left Column: Search & Filters Sidebar */}
          <HotelFilters />

          {/* Right Column: Hotel Listings & Pagination */}
          <div className="hotels-content">
            {/* Toolbar */}
            <div className="hotels-toolbar">
              <div className="items-count">
                {loading ? (
                  <span>Searching hotel listings...</span>
                ) : (
                  <span>
                    <strong>{pagination.total}</strong> hotels found
                    {filters.title && ` for "${filters.title}"`}
                  </span>
                )}
              </div>

              <div className="toolbar-controls">
                <label htmlFor="sort-dropdown" style={{ fontSize: '13px', color: '#555' }}>
                  Sort by:
                </label>
                <select
                  id="sort-dropdown"
                  className="sort-select"
                  value={filters.sort}
                  onChange={handleSortChange}
                >
                  <option value="newest">Recently Added</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="title_asc">Name: A to Z</option>
                </select>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #f87171',
                  color: '#b91c1c',
                  padding: '14px 18px',
                  borderRadius: '8px',
                }}
              >
                <strong>Error:</strong> {error}
              </div>
            )}

            {/* Loading Indicator */}
            {loading && <div className="spinner" />}

            {/* Hotel Cards List */}
            {!loading && items.length > 0 && (
              <div className="hotels-cards-list">
                {items.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && items.length === 0 && !error && (
              <div className="no-hotels">
                <Building size={48} color="#9e9e9e" style={{ margin: '0 auto 12px auto' }} />
                <h3>No Hotels Found</h3>
                <p>Try clearing your search query or adjusting your price filters.</p>
              </div>
            )}

            {/* Pagination Component */}
            {!loading && pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default HomePage;
