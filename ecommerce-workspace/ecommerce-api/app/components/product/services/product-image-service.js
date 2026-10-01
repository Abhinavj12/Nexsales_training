const {
  Product,
  ProductImage
} = require("@ecommerce/ecommerce-data-model");

const CloudinaryService =
  require("../../../services/cloudinary-service");


class ProductImageService {

  constructor() {
    this.cloudinaryService =
      new CloudinaryService();
  }

  // Upload a new product image
  async addProductImage({
    productId,
    file,
    isPrimary = false
  }) {

    // Check product exists
    const product =
      await Product.findByPk(
        productId
      );

    if (!product) {
      const error = new Error(
        "Product not found"
      );

      error.statusCode = 404;

      throw error;
    }

    // Upload image to Cloudinary
    const uploadedImage =
      await this.cloudinaryService.uploadProductImage(
        file.buffer
      );

    try {

      // If this is primary,
      // remove primary status from other images.
      if (isPrimary) {

        await ProductImage.update(
          {
            is_primary: false
          },
          {
            where: {
              product_id: productId,
              is_primary: true
            }
          }
        );
      }

      // Save image details in database
      const productImage =
        await ProductImage.create({
          product_id: productId,
          image_url:
            uploadedImage.image_url,
          cloudinary_public_id:
            uploadedImage.cloudinary_public_id,
          is_primary: isPrimary
        });

      return productImage;

    } catch (error) {

      // If database operation fails,
      // remove image from Cloudinary.
      await this.cloudinaryService.deleteProductImage(
        uploadedImage.cloudinary_public_id
      );

      throw error;
    }
  }


  // Delete a product image
  async removeProductImage({
    productId,
    imageId
  }) {

    const productImage =
      await ProductImage.findOne({
        where: {
          id: imageId,
          product_id: productId
        }
      });

    if (!productImage) {
      const error = new Error(
        "Product image not found"
      );

      error.statusCode = 404;

      throw error;
    }

    // Remove image from Cloudinary first
    if (
      productImage.cloudinary_public_id
    ) {

      await this.cloudinaryService.deleteProductImage(
        productImage.cloudinary_public_id
      );
    }

    // Soft delete database record
    await productImage.destroy();

    return {
      id: productImage.id,
      product_id:
        productImage.product_id
    };
  }


  // Replace an existing product image
  async replaceProductImage({
    productId,
    imageId,
    file,
    isPrimary
  }) {

    const productImage =
      await ProductImage.findOne({
        where: {
          id: imageId,
          product_id: productId
        }
      });

    if (!productImage) {
      const error = new Error(
        "Product image not found"
      );

      error.statusCode = 404;

      throw error;
    }

    // Keep old Cloudinary ID
    const oldPublicId =
      productImage.cloudinary_public_id;

    // Upload new image
    const uploadedImage =
      await this.cloudinaryService.uploadProductImage(
        file.buffer
      );

    try {

      // If new image is primary,
      // make all other images non-primary.
      if (isPrimary === true) {

        await ProductImage.update(
          {
            is_primary: false
          },
          {
            where: {
              product_id: productId,
              is_primary: true
            }
          }
        );
      }

      // Update database record
      productImage.image_url =
        uploadedImage.image_url;

      productImage.cloudinary_public_id =
        uploadedImage.cloudinary_public_id;

      if (isPrimary !== undefined) {
        productImage.is_primary =
          isPrimary;
      }

      await productImage.save();

      // Delete old Cloudinary image
      if (oldPublicId) {

        await this.cloudinaryService.deleteProductImage(
          oldPublicId
        );
      }

      return productImage;

    } catch (error) {

      // Remove newly uploaded image
      // if database update fails.
      await this.cloudinaryService.deleteProductImage(
        uploadedImage.cloudinary_public_id
      );

      throw error;
    }
  }
}


module.exports = ProductImageService;