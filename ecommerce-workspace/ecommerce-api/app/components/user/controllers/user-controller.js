const { success } = require("zod");
const UserService = require("../../../services/user-service");

const {
  updateProfileSchema,
  changePasswordSchema,
  updateUserBlockSchema
} = require("../validations/user-validation");


class UserController {

  constructor() {
    // Create the service instance used by this controller
    this.service = new UserService();
  }


  // Get logged-in user's profile
  async getProfile(req, res, next) {
    try {

      const user =
        await this.service.getMyProfile(
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
  }
  //get Admin profile
  async getAdminProfile(req,res,next){
    try{
      const user= await this.service.getAdminProfile(req.user.id);
      return res.status(200).json({
        success:true,
        message:"Admin Profile retrieved successfully",
        data:user
      })
    }catch(error){
      next();
    }
  }


  // Update logged-in user's profile
  async updateProfile(req, res, next) {
    try {

      const validatedData =
        updateProfileSchema.parse(
          req.body
        );

      const user =
        await this.service.updateMyProfile(
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
  }


  // Change logged-in user's password
  async changePassword(req, res, next) {
    try {

      const validatedData =
        changePasswordSchema.parse(
          req.body
        );

      const result =
        await this.service.changeMyPassword(
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
  }


  // Admin blocks or unblocks a user
  async updateUserBlockStatus(
    req,
    res,
    next
  ) {
    try {

      const validatedData =
        updateUserBlockSchema.parse(
          req.body
        );

      const user =
        await this.service.blockUser(
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
  }


  // Admin gets all registered users
  async getAllUsers(req, res, next) {
    try {

      const users =
        await this.service.getAllUsers();

      return res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: users
      });

    } catch (error) {
      next(error);
    }
  }
}


module.exports = UserController;