const ProductImageService =
  require("../services/product-image-service");


class ProductImageController {

  constructor() {
    // Image business logic is handled by ProductImageService
    this.service = new ProductImageService();
  }


  async uploadProductImage(
    req,
    res,
    next
  ) {

    try {

      // Multer should provide req.file
      if (!req.file) {

        const error = new Error(
          "Product image is required"
        );

        error.statusCode = 400;

        throw error;
      }

      const isPrimary =
        req.body.is_primary === "true";

      const image =
        await this.service.addProductImage({
          productId: req.params.id,
          file: req.file,
          isPrimary
        });

      return res.status(201).json({
        success: true,
        message:
          "Product image uploaded successfully",
        data: image
      });

    } catch (error) {
      next(error);
    }
  }


  async deleteProductImage(
    req,
    res,
    next
  ) {

    try {

      const result =
        await this.service.removeProductImage({
          productId:
            req.params.productId,
          imageId:
            req.params.imageId
        });

      return res.status(200).json({
        success: true,
        message:
          "Product image deleted successfully",
        data: result
      });

    } catch (error) {
      next(error);
    }
  }


  async replaceProductImage(
    req,
    res,
    next
  ) {

    try {

      if (!req.file) {

        const error = new Error(
          "Replacement image is required"
        );

        error.statusCode = 400;

        throw error;
      }

      let isPrimary;

      if (
        req.body.is_primary !== undefined
      ) {

        isPrimary =
          req.body.is_primary === "true";
      }

      const image =
        await this.service.replaceProductImage({
          productId:
            req.params.productId,
          imageId:
            req.params.imageId,
          file: req.file,
          isPrimary
        });

      return res.status(200).json({
        success: true,
        message:
          "Product image replaced successfully",
        data: image
      });

    } catch (error) {
      next(error);
    }
  }
}


module.exports = ProductImageController;