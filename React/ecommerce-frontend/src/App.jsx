import React from 'react';
import { Login } from './pages/Login';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './pages/ProtectedRoute';
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        <Route
          path='/login'
          element={<Login />}
        />

        <Route
          path='/user/dashboard'
          element={
            <ProtectedRoute allowedRole="USER">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/products" element={<Products />} />
        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />
        <Route
          path="/orders/create"
          element={<Checkout />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />
        <Route
          path="/orders/:id"
          element={<OrderDetails />}
        />
        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path='/admin/dashboard'
          element={<ProtectedRoute allowedRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App;