import axiosInstance from "../config/axiosConfig";

export const parseAPI = {
  parseToString: async (form) => {
    try {
      const response = await axiosInstance.post("/parse-text", form);
      return response.data;
    } catch (error) {
      return error;
    }
  }
}
