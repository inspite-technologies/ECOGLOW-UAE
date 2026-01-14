import { HOME_ABOUT_INSTANCE } from "./axiosInstance";

export const fetchHomeAbout = async () => {
  const startTime = Date.now();
  console.log(`🕐 Frontend: API Call Started at ${new Date().toISOString()}`);
  
  try {
    const response = await HOME_ABOUT_INSTANCE.get("/");
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`✅ Frontend: API Response Received`);
    console.log(`⏱️ Frontend: API Call Ended at ${new Date().toISOString()}`);
    console.log(`⏳ Frontend: Total Duration: ${duration}ms`);
    
    return response.data;
  }
  catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.error("❌ Frontend: Error fetching Home About data:", error);
    console.log(`⏱️ Frontend: API Call Failed at ${new Date().toISOString()}`);
    console.log(`⏳ Frontend: Duration before error: ${duration}ms`);
    throw error;
  }
};

export const updateHomeAbout = async (data) => {
  const startTime = Date.now();
  console.log(`🕐 Frontend: Update API Call Started at ${new Date().toISOString()}`);
  
  try {
    const response = await HOME_ABOUT_INSTANCE.put("/", data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log(`✅ Frontend: Update API Response Received`);
    console.log(`⏱️ Frontend: Update API Call Ended at ${new Date().toISOString()}`);
    console.log(`⏳ Frontend: Total Duration: ${duration}ms`);
    
    return response.data;
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.error("❌ Frontend: Error updating Home About data:", error);
    console.log(`⏱️ Frontend: Update API Call Failed at ${new Date().toISOString()}`);
    console.log(`⏳ Frontend: Duration before error: ${duration}ms`);
    throw error;
  }
};