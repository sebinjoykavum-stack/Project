import React from 'react';

export default function ConcertCard({ concert, isAdmin, onEdit, onDelete, onBook }) {
  // Format date and time
  const eventDate = new Date(concert.date);
  const dateFormatted = eventDate.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  });
  const timeFormatted = eventDate.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit'
  });

  // Calculate ticket remaining badges
  let seatsBadgeClass = 'bg-success';
  let seatsText = `${concert.RemainingTickets} left / ${concert.TotalTickets} total`;
  if (concert.RemainingTickets <= 0) {
    seatsBadgeClass = 'bg-danger';
    seatsText = 'Sold Out';
  } else if (concert.RemainingTickets <= 10) {
    seatsBadgeClass = 'bg-warning text-dark';
    seatsText = `Hurry! Only ${concert.RemainingTickets} left`;
  }

  const isSoldOut = concert.RemainingTickets <= 0;

  return (
    <div className="col-lg-4 col-md-6">
      <div className="concert-card d-flex flex-column h-100">
        <div className="concert-card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div className="concert-badge-date">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-calendar" viewBox="0 0 16 16">
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
              </svg>
              <span>{dateFormatted}</span>
            </div>
            <span className={`badge ${seatsBadgeClass} px-2 py-1.5 concert-seats`}>{seatsText}</span>
          </div>

          <h3 className="concert-title">{concert.ConcertName}</h3>

          <div className="concert-info-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16">
              <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
            </svg>
            <span>{timeFormatted}</span>
          </div>

          <div className="concert-info-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-geo-alt-fill text-danger" viewBox="0 0 16 16">
              <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
            </svg>
            <span>{concert.venue}</span>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-secondary border-opacity-10">
            <span className="text-secondary" style={{ fontSize: '0.85rem' }}>Ticket Price</span>
            <div className="concert-price">₹{concert.price.toFixed(2)}</div>
          </div>

          {isAdmin ? (
            <div className="d-flex gap-2 mt-auto pt-3">
              <button className="btn btn-premium-secondary flex-grow-1" onClick={() => onEdit(concert)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-pencil-square me-1" viewBox="0 0 16 16">
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                  <path fillRule="even-rule" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                </svg> Edit
              </button>
              <button className="btn btn-premium-danger" onClick={() => onDelete(concert.ConcertId)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="mt-auto pt-3">
              <button 
                className="btn btn-premium-primary w-100" 
                disabled={isSoldOut} 
                onClick={() => onBook(concert)}
              >
                {isSoldOut ? 'Sold Out' : 'Book Tickets'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
