const {
  Product,
  ProductImage
} = require("@ecommerce/ecommerce-data-model");

const {
  uploadProductImage,
  deleteProductImage
} = require("../../../services/cloudinary-service");


// ============================================================
// ADD PRODUCT IMAGE
// ============================================================

const addProductImage = async ({
  productId,
  file,
  isPrimary = false
}) => {
  // 1. Check product exists
  const product =
    await Product.findByPk(productId);

  if (!product) {
    const error = new Error(
      "Product not found"
    );

    error.statusCode = 404;

    throw error;
  }

  // 2. Upload image to Cloudinary
  const uploadedImage =
    await uploadProductImage(
      file.buffer
    );

  try {
    // 3. If this image is primary,
    // remove primary status from existing images.
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

    // 4. Save image information
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
    // Database failed after Cloudinary upload.
    // Remove uploaded Cloudinary image.
    await deleteProductImage(
      uploadedImage.cloudinary_public_id
    );

    throw error;
  }
};


// ============================================================
// DELETE PRODUCT IMAGE
// ============================================================

const removeProductImage = async ({
  productId,
  imageId
}) => {
  // 1. Find image belonging to this product
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

  // 2. Delete from Cloudinary first
  if (
    productImage.cloudinary_public_id
  ) {
    await deleteProductImage(
      productImage.cloudinary_public_id
    );
  }

  // 3. Soft delete database record
  await productImage.destroy();

  return {
    id: productImage.id,
    product_id:
      productImage.product_id
  };
};
// ============================================================
// REPLACE PRODUCT IMAGE
// ============================================================

const replaceProductImage = async ({
  productId,
  imageId,
  file,
  isPrimary
}) => {
  // 1. Find image belonging to this product
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

  // Keep the old Cloudinary public ID
  const oldPublicId =
    productImage.cloudinary_public_id;

  // 2. Upload new image to Cloudinary
  const uploadedImage =
    await uploadProductImage(
      file.buffer
    );

  try {
    // 3. If new image should be primary,
    // make other images non-primary.
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

    // 4. Update existing database record
    productImage.image_url =
      uploadedImage.image_url;

    productImage.cloudinary_public_id =
      uploadedImage.cloudinary_public_id;

    if (isPrimary !== undefined) {
      productImage.is_primary =
        isPrimary;
    }

    await productImage.save();

    // 5. Delete old Cloudinary image
    if (oldPublicId) {
      await deleteProductImage(
        oldPublicId
      );
    }

    return productImage;
  } catch (error) {
    // Database update failed.
    // Remove the newly uploaded image.
    await deleteProductImage(
      uploadedImage.cloudinary_public_id
    );

    throw error;
  }
};

module.exports = {
  addProductImage,
  removeProductImage,
  replaceProductImage
};