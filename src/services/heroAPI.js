import { HERO_INSTANCE } from "./axiosInstance";

export const fetchHero = async () => {
  try {
    const response = await HERO_INSTANCE.get("/");
    return response.data;
  }
    catch (error) {
    console.error("Error fetching hero data:", error);
    throw error;
  }
};

export const updateHero = async (formData) => {
  try {
    const response = await HERO_INSTANCE.put("/", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
  }
    catch (error) {
    console.error("Error updating hero data:", error);
    throw error;
  }
};

export const createHero = async (formData) => {
  try {
    const response = await HERO_INSTANCE.post("/", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
  }
    catch (error) {
    console.error("Error creating hero data:", error);
    throw error;
  } 
};