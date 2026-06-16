// Front-end State Management
const state = {
  token: localStorage.getItem('token') || null,
  user: null, // Holds decoded token properties: { userId, Admin }
  concerts: []
};

// API Endpoints
const API_BASE = window.location.origin;

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
    console.error("Error decoding JWT token:", e);
    return null;
  }
}

// Initialize User from Token
if (state.token) {
  state.user = decodeToken(state.token);
}

// DOM Elements
const authBtnContainer = document.getElementById('auth-btn-container');
const userMenuContainer = document.getElementById('user-menu-container');
const userRoleBadge = document.getElementById('user-role-badge');
const userIdDisplay = document.getElementById('user-id-display');
const mainContent = document.getElementById('main-content');
const concertListContainer = document.getElementById('concert-list');
const adminActionsContainer = document.getElementById('admin-actions');
const welcomeSection = document.getElementById('welcome-section');

// Toast Notification
function showToast(message, isSuccess = true) {
  const container = document.getElementById('toast-container');
  
  // Clear any existing toasts
  container.innerHTML = '';
  
  const toast = document.createElement('div');
  toast.className = 'custom-toast';
  
  const iconClass = isSuccess ? 'success' : 'error';
  const iconSvg = isSuccess 
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16"><path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/></svg>`;

  toast.innerHTML = `
    <div class="toast-icon ${iconClass}">
      ${iconSvg}
    </div>
    <div class="toast-message" style="font-size: 0.9rem; font-weight: 500;">${message}</div>
  `;
  
  container.appendChild(toast);
  
  // Trigger transition
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Hide and remove after 4 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Update UI view based on authentication state
function updateAuthUI() {
  if (state.token && state.user) {
    // Logged In
    authBtnContainer.classList.add('d-none');
    userMenuContainer.classList.remove('d-none');
    
    // Set badge text & user ID display
    if (state.user.Admin) {
      userRoleBadge.textContent = 'Admin';
      userRoleBadge.className = 'badge bg-danger rounded-pill px-3 py-2';
      adminActionsContainer.classList.remove('d-none');
    } else {
      userRoleBadge.textContent = 'User';
      userRoleBadge.className = 'badge bg-primary rounded-pill px-3 py-2';
      adminActionsContainer.classList.add('d-none');
    }
    userIdDisplay.textContent = `ID: ${state.user.userId.substring(0, 8)}...`;
    
    welcomeSection.classList.add('d-none');
    mainContent.classList.remove('d-none');
    
    // Load data
    fetchConcerts();
  } else {
    // Logged Out
    authBtnContainer.classList.remove('d-none');
    userMenuContainer.classList.add('d-none');
    adminActionsContainer.classList.add('d-none');
    welcomeSection.classList.remove('d-none');
    mainContent.classList.add('d-none');
    concertListContainer.innerHTML = '';
  }
}

// API Call: Fetch Concerts
async function fetchConcerts() {
  if (!state.token) return;
  
  try {
    concertListContainer.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-secondary mt-3">Fetching concerts details...</p>
      </div>
    `;

    const response = await fetch(`${API_BASE}/veiw_concert_api`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${state.token}`
      }
    });
    
    const result = await response.json();
    
    if (response.ok) {
      state.concerts = result.data || [];
      renderConcerts(state.concerts);
    } else {
      // Handle expired or invalid token
      if (response.status === 401) {
        showToast(result.message || "Session expired. Please log in again.", false);
        logout();
      } else {
        showToast(result.message || "Failed to load concerts.", false);
      }
    }
  } catch (error) {
    console.error("Fetch concerts error:", error);
    showToast("Network error. Could not connect to API.", false);
  }
}

