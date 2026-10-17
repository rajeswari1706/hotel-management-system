import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import DeleteModal from './components/DeleteModal';
import HomePage from './pages/HomePage';
import HotelDetailPage from './pages/HotelDetailPage';
import AddHotelPage from './pages/AddHotelPage';
import EditHotelPage from './pages/EditHotelPage';

function App() {
  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content View with SPA Routing */}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hotels/add" element={<AddHotelPage />} />
          <Route path="/hotels/:id" element={<HotelDetailPage />} />
          <Route path="/hotels/edit/:id" element={<EditHotelPage />} />
        </Routes>
      </div>

      {/* Global Delete Confirmation Modal */}
      <DeleteModal />

      {/* Global Toast Notifications (Popups) */}
      <Toast />

      {/* Footer matching Sample UI */}
      <footer
        style={{
          backgroundColor: '#1266f1',
          color: '#ffffff',
          padding: '40px 0 20px 0',
          marginTop: 'auto',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '30px',
              paddingBottom: '30px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <div>
              <h4 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>HotelHub PRO</h4>
              <p style={{ fontSize: '13px', opacity: 0.85, lineHeight: 1.6 }}>
                Full-stack hotel management directory platform with real-time CRUD, Geolocation mapping, and search filters.
              </p>
            </div>
            <div>
              <h5 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', textTransform: 'uppercase' }}>Quick Links</h5>
              <ul style={{ listStyle: 'none', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px', opacity: 0.85 }}>
                <li><a href="/" style={{ color: '#fff' }}>Home Directory</a></li>
                <li><a href="/hotels/add" style={{ color: '#fff' }}>Add New Listing</a></li>
                <li><a href="/#filters" style={{ color: '#fff' }}>Price Range Filter</a></li>
              </ul>
            </div>
            <div>
              <h5 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', textTransform: 'uppercase' }}>Tech Stack</h5>
              <p style={{ fontSize: '13px', opacity: 0.85, lineHeight: 1.6 }}>
                • ReactJS + Redux Toolkit<br />
                • Node.js + Express<br />
                • PostgreSQL (Native SQL)<br />
                • Geolocation &amp; Leaflet Maps
              </p>
            </div>
            <div>
              <h5 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', textTransform: 'uppercase' }}>Developer</h5>
              <p style={{ fontSize: '13px', opacity: 0.85, lineHeight: 1.6 }}>
                Engineered for Namlatech India Pvt Ltd Assignment.
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '20px',
              fontSize: '12px',
              opacity: 0.75,
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div>© 2026 HotelHub. All rights reserved.</div>
            <div>Single Page Application (SPA) Built with React &amp; Express</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
