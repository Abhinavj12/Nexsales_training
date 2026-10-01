import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../services/orderService";
import Navbar from "../components/Navbar";

const Orders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] =
    useState({});

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMyOrders({
        page: 1,
        limit: 10
      });

      console.log(
        "Orders Response:",
        response
      );

      setOrders(response.data?.orders || []);
      setPagination(
        response.data?.pagination || {}
      );
    } catch (error) {
      console.error(
        "Orders Error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />

        <main style={{ padding: "30px" }}>
          <h2>Loading orders...</h2>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main style={{ padding: "30px" }}>
        <h1>My Orders</h1>

        {error && (
          <p>
            <strong>{error}</strong>
          </p>
        )}

        {orders.length === 0 ? (
          <div>
            <h2>No orders found</h2>

            <button
              onClick={() =>
                navigate("/products")
              }
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px"
            }}
          >
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "20px"
                }}
              >
                <h2>
                  Order #{order.id}
                </h2>

                <p>
                  <strong>Status:</strong>{" "}
                  {order.status}
                </p>

                <p>
                  <strong>Total:</strong>{" "}
                  ₹{order.total_amount}
                </p>

                <p>
                  <strong>Items:</strong>{" "}
                  {order.items?.length || 0}
                </p>

                <button
                  onClick={() =>
                    navigate(
                      `/orders/${order.id}`
                    )
                  }
                >
                  View Order
                </button>
              </div>
            ))}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <p
            style={{
              marginTop: "30px"
            }}
          >
            Page {pagination.page} of{" "}
            {pagination.totalPages}
          </p>
        )}
      </main>
    </>
  );
};

export default Orders;