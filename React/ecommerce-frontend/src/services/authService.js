import ecommerceApi from "../api/ecommerceApi";

export const loginUser = async (loginData) => {
  try {
    const response = await ecommerceApi.post(
      "/auth/login",
      loginData
    );

    return response.data;
  } catch (error) {
    console.error(
      "Login failed:",
      error.response?.data || error.message
    );

    throw error;
  }
};