export const testController = (req, res) => {
  try {
    res.status(200).send({
      success: true,
      message: "Protected route accessed successfully!",
      user: req.user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in protected route",
      error: error.message,
    });
  }
};
