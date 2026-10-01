import React from 'react'
import { useParams } from 'react-router-dom'

const ProductInfo = () => {

    const param=useParams();
    console.log(param);
  return (
    <div>ProductInfo {param.id}</div>
  )
}

export default ProductInfo