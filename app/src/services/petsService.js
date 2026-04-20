import api from './api.js';

export async function getPets(filters = {}) {
    const params = {};
    if (filters.species)  params.species  = filters.species;
    if (filters.breed)    params.breed    = filters.breed;
    if (filters.age)      params.age      = filters.age;
    if (filters.location) params.location = filters.location;

    const response = await api.get('/pets', { params });
    return response.data.pets;
}

export async function getPetById(id) {
  const response = await api.get(`/pets/${id}`);
  return response.data.pet;
}

export async function getAdoptedPets() {
  const response = await api.get('/pets/adopted');
  return response.data.pets;
}