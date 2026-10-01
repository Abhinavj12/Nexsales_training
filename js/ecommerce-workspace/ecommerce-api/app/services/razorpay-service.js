const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createRazorpayOrder = async ({
  amount,
  receipt,
  notes = {}
}) => {
  return razorpay.orders.create({
    amount,
    currency: "INR",
    receipt,
    notes,
    partial_payment: false
  });
};

module.exports = {
  razorpay,
  createRazorpayOrder
};