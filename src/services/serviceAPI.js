import { SERVICES_INSTANCE } from "./axiosInstance";


export const fetchServices = async () => {
  try {
    
    const response = await SERVICES_INSTANCE.get("/");
    console.log("fetching data...", response.data);

    return response.data;
  }
    catch (error) {
    console.error("Error fetching services data:", error);
    throw error;
  }
};

export const updateService = async (data) => {
    try {     
      
        const response = await SERVICES_INSTANCE.put(`/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
        return response.data;
    } catch (error) {
        console.error("Error updating service data:", error);
        throw error;
    }
};

