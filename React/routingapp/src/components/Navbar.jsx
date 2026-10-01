import React from 'react'
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
        <Link to='/home'>Home</Link>
         <Link to='/aboutus'> About Us</Link>
          <Link to='/products'> Products</Link>
    </div>
  )
}

export default Navbar