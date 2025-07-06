import axios, { InternalAxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { encryptPayload } from '@/utils/encrypt';
// import https from 'https';

// const httpsAgent = new https.Agent({
//   rejectUnauthorized: false, // Disables SSL verification
// });

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
//   httpsAgent
});

axiosClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Only apply to client-side requests
    const token = "jhkgkjgjg";
    if (token) {
      // Ensure headers exist, then add Authorization if it's missing
      config.headers = {
        Accept: 'application/json', // Add default header
        'Content-Type': 'application/json',
        ...config.headers, // Keep existing headers
        Authorization: `Bearer ${token}`,
      } as AxiosRequestHeaders;
    }

    if (config.data) {
      config.data = await encryptPayload(config.data);
    }
    return config;
  },
  (error) => {
    console.error('Request setup failed:', error);
    return Promise.reject(error);
  }
);

export default axiosClient;
