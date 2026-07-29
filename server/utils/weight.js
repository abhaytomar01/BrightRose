export const volumetricWeightKg = ({ lengthCm = 0, widthCm = 0, heightCm = 0 }, divisor = 5000) => {
  const vol = lengthCm * widthCm * heightCm;
  return +(vol / divisor).toFixed(3);
};

export const chargeableWeightKg = ({ weightKg = 0, dims = {} }, divisor = 5000) => {
  const volKg = volumetricWeightKg(dims, divisor);
  return Math.max(weightKg, volKg);
};
