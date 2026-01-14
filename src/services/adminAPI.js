import { ADMIN_INSTANCE } from "./axiosInstance";


export const login = async (data) => {
  try {
    const response = await ADMIN_INSTANCE.post("/login", data);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

