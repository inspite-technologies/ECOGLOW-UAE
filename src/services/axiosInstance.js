// axiosInstance.js (No change needed in the setupInterceptors function)

import axios from "axios";

export const baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:5000"


const createAxiosInstance = (baseURL, defaultHeaders = {}) => {
  return axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      ...defaultHeaders,
    },
    withCredentials: true,
  });
};

// Function to setup interceptors
const setupInterceptors = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.token = `${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        window.location.href = "/admin/login";
        // redirect to login page
      }
      return Promise.reject(error);
    }
  );
};

export const ADMIN_INSTANCE = createAxiosInstance(`${baseURL}/admin/`);
setupInterceptors(ADMIN_INSTANCE);

export const ABOUT_INSTANCE = createAxiosInstance(`${baseURL}/about-us/`);
setupInterceptors(ABOUT_INSTANCE);

export const SERVICES_INSTANCE = createAxiosInstance(`${baseURL}/services/`);
setupInterceptors(SERVICES_INSTANCE);

export const PACKAGES_INSTANCE = createAxiosInstance(`${baseURL}/packages/`);
setupInterceptors(PACKAGES_INSTANCE);

export const FAQ_INSTANCE = createAxiosInstance(`${baseURL}/faq/`);
setupInterceptors(FAQ_INSTANCE);

export const HERO_INSTANCE = createAxiosInstance(`${baseURL}/hero/`);
setupInterceptors(HERO_INSTANCE);

export const HOME_ABOUT_INSTANCE = createAxiosInstance(`${baseURL}/home-about/`);
setupInterceptors(HOME_ABOUT_INSTANCE);

export const HOME_SERVICES_INSTANCE = createAxiosInstance(`${baseURL}/home-services/`);
setupInterceptors(HOME_SERVICES_INSTANCE);

export const BANNER_INSTANCE = createAxiosInstance(`${baseURL}/banner/`);
setupInterceptors(BANNER_INSTANCE);

export const ADVANTAGES_INSTANCE = createAxiosInstance(`${baseURL}/advantages/`);
setupInterceptors(ADVANTAGES_INSTANCE);

export const MESSAGE_INSTANCE = createAxiosInstance(`${baseURL}/message/`);
setupInterceptors(MESSAGE_INSTANCE);

export const CONTACT_INSTANCE = createAxiosInstance(`${baseURL}/contact/`);
setupInterceptors(CONTACT_INSTANCE);

export const BOOKING_INSTANCE = createAxiosInstance(`${baseURL}/bookings`)
setupInterceptors(BOOKING_INSTANCE)

export const FOOTER_INSTANCE = createAxiosInstance(`${baseURL}/footer`)
setupInterceptors(FOOTER_INSTANCE)

export const HEADER_INSTANCE = createAxiosInstance(`${baseURL}/header`)
setupInterceptors(HEADER_INSTANCE)
