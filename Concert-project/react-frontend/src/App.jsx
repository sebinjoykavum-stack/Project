import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ConcertCard from './components/ConcertCard';
import { AuthModal, ConcertModal, BookingModal } from './components/Modals';
import * as api from './api';

// Helper: Decode JWT Token
function decodeToken(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("JWT decoding failed:", e);
    return null;
  }
}

export default function App() {
  // Authentication & User States
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(null);
  
  // Concert lists State
  const [concerts, setConcerts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal Control States
  const [authModalTab, setAuthModalTab] = useState(null); // 'login' | 'signup' | null
  const [showConcertModal, setShowConcertModal] = useState(false);
  const [selectedConcertForEdit, setSelectedConcertForEdit] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedConcertForBooking, setSelectedConcertForBooking] = useState(null);

  // Load User Details from Token
  useEffect(() => {
    if (token) {
      setUser(decodeToken(token));
    } else {
      setUser(null);
    }
  }, [token]);

  // Fetch Concerts list
  const loadConcerts = async () => {
    if (!token) return;
    setLoading(true);
    const res = await api.fetchConcerts(token);
    setLoading(false);
    if (res.ok) {
      setConcerts(res.data.data || []);
    } else {
      if (res.status === 401) {
        alert("Session expired. Please log in again.");
        handleLogout();
      } else {
        alert(res.data.message || "Failed to load concerts.");
      }
    }
  };

  useEffect(() => {
    if (token) {
      loadConcerts();
    } else {
      setConcerts([]);
    }
  }, [token]);

  // Auth Handlers
  const handleLogin = async (email, password) => {
    const res = await api.loginUser(email, password);
    if (res.ok) {
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setAuthModalTab(null);
    } else {
      alert(res.data.message || "Login failed.");
    }
  };

  const handleRegister = async (userData) => {
    const res = await api.createUser(userData);
    if (res.ok) {
      alert("Sign up successful! Please log in.");
      setAuthModalTab('login');
    } else {
      if (res.data.errors) {
        const errorsObj = res.data.errors;
        const msg = Object.keys(errorsObj)
          .filter(k => errorsObj[k] !== undefined)
          .map(k => errorsObj[k])
          .join(', ');
        alert("Validation error: " + msg);
      } else {
        alert(res.data.message || "Registration failed.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  // Concert Handlers (Admins only)
  const handleAddOrEditConcert = async (concertPayload) => {
    let res;
    if (selectedConcertForEdit) {
      res = await api.editConcert(selectedConcertForEdit.ConcertId, concertPayload, token);
    } else {
      res = await api.addConcert(concertPayload, token);
    }

    if (res.ok) {
      alert(res.data.message || "Concert updated successfully!");
      setShowConcertModal(false);
      setSelectedConcertForEdit(null);
      loadConcerts();
    } else {
      if (res.data.errors) {
        const errorsObj = res.data.errors;
        const msg = Object.keys(errorsObj)
          .filter(k => errorsObj[k] !== undefined)
          .map(k => errorsObj[k])
          .join(', ');
        alert("Validation error: " + msg);
      } else {
        alert(res.data.message || "Operation failed.");
      }
    }
  };

  const handleDeleteConcert = async (concertId) => {
    if (!window.confirm("Are you sure you want to delete this concert?")) return;
    const res = await api.deleteConcert(concertId, token);
    if (res.ok) {
      alert(res.data.message || "Concert deleted.");
      loadConcerts();
    } else {
      alert(res.data.message || "Delete failed.");
    }
  };

  // Booking Handlers (Users only)
  const handleBookTicket = async (concertId, count) => {
    const res = await api.bookTicket(concertId, count, token);
    if (res.ok) {
      alert(res.data.message || "Ticket booking confirmed!");
      setShowBookingModal(false);
      setSelectedConcertForBooking(null);
      loadConcerts();
    } else {
      alert(res.data.message || "Ticket booking failed.");
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f3f4f6' }}>
      {/* Navigation Bar */}
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onOpenAuth={(tab) => setAuthModalTab(tab)} 
      />

      {/* Hero Header */}
      <header className="hero-section text-center py-5">
        <div className="container">
          <h1 className="hero-title">Your Gateway To <br />
            <span style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Live Experiences
            </span>
          </h1>
          <p className="hero-subtitle mx-auto">Discover and book tickets to the hottest live concert performances. Fully secure booking and live availability updates.</p>
        </div>
      </header>

      {/* Guest View: Logged Out Landing Page */}
      {!user ? (
        <section className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card bg-card border-secondary border-opacity-10 text-center p-5 rounded-4 shadow-lg" style={{ backgroundColor: '#172033' }}>
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-ticket-perforated" viewBox="0 0 16 16" style={{ color: '#a78bfa' }}>
                    <path d="M4 4.85v.9h1v-.9zm7 0v.9h1v-.9zm-7 1.8v.9h1v-.9zm7 0v.9h1v-.9zm-7 1.8v.9h1v-.9zm7 0v.9h1v-.9zm-7 1.8v.9h1v-.9zm7 0v.9h1v-.9z" />
                    <path d="M1.5 3A1.5 1.5 0 0 0 0 4.5V6a.5.5 0 0 0 .5.5 1.5 1.5 0 1 1 0 3 .5.5 0 0 0-.5.5v1.5A1.5 1.5 0 0 0 1.5 13h13a1.5 1.5 0 0 0 1.5-1.5V10a.5.5 0 0 0-.5-.5 1.5 1.5 0 1 1 0-3 .5.5 0 0 0 .5-.5V4.5A1.5 1.5 0 0 0 14.5 3zM1 4.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5v1.05a2.5 2.5 0 0 0 0 4.9v1.05a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-1.05a2.5 2.5 0 0 0 0-4.9z" />
                  </svg>
                </div>
                <h2 className="mb-3">Start Browsing Concerts</h2>
                <p className="text-secondary mb-4 mx-auto" style={{ maxWidth: '500px' }}>To view live concert schedules, check seat availability, edit details, and book tickets, please log in or create an account.</p>
                <div className="d-flex justify-content-center gap-3">
                  <button className="btn btn-premium-primary px-4 py-2.5" onClick={() => setAuthModalTab('login')}>Sign In</button>
                  <button className="btn btn-premium-secondary px-4 py-2.5" onClick={() => setAuthModalTab('signup')}>Create Account</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* Logged In Dashboard */
        <main className="container py-4">
          {user.Admin && (
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="m-0 brand-font fs-3">Manage Concert Events</h2>
              <button className="btn btn-premium-primary d-flex align-items-center gap-2" onClick={() => { setSelectedConcertForEdit(null); setShowConcertModal(true); }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                </svg>
                Add New Concert
              </button>
            </div>
          )}

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="text-secondary mt-3">Fetching concerts details...</p>
            </div>
          ) : concerts.length === 0 ? (
            <div className="empty-state-card text-center p-5 rounded-4">
              <h3>No Concerts Available</h3>
              <p className="text-secondary">There are no upcoming concerts scheduled. Check back later!</p>
            </div>
          ) : (
            <div className="row g-4">
              {concerts.map((concert) => (
                <ConcertCard 
                  key={concert.ConcertId} 
                  concert={concert} 
                  isAdmin={user.Admin} 
                  onEdit={(c) => { setSelectedConcertForEdit(c); setShowConcertModal(true); }}
                  onDelete={handleDeleteConcert}
                  onBook={(c) => { setSelectedConcertForBooking(c); setShowBookingModal(true); }}
                />
              ))}
            </div>
          )}
        </main>
      )}

      {/* Auth Modal (Login / Sign Up) */}
      <AuthModal 
        show={authModalTab !== null} 
        tab={authModalTab} 
        onClose={() => setAuthModalTab(null)} 
        onLogin={handleLogin} 
        onRegister={handleRegister} 
      />

      {/* Concert Creator / Editor Modal */}
      <ConcertModal 
        show={showConcertModal} 
        concert={selectedConcertForEdit} 
        onClose={() => { setShowConcertModal(false); setSelectedConcertForEdit(null); }} 
        onSubmit={handleAddOrEditConcert} 
      />

      {/* Ticket Booking Modal */}
      <BookingModal 
        show={showBookingModal} 
        concert={selectedConcertForBooking} 
        onClose={() => { setShowBookingModal(false); setSelectedConcertForBooking(null); }} 
        onConfirm={handleBookTicket} 
      />
    </div>
  );
}
