import ecommerceApi from "../api/ecommerceApi";

export const getMyProfile=async()=>{
    const response=await ecommerceApi.get('/users/me');
    return response.data;
};

export const updateMyProfile=async(ProfileData)=>{
    const response=await ecommerceApi.patch('/users/me',ProfileData);
    return response.data;
};

export const changeMyPassword=async(PasswordData)=>{
    const response=await ecommerceApi.patch('/users/me/password',PasswordData);
    return response.data;
};
