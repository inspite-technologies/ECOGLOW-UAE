import { MESSAGE_INSTANCE } from "./axiosInstance";

// --- GET MESSAGE DATA ---
export const fetchMessages = async () => {
  try {
    const response = await MESSAGE_INSTANCE.get("/");
    return response.data;
  } catch (error) {   
    console.error("Error fetching messages data:", error);
    throw error;
  }
};

// --- UPDATE MESSAGE DATA ---
export const updateMessageSection = async (data) => {
  try {
    const response = await MESSAGE_INSTANCE.post("/", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {   
    console.error("Error updating message section data:", error);
    throw error;
  }
};

// --- NEW: SEND NEWSLETTER EMAIL ---
export const sendNewsletter = async (emailData) => {
  try {
    // emailData should be { userEmail: "...", adminEmail: "..." }
    const response = await MESSAGE_INSTANCE.post("/send-newsletter", emailData);
    return response.data;
  } catch (error) {
    console.error("Error sending newsletter:", error);
    throw error;
  }
};