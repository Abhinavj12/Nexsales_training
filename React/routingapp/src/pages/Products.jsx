import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

export const Products = () => {

  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/home");
  };

  return (
    <div>
      <h1>Products</h1>

      <button onClick={handleHomeClick}>
        Home
      </button>

      <Outlet />
    </div>
  );
};