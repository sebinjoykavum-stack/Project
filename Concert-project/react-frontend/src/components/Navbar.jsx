import React from 'react';

export default function Navbar({ user, onLogout, onOpenAuth }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-glass sticky-top py-3">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center gap-2" href="#/">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-music-note-beamed" viewBox="0 0 16 16" style={{ color: '#8b5cf6' }}>
            <path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13s1.12-2 2.5-2 2.5.896 2.5 2m9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2" />
            <path fillRule="even-rule" d="M14 11V2h1v9zM6 3v10H5V3z" />
            <path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4z" />
          </svg>
          <span className="brand-font fs-4">SoundWave</span>
        </a>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          {!user ? (
            <div className="d-flex align-items-center gap-2">
              <button className="btn btn-premium-primary" onClick={() => onOpenAuth('login')}>
                Sign In / Sign Up
              </button>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center gap-2">
                <span className={`badge rounded-pill px-3 py-2 ${user.Admin ? 'bg-danger' : 'bg-primary'}`}>
                  {user.Admin ? 'Admin' : 'User'}
                </span>
                <span className="text-secondary small font-monospace">
                  ID: {user.userId ? `${user.userId.substring(0, 8)}...` : ''}
                </span>
              </div>
              <button className="btn btn-premium-secondary px-3 py-2" onClick={onLogout}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right me-1" viewBox="0 0 16 16">
                  <path fillRule="even-rule" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
                  <path fill-rule="even-rule" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
