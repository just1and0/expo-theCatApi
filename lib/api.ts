import axios from 'axios';

const API_KEY = `${process.env.EXPO_PUBLIC_CAT_API_KEY}`;
const BASE_URL = 'https://api.thecatapi.com/v1/';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
  },
});

export async function fetchUploadedCats(page: number): Promise<any> {
  const response = await apiClient.get('images/', {
    params: { limit: 10, page, order: 'DESC' },
  });
  return response.data;
}

export async function fetchFavoriteCats(): Promise<any> {
  const response = await apiClient.get('favourites');
  return response.data;
}

export async function favouriteCat(image_id: string): Promise<any> {
  const response = await apiClient.post('favourites', { image_id });
  return response.data;
}

export async function deleteFavouriteCat(favouriteId: number): Promise<any> {
  const response = await apiClient.delete(`favourites/${favouriteId}`);
  return response.data;
}

export async function fetchCatVotes(): Promise<any> {
  const response = await apiClient.get('votes');
  return response.data;
}

export async function updateCatVote(image_id: string, value: 1 | 0): Promise<any> {
  const response = await apiClient.post('votes', { image_id, value });
  return response.data;
}
