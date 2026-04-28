import api from './api.js';

// i-submit ang bagong adoption application.
export async function submitAdoptionApplication(data) {
  const response = await api.post('/adoptions', data);
  return response.data;
}

// kunin lahat ng adoptions ng kasalukuyang user.
export async function getMyAdoptions() {
  const response = await api.get('/adoptions/me');
  return response.data.applications;
}

// admin only — kunin lahat ng applications.
export async function getAllAdoptions() {
  const response = await api.get('/adoptions');
  return response.data.applications;
}

// admin only — i-update ang status ng adoption.
// usage:
//   updateAdoptionStatus(5, 'approved', { decision_note: 'Approved!' })
//   updateAdoptionStatus(5, 'rejected', { decision_note: 'Sorry...' })
//   updateAdoptionStatus(5, 'appointment_scheduled', { appointment_date: '2026-04-01 14:00:00' })
//   updateAdoptionStatus(5, 'completed')
export async function updateAdoptionStatus(adoptionId, status, extras = {}) {
  const response = await api.put(`/adoptions/${adoptionId}/status`, {
    status,
    ...extras,
  });
  return response.data;
}