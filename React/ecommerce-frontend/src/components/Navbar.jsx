import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "15px 30px",
        borderBottom: "1px solid #ddd",
        backgroundColor: "#f5f5f5"
      }}
    >
      <h2 style={{ margin: 0 }}>Ecommerce</h2>

      <div style={{ display: "flex", gap: "10px" }}>
        {role === "USER" && (
          <>
            <button onClick={() => navigate("/user/dashboard")}>
              Dashboard
            </button>

            <button onClick={() => navigate("/products")}>
              Products
            </button>

            <button onClick={() => navigate("/cart")}>
              Cart
            </button>

            <button onClick={() => navigate("/orders")}>
              Orders
            </button>

            <button onClick={() => navigate("/profile")}>
              Profile
            </button>
          </>
        )}

        {role === "ADMIN" && (
          <>
            <button onClick={() => navigate("/admin/dashboard")}>
              Dashboard
            </button>

            <button onClick={() => navigate("/admin/products")}>
              Products
            </button>

            <button onClick={() => navigate("/admin/categories")}>
              Categories
            </button>

            <button onClick={() => navigate("/admin/orders")}>
              Orders
            </button>

            <button onClick={() => navigate("/admin/users")}>
              Users
            </button>

            <button onClick={() => navigate("/admin/reports")}>
              Reports
            </button>
          </>
        )}

        {role && (
          <button onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;