const health = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Ecommerce API is running"
  });
};

module.exports = {
  health
};