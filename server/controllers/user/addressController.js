// controllers/user/addressController.js
import User from "../../models/userModel.js";

// ---------------------------------------------
// GET ALL ADDRESSES
// ---------------------------------------------
export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("addresses");

    return res.status(200).send({
      success: true,
      addresses: user?.addresses || []
    });

  } catch (err) {
    console.error("getAddresses err:", err);
    return res
      .status(500)
      .send({ success: false, message: "Server error while loading addresses" });
  }
};

// ---------------------------------------------
// ADD NEW ADDRESS
// ---------------------------------------------
export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user)
      return res.status(404).send({ success: false, message: "User not found" });

    const { label, name, phone, address, city, state, pincode, isDefault } =
      req.body;

    // Field validation
    if (!name || !phone || !address || !city || !state || !pincode) {
      return res.status(400).send({
        success: false,
        message: "Please fill all required fields"
      });
    }

    // If user sets new default → remove other defaults
    if (isDefault) {
      user.addresses.forEach((a) => (a.default = false));
    }

    user.addresses.push({
      label: label || "Home",
      name,
      phone,
      address,
      city,
      state,
      pincode,
      default: !!isDefault
    });

    await user.save();

    return res.status(201).send({
      success: true,
      message: "Address added successfully",
      addresses: user.addresses
    });

  } catch (err) {
    console.error("addAddress err:", err);
    return res
      .status(500)
      .send({ success: false, message: "Server error while adding address" });
  }
};

// ---------------------------------------------
// UPDATE ADDRESS BY ID
// ---------------------------------------------
export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const updateData = req.body;

    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).send({ success: false, message: "User not found" });

    const addressItem = user.addresses.id(addressId);
    if (!addressItem)
      return res.status(404).send({ success: false, message: "Address not found" });

    // Handle default logic
    if (updateData.default === true) {
      user.addresses.forEach((a) => (a.default = false));
    }

    Object.assign(addressItem, updateData);

    await user.save();

    return res.status(200).send({
      success: true,
      message: "Address updated successfully",
      addresses: user.addresses
    });

  } catch (err) {
    console.error("updateAddress err:", err);
    return res
      .status(500)
      .send({ success: false, message: "Server error while updating address" });
  }
};

// ---------------------------------------------
// DELETE ADDRESS
// ---------------------------------------------
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).send({ success: false, message: "User not found" });

    const addr = user.addresses.id(addressId);
    if (!addr)
      return res.status(404).send({ success: false, message: "Address not found" });

    addr.deleteOne();
    await user.save();

    return res.status(200).send({
      success: true,
      message: "Address deleted successfully",
      addresses: user.addresses
    });

  } catch (err) {
    console.error("deleteAddress err:", err);
    return res
      .status(500)
      .send({ success: false, message: "Server error while deleting address" });
  }
};

// ---------------------------------------------
// SET DEFAULT ADDRESS
// ---------------------------------------------
export const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user)
      return res.status(404).send({ success: false, message: "User not found" });

    user.addresses.forEach((a) => {
      a.default = a._id.toString() === addressId;
    });

    await user.save();

    return res.status(200).send({
      success: true,
      message: "Default address set successfully",
      addresses: user.addresses
    });

  } catch (err) {
    console.error("setDefaultAddress err:", err);
    return res.status(500).send({
      success: false,
      message: "Server error while setting default address"
    });
  }
};
