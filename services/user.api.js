import { http } from './httpClient';

export async function getMe(options = {}) {
  const response = await http.get('/api/me', options);
  return response.data?.data ?? response.data;
}
