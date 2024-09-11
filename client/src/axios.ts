import axios from 'axios';

const token = JSON.parse(localStorage.getItem('token') || '');

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'http://192.168.89.28:8080/api',
  headers: { 'login-token': token, 'Content-Type': 'application/json' },
  responseType: 'json',
});

export default instance;
