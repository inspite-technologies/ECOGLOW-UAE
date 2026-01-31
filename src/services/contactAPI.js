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

    // 1. Top Level Fields
    formData.append("heroTitle", settingsData.heroTitle);
    formData.append("heroSubtitle", settingsData.heroSubtitle);
    formData.append("formLabel", settingsData.formLabel);
    formData.append("formMainTitle", settingsData.formMainTitle);
    formData.append("mapEmbedUrl", settingsData.mapEmbedUrl);
    formData.append("contactEmail", settingsData.contactEmail);

    // 2. Arrays (Must be stringified for FormData)
    formData.append("enquirySubjects", JSON.stringify(settingsData.enquirySubjects));

    // 3. Contact Info (Grouping these too, just in case)
    const contactInfoData = {
      address: settingsData.address,
      phone: settingsData.phone,
      email: settingsData.email
    };
    // Note: If your backend expects address/phone flat, keep your old way. 
    // But usually, grouping is safer if the DB has it nested.
    formData.append("address", settingsData.address);
    formData.append("phone", settingsData.phone);
    formData.append("email", settingsData.email);

    // -----------------------------------------------------------
    // ✅ FIX: Group Social Links and JSON.stringify them
    // -----------------------------------------------------------
    const socialLinksData = {
      facebook: settingsData.facebook || "",
      instagram: settingsData.instagram || "",
      youtube: settingsData.youtube || "",
      twitter: settingsData.twitter || "",
      linkedin: settingsData.linkedin || ""
    };
    formData.append("socialLinks", JSON.stringify(socialLinksData));
    // -----------------------------------------------------------

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