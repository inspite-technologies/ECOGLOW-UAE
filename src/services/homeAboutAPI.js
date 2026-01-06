import { HOME_ABOUT_INSTANCE } from "./axiosInstance";

export const fetchHomeAbout = async () => {
  try {
    const response = await HOME_ABOUT_INSTANCE.get("/");
    return response.data;
  }
    catch (error) {
    console.error("Error fetching Home About data:", error);
    throw error;
  }
};

export const updateHomeAbout = async (data) => {
  try {
    const response = await HOME_ABOUT_INSTANCE.put("/", data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating Home About data:", error);
    throw error;
  }
};