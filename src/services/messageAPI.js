import { MESSAGE_INSTANCE } from "./axiosInstance";

export const fetchMessages = async () => {
  try {
    const response = await MESSAGE_INSTANCE.get("/");
    console.log("Fetched messages data:", response.data);
    return response.data;
    } catch (error) {   
    console.error("Error fetching messages data:", error);
    throw error;
  }
};

export const updateMessageSection = async (data) => {
  try {
    console.log("Updating message section with data:", data);
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