import { ADVANTAGES_INSTANCE } from "./axiosInstance";

export const fetchAdvantages = async () => {
  try {
    const response = await ADVANTAGES_INSTANCE.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching advantages data:", error);
    throw error;
  }
};

export const updateAdvantages = async (data) => {
  try {
    const response = await ADVANTAGES_INSTANCE.post("/", data,{
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating advantages data:", error);
    throw error;
  }
};