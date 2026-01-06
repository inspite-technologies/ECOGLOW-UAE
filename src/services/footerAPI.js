import { FOOTER_INSTANCE } from "./axiosInstance";


export const fetchFooterData = async () => {
  try {
    const response = await FOOTER_INSTANCE.get("/");
    let data = response.data;
    if (data.data) data = data.data;
    return data;
  } catch (error) {
    console.error(" Error fetching footer data:", error);
    throw error;
  }
};

/**
 * Update footer settings
 * @param {Object} footerData - JSON object containing address, links, and socials
 */
export const updateFooterData = async (footerData) => {
  try {
    const response = await FOOTER_INSTANCE.post("/", footerData);
    return response.data;
  } catch (error) {
    console.error(" Error updating footer data:", error);
    throw error;
  }
};
