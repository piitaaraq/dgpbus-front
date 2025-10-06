// src/api.js
import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.VUE_APP_BACKEND_URL,
  // keep false unless you're using Django **session** cookies
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token'); // your JWT
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
