const multer = require("multer");

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp"
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
  console.log("========== IMAGE UPLOAD ==========");
  console.log("Field:", file.fieldname);
  console.log("Original name:", file.originalname);
  console.log("MIME type:", file.mimetype);
  console.log("==================================");

  // if (!allowedMimeTypes.includes(file.mimetype)) {
  //   const error = new Error(
  //     "Only JPEG, PNG, and WebP images are allowed"
  //   );

  //   error.statusCode = 400;

  //   return callback(error);
  // }

  callback(null, true);
};

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter
});

const uploadProductImage = upload.single("image");

module.exports = uploadProductImage;