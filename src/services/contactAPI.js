import { CONTACT_INSTANCE } from "./axiosInstance";

export const getContactSettings = async () => {
  try {
    const response = await CONTACT_INSTANCE.get("/");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const upsertContactSettings = async (settingsData, file) => {
  try {
    const formData = new FormData();

    // 1. Append Hero & Layout fields (Top Level)
    formData.append("heroTitle", settingsData.heroTitle);
    formData.append("heroSubtitle", settingsData.heroSubtitle);
    formData.append("formLabel", settingsData.formLabel);
    formData.append("formMainTitle", settingsData.formMainTitle);
    formData.append("mapEmbedUrl", settingsData.mapEmbedUrl);

    // 2. Append Contact Info (These MUST be handled by your backend controller)
    // Most controllers expect these to be flat in the Request Body, then grouped in the Controller
    formData.append("address", settingsData.address);
    formData.append("phone", settingsData.phone);
    formData.append("email", settingsData.email);

    if (file) {
      formData.append("bannerImage", file);
    }

    const response = await CONTACT_INSTANCE.put("/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};