// Render Concert Cards
function renderConcerts(concerts) {
  if (!concerts || concerts.length === 0) {
    concertListContainer.innerHTML = `
      <div class="col-12">
        <div class="empty-state-card">
          <div class="empty-state-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-calendar-event" viewBox="0 0 16 16">
              <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/>
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/>
            </svg>
          </div>
          <h3>No Concerts Available</h3>
          <p class="text-secondary max-width-600 mx-auto">There are no upcoming concerts scheduled. Check back later or add a new concert if you're an Admin!</p>
        </div>
      </div>
    `;
    return;
  }
  
  concertListContainer.innerHTML = '';
  
  concerts.forEach(concert => {
    // Format date beautifully
    const eventDate = new Date(concert.date);
    const dateFormatted = eventDate.toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });
    const timeFormatted = eventDate.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit'
    });
    
    // Status text & colors for remaining tickets
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
    
    // Create card element
    const col = document.createElement('div');
    col.className = 'col-lg-4 col-md-6';
    
    let actionButtons = '';
    if (state.user && state.user.Admin) {
      actionButtons = `
        <div class="d-flex gap-2 mt-auto pt-3">
          <button class="btn btn-premium-secondary flex-grow-1" onclick="openEditModal('${concert.ConcertId}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-pencil-square me-1" viewBox="0 0 16 16"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="even-rule" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/></svg> Edit
          </button>
          <button class="btn btn-premium-danger" onclick="deleteConcert('${concert.ConcertId}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16"><path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/></svg>
          </button>
        </div>
      `;
    } else {
      actionButtons = `
        <div class="mt-auto pt-3">
          <button class="btn btn-premium-primary w-100" ${isSoldOut ? 'disabled' : ''} onclick="openBookingModal('${concert.ConcertId}', '${escapeHtml(concert.ConcertName)}', ${concert.price})">
            ${isSoldOut ? 'Sold Out' : 'Book Tickets'}
          </button>
        </div>
      `;
    }
    
    col.innerHTML = `
      <div class="concert-card d-flex flex-column h-100">
        <div class="concert-card-body">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <div class="concert-badge-date">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-calendar" viewBox="0 0 16 16"><path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z"/></svg>
              <span>${dateFormatted}</span>
            </div>
            <span class="badge ${seatsBadgeClass} px-2 py-1.5 concert-seats">${seatsText}</span>
          </div>
          
          <h3 class="concert-title">${escapeHtml(concert.ConcertName)}</h3>
          
          <div class="concert-info-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16"><path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/></svg>
            <span>${timeFormatted}</span>
          </div>
          
          <div class="concert-info-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-geo-alt-fill text-danger" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/></svg>
            <span>${escapeHtml(concert.venue)}</span>
          </div>
          
          <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-secondary border-opacity-10">
            <span class="text-secondary" style="font-size: 0.85rem;">Ticket Price</span>
            <div class="concert-price">₹${concert.price.toFixed(2)}</div>
          </div>
          
          ${actionButtons}
        </div>
      </div>
    `;
    
    concertListContainer.appendChild(col);
  });
}

// Helper: Escape HTML to prevent XSS
function escapeHtml(string) {
  return String(string).replace(/[&<>"']/g, function (s) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[s];
  });
}

// User Action: Logout
function logout() {
  localStorage.removeItem('token');
  state.token = null;
  state.user = null;
  state.concerts = [];
  updateAuthUI();
  showToast("Logged out successfully.");
}

// Open booking modal
let bookingConcertId = '';
function openBookingModal(concertId, concertName, price) {
  bookingConcertId = concertId;
  document.getElementById('bookingConcertName').textContent = concertName;
  document.getElementById('bookingConcertPrice').textContent = price.toFixed(2);
  document.getElementById('bookingQuantity').value = 1;
  document.getElementById('bookingTotalAmount').textContent = price.toFixed(2);
  
  const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
  modal.show();
}

// Update booking total amount dynamically
document.getElementById('bookingQuantity').addEventListener('input', function(e) {
  const quantity = parseInt(e.target.value) || 0;
  const price = parseFloat(document.getElementById('bookingConcertPrice').textContent) || 0;
  document.getElementById('bookingTotalAmount').textContent = (quantity * price).toFixed(2);
});

