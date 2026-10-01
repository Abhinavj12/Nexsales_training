import React from 'react'

const MyProfile = async({params}) => {
    const {id}=await params;
  return (
    <div>MyProfile : {id}</div>
  )
}

export default MyProfile