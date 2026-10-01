import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getMyOrderById
} from "../services/orderService";

import {
  createPayment,
  verifyPayment
} from "../services/paymentService";

import Navbar from "../components/Navbar";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getMyOrderById(id);

        console.log(
          "Order Details Response:",
          response
        );

        setOrder(response.data);
      } catch (error) {
        console.error(
          "Order Details Error:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load order"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handlePayment = async () => {
    try {
      setPaymentLoading(true);
      setPaymentMessage("");
      setError("");

      // 1. Create Razorpay order from our backend
      const response = await createPayment(id);

      console.log(
        "Create Payment Response:",
        response
      );

      const paymentData = response.data;
      const razorpayData = paymentData.razorpay;

      // 2. Check Razorpay script
      if (!window.Razorpay) {
        throw new Error(
          "Razorpay Checkout script is not loaded"
        );
      }

      // 3. Razorpay Checkout options
      const options = {
        key: razorpayData.key_id,

        amount: razorpayData.amount,

        currency: razorpayData.currency,

        name: "E-Commerce Store",

        description: `Payment for Order ${order.id}`,

        order_id: razorpayData.order_id,

        handler: async function (paymentResponse) {
          try {
            console.log(
              "Razorpay Payment Response:",
              paymentResponse
            );

            // 4. Send Razorpay response to backend
            const verifyResponse =
              await verifyPayment({
                razorpay_order_id:
                  paymentResponse.razorpay_order_id,

                razorpay_payment_id:
                  paymentResponse.razorpay_payment_id,

                razorpay_signature:
                  paymentResponse.razorpay_signature
              });

            console.log(
              "Payment Verification Response:",
              verifyResponse
            );

            setPaymentMessage(
              "Payment successful!"
            );

            // 5. Reload order to get CONFIRMED status
            const updatedOrderResponse =
              await getMyOrderById(id);

            setOrder(
              updatedOrderResponse.data
            );
          } catch (error) {
            console.error(
              "Payment Verification Error:",
              error
            );

            setError(
              error.response?.data?.message ||
                "Payment verification failed"
            );
          } finally {
            setPaymentLoading(false);
          }
        },

        prefill: {
          name: "",
          email: "",
          contact: ""
        },

        theme: {
          color: "#3399cc"
        },

        modal: {
          ondismiss: function () {
            setPaymentLoading(false);
            setPaymentMessage(
              "Payment window closed."
            );
          }
        }
      };

      // 6. Open Razorpay Checkout
      const razorpay = new window.Razorpay(
        options
      );

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "Razorpay Payment Failed:",
            response
          );

          setError(
            response.error?.description ||
              "Payment failed"
          );

          setPaymentLoading(false);
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "Create Payment Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to start payment"
      );

      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main style={{ padding: "30px" }}>
          <h2>Loading order...</h2>
        </main>
      </>
    );
  }

  if (error && !order) {
    return (
      <>
        <Navbar />

        <main style={{ padding: "30px" }}>
          <h2>{error}</h2>
        </main>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />

        <main style={{ padding: "30px" }}>
          <h2>Order not found</h2>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main style={{ padding: "30px" }}>
        <h1>Order Details</h1>

        <p>
          <strong>Order ID:</strong>{" "}
          {order.id}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {order.status}
        </p>

        <p>
          <strong>Total:</strong>{" "}
          ₹{order.total_amount}
        </p>

        {paymentMessage && (
          <p
            style={{
              padding: "10px",
              background: "#e8f5e9",
              borderRadius: "6px"
            }}
          >
            {paymentMessage}
          </p>
        )}

        {error && (
          <p
            style={{
              padding: "10px",
              background: "#ffebee",
              color: "red",
              borderRadius: "6px"
            }}
          >
            {error}
          </p>
        )}

        {order.status === "PENDING" && (
          <button
            onClick={handlePayment}
            disabled={paymentLoading}
            style={{
              padding: "12px 20px",
              marginBottom: "20px",
              cursor: paymentLoading
                ? "not-allowed"
                : "pointer"
            }}
          >
            {paymentLoading
              ? "Processing Payment..."
              : "Pay Now"}
          </button>
        )}

        <h2>Items</h2>

        {order.items?.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px"
            }}
          >
            <p>
              <strong>Product:</strong>{" "}
              {item.product?.name ||
                item.product_id}
            </p>

            <p>
              <strong>SKU:</strong>{" "}
              {item.product?.sku}
            </p>

            <p>
              <strong>Quantity:</strong>{" "}
              {item.quantity}
            </p>

            <p>
              <strong>Unit Price:</strong>{" "}
              ₹{item.unit_price}
            </p>

            <p>
              <strong>Line Total:</strong>{" "}
              ₹{item.line_total}
            </p>
          </div>
        ))}

        <button
          onClick={() => navigate("/orders")}
        >
          Back to Orders
        </button>
      </main>
    </>
  );
};

export default OrderDetails;