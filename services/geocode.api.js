import { http } from './httpClient';

// Proxy through backend to avoid CORS and add UA per Nominatim policy
export async function reverseGeocode(lat, lon) {
  const res = await http.get(`/api/geocode/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`);
  const data = res.data;
  const display = data?.display_name || '';
  return { address: display, raw: data };
}

export async function searchAddress(query) {
  const res = await http.get(`/api/geocode/search?q=${encodeURIComponent(query)}`);
  return Array.isArray(res.data) ? res.data : [];
}
