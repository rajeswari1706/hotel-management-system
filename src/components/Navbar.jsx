import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTitle, fetchHotels } from '../redux/hotelSlice';
import { Search, Hotel, PlusCircle, Compass } from 'lucide-react';
import '../assets/styles/Navbar.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentTitleFilter = useSelector((state) => state.hotels.filters.title);
  const [searchInput, setSearchInput] = useState(currentTitleFilter);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearchTitle(searchInput));
    dispatch(fetchHotels());
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <header className="navbar-wrapper">
      <div className="container">
        <div className="navbar-top">
          {/* Brand Logo */}
          <Link to="/" className="navbar-brand">
            <Hotel size={26} color="#1266f1" />
            <span>Hotel<span style={{ color: '#262626' }}>Hub</span></span>
            <span className="brand-badge">PRO</span>
          </Link>

          {/* Search Bar */}
          <form className="navbar-search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search hotels by name or destination..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" title="Search">
              <Search size={18} />
            </button>
          </form>

          {/* Action Links */}
          <nav className="navbar-actions">
            <Link to="/" className="navbar-action-item">
              <Compass size={18} />
              <span>Browse</span>
            </Link>
            <Link to="/hotels/add" className="btn btn-primary btn-sm">
              <PlusCircle size={16} />
              <span>Add Hotel</span>
            </Link>
          </nav>
        </div>
      </div>

      {/* Breadcrumb banner */}
      <div className="navbar-banner">
        <div className="container navbar-banner-content">
          <h1>Hotel Directory &amp; Suites</h1>
          <div className="navbar-banner-breadcrumbs">
            <Link to="/" style={{ color: '#fff' }}>Home</Link>
            <span>&gt;</span>
            <span>Hotels</span>
            {location.pathname.includes('/add') && (
              <>
                <span>&gt;</span>
                <span>Add New Hotel</span>
              </>
            )}
            {location.pathname.includes('/edit') && (
              <>
                <span>&gt;</span>
                <span>Edit Hotel</span>
              </>
            )}
            {location.pathname.match(/\/hotels\/\d+$/) && (
              <>
                <span>&gt;</span>
                <span>Hotel Details</span>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
