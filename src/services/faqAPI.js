import { FAQ_INSTANCE } from "./axiosInstance";

export const fetchFAQs = async () => {
  try {
    const response = await FAQ_INSTANCE.get("/");
    return response.data;
    } catch (error) {
    console.error("Error fetching FAQs:", error);
    throw error;
  }
};

export const updateFAQs = async (data) => {
  try {
    const response = await FAQ_INSTANCE.put("/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
    } catch (error) {   
    console.error("Error updating FAQs:", error);
    throw error;
  }
};

export const createFAQ = async (data) => {
  try {
    const response = await FAQ_INSTANCE.post("/", data);
    return response.data;
    } catch (error) {
    console.error("Error creating FAQ:", error);
    throw error;
  }
};