import axios from "axios";

const ecommerceApi = axios.create({
  baseURL: "http://localhost:3000/api/v1"
});

ecommerceApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default ecommerceApi;