// Book tickets Form submit handler
document.getElementById('bookingForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const nooftickets = parseInt(document.getElementById('bookingQuantity').value);
  
  if (!bookingConcertId) return;
  
  try {
    const response = await fetch(`${API_BASE}/Ticket_booking_api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.token}`
      },
      body: JSON.stringify({
        ConcertId: bookingConcertId,
        nooftickets: nooftickets
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      showToast(result.message || "Ticket booking confirmed!");
      // Hide modal
      const modalEl = document.getElementById('bookingModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();
      // Reload concerts
      fetchConcerts();
    } else {
      showToast(result.message || "Failed to book tickets.", false);
    }
  } catch (error) {
    console.error("Booking error:", error);
    showToast("Network error. Could not complete booking.", false);
  }
});

// Auth Modal switching
function switchAuthTab(tab) {
  const loginForm = document.getElementById('login-form-content');
  const signupForm = document.getElementById('signup-form-content');
  const loginTabBtn = document.getElementById('auth-tab-login');
  const signupTabBtn = document.getElementById('auth-tab-signup');
  
  if (tab === 'login') {
    loginForm.classList.remove('d-none');
    signupForm.classList.add('d-none');
    loginTabBtn.classList.add('active');
    signupTabBtn.classList.remove('active');
  } else {
    loginForm.classList.add('d-none');
    signupForm.classList.remove('d-none');
    loginTabBtn.classList.remove('active');
    signupTabBtn.classList.add('active');
  }
}

// Login Form Submit
document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  try {
    const response = await fetch(`${API_BASE}/login_user_api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', result.token);
      state.token = result.token;
      state.user = decodeToken(result.token);
      
      // Hide modal
      const modalEl = document.getElementById('authModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();
      
      updateAuthUI();
      showToast(result.message || "Successfully logged in!");
      
      // Reset forms
      document.getElementById('loginForm').reset();
    } else {
      showToast(result.message || "Invalid credentials.", false);
    }
  } catch (error) {
    console.error("Login error:", error);
    showToast("Network error. Could not connect.", false);
  }
});

// Signup Form Submit
document.getElementById('signupForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const age = parseInt(document.getElementById('signupAge').value);
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;
  const Admin = document.getElementById('signupAdmin').checked;
  
  if (password !== confirmPassword) {
    showToast("Passwords do not match.", false);
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE}/create_user_api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name, email, age, password, confirmPassword, Admin
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      showToast(result.message || "Sign up successful! Please log in.");
      switchAuthTab('login');
      document.getElementById('signupForm').reset();
    } else {
      // Backend validates schema and returns nested errors object: {errors: {name, age, password, email}}
      if (result.errors) {
        let errorMsg = "Validation failed: ";
        const errorKeys = Object.keys(result.errors);
        const activeErrors = errorKeys.filter(k => result.errors[k] !== undefined);
        if (activeErrors.length > 0) {
          errorMsg += activeErrors.map(k => result.errors[k]).join(', ');
        }
        showToast(errorMsg, false);
      } else {
        showToast(result.message || "Sign up failed.", false);
      }
    }
  } catch (error) {
    console.error("Signup error:", error);
    showToast("Network error. Could not register.", false);
  }
});

// Admin Add Concert Form Submit
document.getElementById('addConcertForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const ConcertId = document.getElementById('addConcertId').value;
  const ConcertName = document.getElementById('addConcertName').value;
  const date = document.getElementById('addConcertDate').value;
  const venue = document.getElementById('addConcertVenue').value;
  const price = parseFloat(document.getElementById('addConcertPrice').value);
  const TotalTickets = parseInt(document.getElementById('addConcertTotalTickets').value);
  
  try {
    const response = await fetch(`${API_BASE}/concert_add_api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.token}`
      },
      body: JSON.stringify({
        ConcertId, ConcertName, date, venue, price, TotalTickets
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      showToast(result.message || "Concert added successfully!");
      
      // Hide modal
      const modalEl = document.getElementById('addConcertModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();
      
      // Reset form & Reload list
      document.getElementById('addConcertForm').reset();
      fetchConcerts();
    } else {
      if (result.errors) {
        let errorMsg = "Validation failed: ";
        const errorKeys = Object.keys(result.errors);
        const activeErrors = errorKeys.filter(k => result.errors[k] !== undefined);
        if (activeErrors.length > 0) {
          errorMsg += activeErrors.map(k => result.errors[k]).join(', ');
        }
        showToast(errorMsg, false);
      } else {
        showToast(result.message || "Failed to add concert.", false);
      }
    }
  } catch (error) {
    console.error("Add concert error:", error);
    showToast("Network error. Failed to add concert.", false);
  }
});

// Admin Edit Concert Modal Handling
let editConcertId = '';
function openEditModal(concertId) {
  const concert = state.concerts.find(c => c.ConcertId === concertId);
  if (!concert) return;
  
  editConcertId = concertId;
  document.getElementById('editConcertName').value = concert.ConcertName;
  
  // Format Date to ISO string compatible with datetime-local input (YYYY-MM-DDThh:mm)
  const dateObj = new Date(concert.date);
  const tzOffset = dateObj.getTimezoneOffset() * 60000; // offset in milliseconds
  const localISODate = (new Date(dateObj - tzOffset)).toISOString().slice(0, 16);
  
  document.getElementById('editConcertDate').value = localISODate;
  document.getElementById('editConcertVenue').value = concert.venue;
  document.getElementById('editConcertPrice').value = concert.price;
  document.getElementById('editConcertTotalTickets').value = concert.TotalTickets;
  
  const modal = new bootstrap.Modal(document.getElementById('editConcertModal'));
  modal.show();
}

// Admin Edit Concert Form Submit
document.getElementById('editConcertForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  if (!editConcertId) return;
  
  const ConcertName = document.getElementById('editConcertName').value;
  const date = document.getElementById('editConcertDate').value;
  const venue = document.getElementById('editConcertVenue').value;
  const price = parseFloat(document.getElementById('editConcertPrice').value);
  const TotalTickets = parseInt(document.getElementById('editConcertTotalTickets').value);
  
  try {
    const response = await fetch(`${API_BASE}/edit_concert_api/${editConcertId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.token}`
      },
      body: JSON.stringify({
        ConcertName, date, venue, price, TotalTickets
      })
    });
    
    const result = await response.json();
    
    if (response.ok) {
      showToast(result.message || "Concert updated successfully!");
      
      // Hide modal
      const modalEl = document.getElementById('editConcertModal');
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();
      
      // Reload list
      fetchConcerts();
    } else {
      if (result.errors) {
        let errorMsg = "Validation failed: ";
        const errorKeys = Object.keys(result.errors);
        const activeErrors = errorKeys.filter(k => result.errors[k] !== undefined);
        if (activeErrors.length > 0) {
          errorMsg += activeErrors.map(k => result.errors[k]).join(', ');
        }
        showToast(errorMsg, false);
      } else {
        showToast(result.message || "Failed to update concert.", false);
      }
    }
  } catch (error) {
    console.error("Edit concert error:", error);
    showToast("Network error. Failed to edit concert.", false);
  }
});

// Admin Delete Concert
async function deleteConcert(concertId) {
  if (!confirm("Are you sure you want to delete this concert? This action cannot be undone.")) return;
  
  try {
    const response = await fetch(`${API_BASE}/delete_concert_api/${concertId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${state.token}`
      }
    });
    
    const result = await response.json();
    
    if (response.ok) {
      showToast(result.message || "Concert deleted successfully.");
      fetchConcerts();
    } else {
      showToast(result.message || "Failed to delete concert.", false);
    }
  } catch (error) {
    console.error("Delete concert error:", error);
    showToast("Network error. Failed to delete concert.", false);
  }
}

// Initial Boot
document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
});
