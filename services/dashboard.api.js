import { http } from './httpClient';

export async function getDashboardSummary(options = {}) {
  const res = await http.get('/api/dashboard/summary', options);
  return res.data?.data ?? res.data;
}
