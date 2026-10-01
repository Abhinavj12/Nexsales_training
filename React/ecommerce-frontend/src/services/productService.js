import ecommerceApi from "../api/ecommerceApi";

export const getAllProducts = async (query = {}) => {
  try {
    const params = {};

    if (query.search && query.search.trim() !== "") {
      params.search = query.search.trim();
    }

    if (query.category_id) {
      params.category_id = query.category_id;
    }

    if (query.min_price !== undefined && query.min_price !== "") {
      params.min_price = query.min_price;
    }

    if (query.max_price !== undefined && query.max_price !== "") {
      params.max_price = query.max_price;
    }

    if (query.sort_by) {
      params.sort_by = query.sort_by;
    }

    if (query.sort_order) {
      params.sort_order = query.sort_order;
    }

    if (query.page) {
      params.page = query.page;
    }

    if (query.limit) {
      params.limit = query.limit;
    }

    const response = await ecommerceApi.get("/products", {
      params
    });

    return response.data;
  } catch (error) {
    console.error("Get products error:", error);
    throw error;
  }
};
export const getProductById = async (productId) => {
  try {
    const response = await ecommerceApi.get(
      `/products/${productId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get product by ID error:",
      error
    );

    throw error;
  }
};