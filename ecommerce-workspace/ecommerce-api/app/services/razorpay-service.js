const Razorpay = require("razorpay");


class RazorpayService {

  constructor() {

    this.razorpay = new Razorpay({
      key_id:
        process.env.RAZORPAY_KEY_ID,

      key_secret:
        process.env.RAZORPAY_KEY_SECRET
    });
  }


  async createRazorpayOrder({
    amount,
    receipt,
    notes = {}
  }) {

    return this.razorpay.orders.create({
      amount,
      currency: "INR",
      receipt,
      notes,
      partial_payment: false
    });
  }
}


module.exports = RazorpayService;