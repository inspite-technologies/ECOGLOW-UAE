import { HOME_SERVICES_INSTANCE } from "./axiosInstance";

export const fetchHomeServices = async () => {
  try {
    const response = await HOME_SERVICES_INSTANCE.get("/");
    
    return response.data;
  } catch (error) {
    console.error("Error fetching Home Services data:", error);
    throw error;
  }
};

export const updateAndCreateHomeServices = async (data) => {
  try {
    const response = await HOME_SERVICES_INSTANCE.post("/", data,{
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating/creating Home Services data:", error);
    throw error;
  }
};