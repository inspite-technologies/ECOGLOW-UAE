import { ABOUT_INSTANCE } from "./axiosInstance";

export const fetchAboutUs = async () => {
  try {    
    const response = await ABOUT_INSTANCE.get("/");
    console.log("response from ",response.data);
    
    return response.data;
  } catch (error) {
    console.error("Error fetching About Us data:", error);
    throw error;
  } 
};

export const updateAboutUs = async (data) => {
  try {
    // data is the FormData object
    const response = await ABOUT_INSTANCE.put("/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating About Us data:", error);
    throw error;
  }
};

export const createAboutUs = async (data) => {
  try {
    const response = await ABOUT_INSTANCE.post("/", data);
    return response.data;
  } catch (error) {
    console.error("Error creating About Us data:", error);
    throw error;
  }
};  