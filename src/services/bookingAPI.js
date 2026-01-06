import { BOOKING_INSTANCE } from "./axiosInstance";

/**
 * Fetch existing booking page settings (Hero text, labels, image path)
 */
export const fetchBookingPage = async () => {
  try {
    const response = await BOOKING_INSTANCE.get("/");
    // Handle different response structures (standardizing the data)
    let data = response.data;
    if (data.data) data = data.data;
    if (Array.isArray(data)) data = data[0];
    
    return data;
  } catch (error) {
    console.error("❌ Error fetching booking settings:", error);
    throw error;
  }
};

/**
 * Update booking page settings
 * @param {FormData} formData - Must contain text fields and the image file
 */
export const updateBookingPage = async (formData) => {
  try {
    const response = await BOOKING_INSTANCE.post("/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error updating booking settings:", error);
    throw error;
  }
};