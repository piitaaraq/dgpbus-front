// src/stores/auth.js (or wherever your store lives)
import { defineStore } from 'pinia';
import api from '@/api';                 // <-- use the shared client (has baseURL + auth)
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: Cookies.get('auth_token') || localStorage.getItem('access') || null,
    isAuthenticated: !!(Cookies.get('auth_token') || localStorage.getItem('access')),
  }),

  actions: {
    async login(email, password) {
      // DRF SimpleJWT default obtain endpoint
      const { data } = await api.post('token/', { email, password }); // if your backend expects "username", change the key
      const access = data?.access;
      const refresh = data?.refresh;
      if (!access) throw new Error('Login failed: no access token returned');

      // Persist for the api.js interceptor
      this.token = access;
      this.isAuthenticated = true;

      try {
        localStorage.setItem('access', access);
        if (refresh) localStorage.setItem('refresh', refresh);
      } catch (err) { /* ignore storage errors */ }

      Cookies.set('auth_token', access, { expires: 7, secure: true, sameSite: 'Lax' });
      return true;
    },

    logout() {
      this.token = null;
      this.isAuthenticated = false;
      try {
        localStorage.removeItem('access');
        localStorage.removeItem('access_token'); // in case older builds used this key
        localStorage.removeItem('refresh');
        localStorage.removeItem('refresh_token');
      } catch (err) { /* ignore */ }
      Cookies.remove('auth_token');
    },

    restoreToken() {
      const token = Cookies.get('auth_token') || localStorage.getItem('access');
      if (token && !this.isTokenExpired(token)) {
        this.token = token;
        this.isAuthenticated = true;
      } else {
        this.logout();
      }
    },

    isTokenExpired(token) {
      try {
        const { exp } = jwtDecode(token);
        const now = Math.floor(Date.now() / 1000);
        return !exp || exp < now;
      } catch {
        return true; // treat undecodable tokens as expired
      }
    },

    async validateTokenWithBackend() {
      try {
        const token = Cookies.get('auth_token') || localStorage.getItem('access');
        await api.post('token/verify/', { token }); // SimpleJWT verify endpoint
        return true;
      } catch {
        this.logout();
        return false;
      }
    },
  },
});
