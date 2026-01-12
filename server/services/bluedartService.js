// server/services/bluedartService.js
import axios from "axios";

export const createBluedartShipment = async (order) => {
  const login = process.env.BLUEDART_LOGIN;
  const licenceKey = process.env.BLUEDART_LICENCE_KEY;
  const customerCode = process.env.BLUEDART_CUSTOMER_CODE;
  const apiVersion = process.env.BLUEDART_API_VERSION;
  const waybillUrl = process.env.BLUEDART_WAYBILL_URL; // from docs

  if (!login || !licenceKey || !customerCode || !waybillUrl) {
    throw new Error("Bluedart credentials missing");
  }

  // Map order to Bluedart request shape (pseudo; adjust to actual WSDL/JSON):
  const totalWeightKg =
    order.products.reduce(
      (w, p) => w + Number(p.quantity || 0) * 0.5,
      0.5
    );

  const payload = {
    Profile: {
      Api_type: process.env.BLUEDART_API_TYPE || "S",
      LoginID: login,
      LicenceKey: licenceKey,
      Version: apiVersion,
      Customercode: customerCode,
      // plus any other fields docs require
    },
    Request: {
      Shipper: {
        CustomerName: "Bright Rose",
        CustomerAddress1: process.env.SHIP_FROM_ADDRESS || "",
        CustomerPincode: process.env.BLUEDART_ORIGIN_PINCODE || "110020",
        CustomerMobile: process.env.SHIP_FROM_PHONE || "",
      },
      Consignee: {
        ConsigneeName: order.buyer?.name || "",
        ConsigneeAddress1: order.shippingInfo?.address || "",
        ConsigneePincode: order.shippingInfo?.pincode || "",
        ConsigneeMobile: order.buyer?.phone || "",
      },
      Services: {
        ProductCode: "A", // e.g. Express; confirm from Bluedart
        SubProductCode: "A",
        ActualWeight: totalWeightKg,
        CollectableAmount: 0, // prepaid
        DeclaredValue: order.totalAmount,
      },
      // ...other required fields (pieces, reference number, etc.)
    },
  };

  const resp = await axios.post(waybillUrl, payload, {
    headers: { "Content-Type": "application/json" }, // or XML/SOAP depending on API
  });

  // Parse response according to doc; this is placeholder:
  const awb = resp.data?.AWBNo || resp.data?.WaybillNo;
  const labelUrl = resp.data?.LabelURL;
  const trackingUrl = resp.data?.TrackingURL;

  if (!awb) {
    throw new Error("Bluedart did not return AWB");
  }

  return {
    carrier: "BLUEDART",
    awb,
    labelUrl,
    trackingUrl,
    rawRequest: payload,
    rawResponse: resp.data,
  };
};
