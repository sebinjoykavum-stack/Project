import React, { useState, useEffect } from 'react';

/**
 * AuthModal: Handles Login & Registration tabs
 */
export function AuthModal({ show, tab = 'login', onClose, onLogin, onRegister }) {
  const [activeTab, setActiveTab] = useState(tab);
  
  // Login States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  
  // Signup States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setActiveTab(tab);
  }, [tab, show]);

  if (!show) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    onLogin(loginEmail, loginPass);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    onRegister({ name, email, age: parseInt(age), password, confirmPassword, Admin: isAdmin });
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content modal-content-glass text-white">
          <div className="modal-header border-0">
            <h5 className="modal-title">SoundWave Gate</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body px-4">
            <div className="auth-nav-tabs d-flex">
              <button className={`auth-nav-link ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>Sign In</button>
              <button className={`auth-nav-link ${activeTab === 'signup' ? 'active' : ''}`} onClick={() => setActiveTab('signup')}>Sign Up</button>
            </div>
            
            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit}>
                <div className="mb-3">
                  <label className="form-label text-secondary small">Email Address</label>
                  <input type="email" className="form-control form-control-dark" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="name@example.com" required />
                </div>
                <div className="mb-4">
                  <label className="form-label text-secondary small">Password</label>
                  <input type="password" class="form-control form-control-dark" value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="••••••••" required />
                </div>
                <button type="submit" className="btn btn-premium-primary w-100 py-2.5 mb-3">Sign In</button>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit}>
                <div className="mb-3">
                  <label className="form-label text-secondary small">Full Name</label>
                  <input type="text" className="form-control form-control-dark" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required minLength="3" maxLength="30" />
                </div>
                <div className="row mb-3">
                  <div className="col-md-7">
                    <label className="form-label text-secondary small">Email Address</label>
                    <input type="email" className="form-control form-control-dark" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" required />
                  </div>
                  <div className="col-md-5">
                    <label className="form-label text-secondary small">Age</label>
                    <input type="number" className="form-control form-control-dark" value={age} onChange={e => setAge(e.target.value)} placeholder="18" required min="18" />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col">
                    <label className="form-label text-secondary small">Password</label>
                    <input type="password" className="form-control form-control-dark" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={8} />
                  </div>
                  <div className="col">
                    <label className="form-label text-secondary small">Confirm</label>
                    <input type="password" className="form-control form-control-dark" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" required minLength={8} />
                  </div>
                </div>
                <div className="mb-4 form-check">
                  <input type="checkbox" className="form-check-input" id="reactAdminCheck" checked={isAdmin} onChange={e => setIsAdmin(e.target.checked)} style={{ backgroundColor: 'rgba(15,22,38,0.5)', border: '1px solid rgba(255,255,255,0.08)' }} />
                  <label className="form-check-label text-secondary small" htmlFor="reactAdminCheck">Register as an Administrator account</label>
                </div>
                <button type="submit" className="btn btn-premium-primary w-100 py-2.5 mb-3">Sign Up</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ConcertModal: Handles both Create & Edit modes
 */
export function ConcertModal({ show, concert = null, onClose, onSubmit }) {
  const [concertId, setConcertId] = useState('');
  const [concertName, setConcertName] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [price, setPrice] = useState('');
  const [totalTickets, setTotalTickets] = useState('');

  useEffect(() => {
    if (concert) {
      setConcertId(concert.ConcertId || '');
      setConcertName(concert.ConcertName || '');
      
      const dateObj = new Date(concert.date);
      const tzOffset = dateObj.getTimezoneOffset() * 60000;
      const localISODate = (new Date(dateObj - tzOffset)).toISOString().slice(0, 16);
      setDate(localISODate);
      
      setVenue(concert.venue || '');
      setPrice(concert.price || '');
      setTotalTickets(concert.TotalTickets || '');
    } else {
      setConcertId('');
      setConcertName('');
      setDate('');
      setVenue('');
      setPrice('');
      setTotalTickets('');
    }
  }, [concert, show]);

  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ConcertName: concertName,
      date: date,
      venue: venue,
      price: parseFloat(price),
      TotalTickets: parseInt(totalTickets)
    };
    if (!concert) {
      payload.ConcertId = concertId; // only sent during Creation
    }
    onSubmit(payload);
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content modal-content-glass text-white">
          <div className="modal-header border-0">
            <h5 className="modal-title">{concert ? 'Edit Concert Details' : 'Create Concert Event'}</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body px-4">
              <div className="row mb-3">
                <div className="col-md-5">
                  <label className="form-label text-secondary small">Concert ID (Unique)</label>
                  <input type="text" className="form-control form-control-dark" value={concertId} onChange={e => setConcertId(e.target.value)} disabled={!!concert} placeholder="e.g. METAL2026" required />
                </div>
                <div className="col-md-7">
                  <label className="form-label text-secondary small">Concert Title</label>
                  <input type="text" className="form-control form-control-dark" value={concertName} onChange={e => setConcertName(e.target.value)} placeholder="e.g. Heavy Metal Fest" required />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label text-secondary small">Date & Time</label>
                <input type="datetime-local" className="form-control form-control-dark" value={date} onChange={e => setDate(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label text-secondary small">Venue / Location</label>
                <input type="text" className="form-control form-control-dark" value={venue} onChange={e => setVenue(e.target.value)} placeholder="e.g. Madison Square Garden" required />
              </div>
              <div className="row">
                <div class="col">
                  <label className="form-label text-secondary small">Ticket Price (₹)</label>
                  <input type="number" step="0.01" className="form-control form-control-dark" value={price} onChange={e => setPrice(e.target.value)} placeholder="59.99" required min="0" />
                </div>
                <div className="col">
                  <label className="form-label text-secondary small">Total Capacity</label>
                  <input type="number" className="form-control form-control-dark" value={totalTickets} onChange={e => setTotalTickets(e.target.value)} placeholder="200" required min="1" />
                </div>
              </div>
            </div>
            <div className="modal-footer border-0">
              <button type="button" className="btn btn-premium-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-premium-primary">{concert ? 'Save Changes' : 'Create Event'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/**
 * BookingModal: Handles reserving seats
 */
export function BookingModal({ show, concert, onClose, onConfirm }) {
  const [quantity, setQuantity] = useState(1);

  if (!show || !concert) return null;

  const totalAmount = (quantity * concert.price).toFixed(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(concert.ConcertId, quantity);
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content modal-content-glass text-white">
          <div className="modal-header border-0">
            <h5 className="modal-title">Book Concert Ticket</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body px-4">
              <div className="mb-4">
                <h4 className="brand-font text-white mb-2">{concert.ConcertName}</h4>
                <p className="text-secondary small">Single Ticket Price: ₹{concert.price.toFixed(2)}</p>
              </div>
              
              <div className="mb-4">
                <label className="form-label text-secondary small">Select Tickets Quantity</label>
                <select className="form-select form-select-dark" value={quantity} onChange={e => setQuantity(parseInt(e.target.value))} required>
                  <option value={1}>1 Ticket</option>
                  <option value={2}>2 Tickets</option>
                  <option value={3}>3 Tickets</option>
                </select>
                <div className="form-text text-secondary mt-2 small">Note: Users are limited to a maximum of 3 tickets per concert event.</div>
              </div>
              
              <div className="d-flex justify-content-between align-items-center p-3 rounded-3 bg-dark bg-opacity-50">
                <span className="text-secondary font-weight-500">Total Purchase Cost:</span>
                <span className="fs-4 font-weight-700 text-white">₹{totalAmount}</span>
              </div>
            </div>
            <div className="modal-footer border-0">
              <button type="button" className="btn btn-premium-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-premium-primary">Confirm & Purchase</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
