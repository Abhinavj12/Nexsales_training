const userService = require("../../../services/user-service");
const {
  updateProfileSchema,
  changePasswordSchema,
  updateUserBlockSchema
} = require("../validations/user-validation");

const getProfile = async (
  req,
  res,
  next
) => {
  try {
    const user =
      await userService.getMyProfile(
        req.user.id
      );

    return res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: user
    });
  } catch (error) {
    next(error);
  }
};
const updateProfile = async (
  req,
  res,
  next
) => {
  try {
    const validatedData =
      updateProfileSchema.parse(req.body);

    const user =
      await userService.updateMyProfile(
        req.user.id,
        validatedData
      );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user
    });
  } catch (error) {
    next(error);
  }
};
const changePassword = async (
  req,
  res,
  next
) => {
  try {
    const validatedData =
      changePasswordSchema.parse(req.body);

    const result =
      await userService.changeMyPassword(
        req.user.id,
        validatedData
      );

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const updateUserBlockStatus = async (
  req,
  res,
  next
) => {
  try {
    const validatedData =
      updateUserBlockSchema.parse(req.body);

    const user =
      await userService.blockUser(
        req.user.id,
        req.params.userId,
        validatedData.is_blocked
      );

    return res.status(200).json({
      success: true,
      message: validatedData.is_blocked
        ? "User blocked successfully"
        : "User unblocked successfully",
      data: user
    });
  } catch (error) {
    next(error);
  }
};
const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();

    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: users
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  updateUserBlockStatus,
  getAllUsers
};