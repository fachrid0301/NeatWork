import { http } from './httpClient';

export async function listBookings(params = {}, options = {}) {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  const url = qs ? `/api/bookings?${qs}` : '/api/bookings';
  const response = await http.get(url, options);
  return response.data?.data ?? response.data;
}

export async function getBooking(id) {
  const response = await http.get(`/api/bookings/${id}`);
  return response.data?.data ?? response.data;
}

export async function createBooking(payload) {
  const response = await http.post('/api/bookings', payload);
  return response.data?.data ?? response.data;
}

export async function cancelBooking(id) {
  const response = await http.post(`/api/bookings/${id}/cancel`, {});
  return response.data?.data ?? response.data;
}

// Staff-related endpoints (protected)
export async function listAvailableBookings() {
  const response = await http.get('/api/petugas/available-bookings');
  return response.data?.data ?? response.data;
}

export async function acceptBooking(id) {
  const response = await http.post(`/api/petugas/bookings/${id}/accept`, {});
  return response.data?.data ?? response.data;
}

export async function rejectBooking(id) {
  const response = await http.post(`/api/petugas/bookings/${id}/reject`, {});
  return response.data?.data ?? response.data;
}

export async function startBooking(id) {
  const response = await http.post(`/api/petugas/bookings/${id}/start`, {});
  return response.data?.data ?? response.data;
}

export async function completeBooking(id) {
  const response = await http.post(`/api/petugas/bookings/${id}/complete`, {});
  return response.data?.data ?? response.data;
}

export async function listMyBookings() {
  const response = await http.get('/api/petugas/my-bookings');
  return response.data?.data ?? response.data;
}
