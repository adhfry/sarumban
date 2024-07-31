import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.2.3:8000/',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

export default axiosInstance;