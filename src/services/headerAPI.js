import { HEADER_INSTANCE } from "./axiosInstance";

/**
 * Fetch Header Settings
 * GET /api/header
 * (Assumes HEADER_INSTANCE base URL is set to .../api/header)
 */
export const fetchHeader = async () => {
  try {
    const response = await HEADER_INSTANCE.get('/');
    return response.data;
  } catch (error) {
    console.error("Error fetching header settings:", error);
    throw error;
  }
};

/**
 * Update Header Settings
 * PUT /api/header
 * Uses FormData to handle the logo file and JSON strings
 */
export const updateHeader = async (formData) => {
  try {
    const response = await HEADER_INSTANCE.put('/', formData);
    return response.data;
  } catch (error) {
    console.error("Error updating header settings:", error);
    throw error;
  }
};