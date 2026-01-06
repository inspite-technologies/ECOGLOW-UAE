import { BANNER_INSTANCE } from "./axiosInstance";

export const fetchBanner = async () => {
  try {
    const response = await BANNER_INSTANCE.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching banner data:", error);
    throw error;
  }
};

export const updateBanner = async (formData) => {
  try {
    console.log("Updating banner with:", formData);

    const response = await BANNER_INSTANCE.put("/", formData, {
      headers: {
        "Content-Type": "multipart/form-data" // Important for file upload
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error updating banner:", error);
    throw error;
  }
};


export const createBanner = async (data) => {
    try {      
        const response = await BANNER_INSTANCE.post(`/`, data);
        return response.data;
    } catch (error) {
        console.error("Error creating banner data:", error);
        throw error;
    }
};