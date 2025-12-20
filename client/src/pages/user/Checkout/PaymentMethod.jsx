// src/pages/user/Checkout/PaymentMethod.jsx
import React, { useState } from "react";

const PaymentMethod = ({ setPaymentMethod }) => {
  const [selected, setSelected] = useState("cod");

  const handleSelect = (method) => {
    setSelected(method);
    setPaymentMethod(method);
  };

  return (
  <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a] mt-10 md:mt-0">
    <div className="max-w-[1250px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px]">

      {/* LEFT SIDE — CONTACT / DELIVERY / PAYMENT */}
      <div className="px-6 md:px-12 py-10 border-r border-gray-200">

        {/* BRAND NAME */}
        <h1 className="text-2xl font-semibold tracking-wide mb-8">
          ABRAKH
        </h1>

        {/* STEP VIEW */}
        {step === 1 && (

          <>
            {/* CONTACT */}
            <section className="mb-10">
              <h2 className="text-lg font-semibold mb-3">Contact</h2>

              <input
                className="w-full border rounded-md p-3 mb-3"
                placeholder="Email or mobile phone number"
                name="email"
                value={address.email}
                onChange={updateAddress}
              />

              <label className="flex gap-2 text-sm">
                <input type="checkbox" defaultChecked />
                Email me with news and offers
              </label>
            </section>

            {/* DELIVERY */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Delivery</h2>

              {/* COUNTRY */}
              <select
                className="border p-3 rounded-md w-full mb-3"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option>India</option>
                <option>USA</option>
                <option>UK</option>
                <option>Canada</option>
                <option>Australia</option>
                <option>Germany</option>
                <option>France</option>
                <option>UAE</option>
                <option>Singapore</option>
              </select>

              {/* NAME */}
              <div className="grid grid-cols-2 gap-3">
                <input className="border p-3 rounded-md" placeholder="Full Name"
                  name="name" value={address.name} onChange={updateAddress}
                />

                <input className="border p-3 rounded-md" placeholder="Phone"
                  name="phone" value={address.phone} onChange={updateAddress}
                />
              </div>

              {/* ADDRESS */}
              <input
                className="border p-3 rounded-md w-full mt-3"
                placeholder="Address"
                name="address"
                value={address.address}
                onChange={updateAddress}
              />

              <div className="grid grid-cols-3 gap-3 mt-3">
                <input className="border p-3 rounded-md" placeholder="City"
                  name="city" value={address.city} onChange={updateAddress}
                />
                <input className="border p-3 rounded-md" placeholder="State"
                  name="state" value={address.state} onChange={updateAddress}
                />
                <input className="border p-3 rounded-md" placeholder="PIN code"
                  name="pincode" value={address.pincode} onChange={updateAddress}
                />
              </div>

              <button
                onClick={nextStep}
                className="mt-6 w-full bg-[#1a1a1a] hover:bg-black text-white py-4 rounded-md text-sm tracking-wide"
              >
                Continue to Payment
              </button>
            </section>
          </>
        )}

        {/* STEP 2 — PAYMENT */}
        {step === 2 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Payment</h2>

            <p className="text-sm text-gray-500 mb-4">
              All transactions are secure and encrypted.
            </p>

            <div className="border rounded-md p-4 flex items-center gap-3">
              <input type="radio" checked readOnly />
              <span className="font-medium">Razorpay Secure • UPI / Cards / Wallets</span>
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={prevStep} className="text-sm underline">
                Return to Information
              </button>

              <button onClick={() => setStep(3)}
                className="bg-[#1a1a1a] text-white px-6 py-3 rounded-md">
                Review Order
              </button>
            </div>
          </>
        )}

        {/* STEP 3 — REVIEW */}
        {step === 3 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Review Order</h2>

            <div className="bg-white border rounded-md">
              {cartItems.map((i) => (
                <div key={i._id} className="flex justify-between p-4 border-b">
                  <div className="flex gap-3">
                    <img src={i.image} className="w-14 h-14 object-cover rounded-md border" />
                    <div>
                      <p className="font-medium">{i.name}</p>
                      <p className="text-sm text-gray-500">Qty: {i.quantity}</p>
                    </div>
                  </div>

                  <p className="font-semibold">
                    ₹{((i.discountPrice || i.price) * i.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={handleRazorpay}
              disabled={paymentProcessing}
              className="mt-8 w-full bg-[#1a1a1a] hover:bg-black text-white py-4 rounded-md tracking-wide"
            >
              {paymentProcessing ? "Processing..." : `Pay ₹${finalTotal.toLocaleString()}`}
            </button>
          </>
        )}
      </div>

      {/* RIGHT SIDE — ORDER SUMMARY */}
      <div className="bg-[#fafafa] px-6 md:px-10 py-10 sticky top-0 h-fit">

        {/* EACH ITEM */}
        {cartItems.map((item) => (
          <div key={item._id} className="flex justify-between mb-6">
            <div className="flex gap-3">
              <img src={item.image}
                className="w-16 h-16 object-cover rounded-md border"
              />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">Size: {item.size}</p>
              </div>
            </div>

            <p className="font-semibold">
              ₹{((item.discountPrice || item.price) * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}

        {/* SUMMARY */}
        <div className="border-t pt-5 space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              {shippingCharge
                ? `₹${shippingCharge.toLocaleString()}`
                : "Calculated at next step"}
            </span>
          </div>

          <div className="flex justify-between font-semibold text-lg pt-2">
            <span>Total</span>
            <span>₹{finalTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

};

export default PaymentMethod;
