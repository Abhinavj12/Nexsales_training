import React from 'react'
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children,allowedRole}) => {
  const token=localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  if(!token){
    return <Navigate to="/login" replace/>;
  }
  if(allowedRole && role!==allowedRole){
    if(role==="ADMIN"){
        return <Navigate to="/admin/dashboard" replace/>
    }
    return <Navigate to="/user/dashboard" replace/>

  }
    return children;

}

export default ProtectedRoute