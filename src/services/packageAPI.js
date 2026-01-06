import { PACKAGES_INSTANCE } from "./axiosInstance";

export const fetchPackages = async () => {
  try {
    const response = await PACKAGES_INSTANCE.get("/");
    console.log("✅ API Raw Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching packages:", error);
    throw error;
  }
};

export const updatePackages = async (formData) => {
  try {
    const response = await PACKAGES_INSTANCE.put("/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating packages:", error);
    throw error;
  }
};