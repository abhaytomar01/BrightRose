export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const userExist = await userModel.findOne({ email });
    if (userExist) {
      return res.status(400).send({
        success: false,
        message: "Email already registered",
      });
    }

    const hashed = await hashPassword(password);

    const user = await userModel.create({
      name,
      email,
      phone,
      password: hashed,
      role: "user",
    });

    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).send({
      success: true,
      message: "Registration successful",
      user,
      token,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Register error",
    });
  }
};
