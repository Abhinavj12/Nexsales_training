import React from "react";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import { Products } from "./pages/Products";
import {NotFound } from "./pages/NotFound"

import Men from "./components/Men";
import Women from "./components/Women";
import ProductInfo from "./components/ProductInfo";

import { Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div>


      <Routes>
        <Route path="/" element={<Navbar />} />

        <Route
          path="/home"
          element={<Home />}
        />

        <Route
          path="/aboutus"
          element={<AboutUs />}
        />

        <Route
          path="/products"
          element={<Products />}
        >

          <Route
            path="men"
            element={<Men />}
          />

          <Route
            path="women"
            element={<Women />}
          />

        </Route>

        <Route
          path="/products/:id"
          element={<ProductInfo />}
        />

         //page other than above mention
       <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

     

    </div>
  );
};

export default App;