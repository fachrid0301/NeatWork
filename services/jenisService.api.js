import { http } from './httpClient';

export async function listJenisService(params = {}, options = {}) {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  const url = qs ? `/api/jenis-service?${qs}` : '/api/jenis-service';
  const response = await http.get(url, options);
  return response.data?.data ?? response.data;
}
