const { registerSchema, loginSchema,resetPasswordSchema,forgotPasswordSchema,createAdminSchema }= require("../validations/auth-validation");
const { register,verifyEmail,login,resetPassword:resetPasswordService,forgotPassword:forgotPasswordService,createAdmin } =require("../services/auth-service");
//const { success } = require("zod");

const registerUser=async(req,res,next)=>{
    try{
        const validatedData=registerSchema.parse(req.body);
        const user=await register(validatedData);

        return res.status(201).json({
            success:true,
            message:"Registration successful. Please verify your email address.",
            data:user
        });
    }catch(error){
        next(error);
    }
};

const createAdminUser = async (
  req,
  res,
  next
) => {
  try {
    const validatedData =
      createAdminSchema.parse(req.body);

    const admin =
      await createAdmin(validatedData);

    return res.status(201).json({
      success: true,
      message:
        "Admin created successfully. Please verify the email address.",
      data: admin
    });
  } catch (error) {
    next(error);
  }
};

const verifyUserEmail = async (
  req,
  res,
  next
) => {
  try {
    const { token } = req.query;

    const result = await verifyEmail(token);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const loginUser=async(req,res,next)=>{
  try{
    const validatedData=loginSchema.parse(req.body);
    const result=await login(validatedData);

     return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result
    });

  }catch(error)
  {
    next(error);
  }
}

const getCurrentUser = async (
  req,
  res,
  next
) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Authentication successful",
      data: {
        userId: req.user.id,
        role: req.user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
const getAdminTest = async (
  req,
  res,
  next
) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Admin authorization successful",
      data: {
        userId: req.user.id,
        role: req.user.role
      }
    });
  } catch (error) {
    next(error);
  }
};
const resetPassword = async (
  req,
  res,
  next
) => {
  try {
    const validatedData =
      resetPasswordSchema.parse(req.body);

    const result =
      await resetPasswordService(
        validatedData
      );

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
      data: result
    });
  } catch (error) {
    next(error);
  }

};
const forgotPassword = async (
  req,
  res,
  next
) => {
  try {
    const validatedData =
      forgotPasswordSchema.parse(req.body);

    await forgotPasswordService(
      validatedData.email
    );

    return res.status(200).json({
      success: true,
      message:
        "If an account exists with this email, password reset instructions have been sent"
    });
  } catch (error) {
    next(error);
  }
};

module.exports={
    registerUser,
    createAdminUser,
    verifyUserEmail,
    loginUser,
    getCurrentUser,
    getAdminTest,
    resetPassword,
    forgotPassword
};