import ecommerceApi from "../api/ecommerceApi";

export const createPayment = async (orderId) => {
  const response = await ecommerceApi.post(
    `/orders/${orderId}/payment`
  );

  return response.data;
};

export const getMyPayment = async (orderId) => {
  const response = await ecommerceApi.get(
    `/orders/${orderId}/payment`
  );

  return response.data;
};

export const verifyPayment = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature
}) => {
  const response = await ecommerceApi.post(
    "/payments/verify",
    {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    }
  );

  return response.data;
};