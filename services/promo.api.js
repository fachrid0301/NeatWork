import { http } from './httpClient';

export async function listPromos(params = {}, options = {}) {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  const url = qs ? `/api/promos?${qs}` : '/api/promos';
  const response = await http.get(url, options);
  return response.data?.data ?? response.data;
}
