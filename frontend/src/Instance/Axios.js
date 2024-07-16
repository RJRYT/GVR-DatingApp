import axios from "axios";

const apiInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL + "/api", // Your API base URL
  withCredentials: true,
});

apiInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await apiInstance.post("/users/token");
        if (response.status === 200) {
          return apiInstance(originalRequest);
        }
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default apiInstance;
