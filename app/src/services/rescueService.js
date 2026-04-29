import api from './api.js';

export async function getMyRescueReports() {
  const { data } = await api.get('/rescue/me');
  return data.reports;
}