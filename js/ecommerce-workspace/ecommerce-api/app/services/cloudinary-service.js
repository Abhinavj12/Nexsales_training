const cloudinary = require("../configs/cloudinary");

const uploadProductImage = async (fileBuffer) => {
  if (!fileBuffer) {
    const error = new Error(
      "Image file is required"
    );

    error.statusCode = 400;

    throw error;
  }

  return new Promise((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder: "ecommerce/products",
          resource_type: "image"
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          resolve({
            image_url: result.secure_url,
            cloudinary_public_id: result.public_id
          });
        }
      );

    uploadStream.end(fileBuffer);
  });
};

const deleteProductImage = async (
  publicId
) => {
  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(
    publicId,
    {
      resource_type: "image"
    }
  );
};

module.exports = {
  uploadProductImage,
  deleteProductImage
};