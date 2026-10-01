import ecommerceApi from "../api/ecommerceApi";

export const createOrder = async () => {
  try {
    const response = await ecommerceApi.post(
      "/orders"
    );

    return response.data;
  } catch (error) {
    console.error(
      "Create order error:",
      error
    );

    throw error;
  }
};

export const getMyOrders = async (query = {}) => {
  try {
    const params = {};

    if (query.status) {
      params.status = query.status;
    }

    if (query.page) {
      params.page = query.page;
    }

    if (query.limit) {
      params.limit = query.limit;
    }

    const response = await ecommerceApi.get(
      "/orders",
      {
        params
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get my orders error:",
      error
    );

    throw error;
  }
};

export const getMyOrderById = async (
  orderId
) => {
  try {
    const response = await ecommerceApi.get(
      `/orders/${orderId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get order details error:",
      error
    );

    throw error;
  }
};