import ShippingRate from "../../models/shippingRateModel.js";

export const listRates = async (req, res) => {
  const rates = await ShippingRate.find().sort({ country: 1 });
  res.json({ success: true, rates });
};

export const getRate = async (req, res) => {
  const rate = await ShippingRate.findOne({ country: req.params.country });
  res.json({ success: true, rate });
};

export const upsertRate = async (req, res) => {
  const { country, amount, type, minAmountFree, meta } = req.body;
  const rate = await ShippingRate.findOneAndUpdate(
    { country },
    { country, amount, type, minAmountFree, meta },
    { upsert: true, new: true }
  );
  res.json({ success: true, rate });
};

export const deleteRate = async (req, res) => {
  await ShippingRate.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
