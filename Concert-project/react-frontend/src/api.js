const API_BASE = 'http://localhost:3000';

/**
 * Helper to construct headers with optional token
 */
function getHeaders(token = null) {
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Sign In User
 */
export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE}/login_user_api`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password })
  });
  return { ok: response.ok, status: response.status, data: await response.json() };
}

/**
 * Sign Up User
 */
export async function createUser(userData) {
  const response = await fetch(`${API_BASE}/create_user_api`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(userData)
  });
  return { ok: response.ok, status: response.status, data: await response.json() };
}

/**
 * Get Concerts List (Requires authentication)
 */
export async function fetchConcerts(token) {
  const response = await fetch(`${API_BASE}/veiw_concert_api`, {
    method: 'GET',
    headers: getHeaders(token)
  });
  return { ok: response.ok, status: response.status, data: await response.json() };
}

/**
 * Add Concert (Admins only)
 */
export async function addConcert(concertData, token) {
  const response = await fetch(`${API_BASE}/concert_add_api`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(concertData)
  });
  return { ok: response.ok, status: response.status, data: await response.json() };
}

/**
 * Edit Concert (Admins only)
 */
export async function editConcert(concertId, concertData, token) {
  const response = await fetch(`${API_BASE}/edit_concert_api/${concertId}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(concertData)
  });
  return { ok: response.ok, status: response.status, data: await response.json() };
}

/**
 * Delete Concert (Admins only)
 */
export async function deleteConcert(concertId, token) {
  const response = await fetch(`${API_BASE}/delete_concert_api/${concertId}`, {
    method: 'DELETE',
    headers: getHeaders(token)
  });
  return { ok: response.ok, status: response.status, data: await response.json() };
}

/**
 * Book Ticket (Users only)
 */
export async function bookTicket(concertId, nooftickets, token) {
  const response = await fetch(`${API_BASE}/Ticket_booking_api`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ ConcertId: concertId, nooftickets })
  });
  return { ok: response.ok, status: response.status, data: await response.json() };
}
