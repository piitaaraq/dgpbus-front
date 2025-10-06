// src/api.js
import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  // Prod:  '/api/'  or 'https://bus.patienthjem.dk/api/'
  // Dev:   'http://127.0.0.1:8000/api/'  (or use a dev proxy)
  baseURL: process.env.VUE_APP_BACKEND_URL || '/api/',
  withCredentials: false,
  headers: { Accept: 'application/json' },
});

// ---- token helpers ----
const ACCESS_KEYS = ['access', 'access_token'];
const REFRESH_KEYS = ['refresh', 'refresh_token'];
const COOKIE_NAME = 'auth_token';

function getAccessToken() {
  const cookie = Cookies.get(COOKIE_NAME);
  if (cookie) return cookie;
  for (const k of ACCESS_KEYS) {
    const v = localStorage.getItem(k);
    if (v) return v;
  }
  return null;
}

function setAccessToken(token) {
  try { localStorage.setItem('access', token); } catch (err) { void err; }
  Cookies.set(COOKIE_NAME, token, { secure: true, sameSite: 'Lax' });
}

function clearAccessToken() {
  try {
    localStorage.removeItem('access');
    localStorage.removeItem('access_token');
  } catch (err) { void err; }
  Cookies.remove(COOKIE_NAME);
}

function getRefreshToken() {
  for (const k of REFRESH_KEYS) {
    const v = localStorage.getItem(k);
    if (v) return v;
  }
  return null;
}

// ---- request: normalize URL + attach Authorization ----
api.interceptors.request.use(function (config) {
  const origUrl = config.url || '';

  // Only normalize *relative* URLs. Absolute URLs override baseURL by design.
  if (!/^https?:\/\//i.test(origUrl)) {
    let url = origUrl;

    // 1) Strip leading "/" so we don't drop the "/api/" path in baseURL
    if (url.startsWith('/')) url = url.slice(1);

    // 2) If baseURL already ends with "/api/", strip accidental "api/" prefix
    const base = (config.baseURL || api.defaults.baseURL || '');
    if (base.endsWith('/api/') && url.startsWith('api/')) url = url.slice(4);

    config.url = url;
  }

  // Attach Authorization header if we have a token
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

// ---- response: refresh once on 401 (queues concurrent requests) ----
let isRefreshing = false;
let queue = []; // { resolve, reject, cb }

function enqueue(cb) {
  return new Promise((resolve, reject) => queue.push({ resolve, reject, cb }));
}
function flush(err, newToken) {
  queue.forEach(({ resolve, reject, cb }) => (err ? reject(err) : resolve(cb(newToken))));
  queue = [];
}

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const { response, config = {} } = error;
    if (!response) return Promise.reject(error);           // network/timeout
    if (response.status !== 401 || config.__retried) {     // not refreshable
      return Promise.reject(error);
    }

    const refresh = getRefreshToken();
    if (!refresh) {
      clearAccessToken();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Wait for the in-flight refresh; retry when it completes
      return enqueue((newToken) => {
        config.headers.Authorization = `Bearer ${newToken}`;
        config.__retried = true;
        return api.request(config);
      });
    }

    try {
      isRefreshing = true;

      // DRF SimpleJWT default refresh endpoint
      const { data } = await api.post('token/refresh/', { refresh });
      const newAccess = data && data.access;
      if (!newAccess) throw new Error('No access token in refresh response');

      setAccessToken(newAccess);
      flush(null, newAccess);

      config.headers.Authorization = `Bearer ${newAccess}`;
      config.__retried = true;
      return api.request(config);
    } catch (err) {
      flush(err);
      clearAccessToken();
      try {
        localStorage.removeItem('refresh');
        localStorage.removeItem('refresh_token');
      } catch (e2) { void e2; }
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;