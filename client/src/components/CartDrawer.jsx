import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { useCart } from "../context/cart";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CartDrawer({ isOpen, setIsOpen }) {
  const {
    cartItems = [],
    subtotal = 0,
    totalItems = 0,
    addToCart,
    updateQuantity,
    removeFromCart,
  } = useCart();

  const navigate = useNavigate();

  const increase = (item) => {
    const q = item.quantity + 1;
    addToCart(item, q);
    updateQuantity(item.key, q);
  };

  const decrease = (item) => {
    if (item.quantity > 1) {
      const q = item.quantity - 1;
      addToCart(item, q);
      updateQuantity(item.key, q);
    } else {
      removeFromCart(item.key);
    }
  };

  const goCheckout = () => {
    if (!cartItems.length) return toast.info("Your cart is empty");
    setIsOpen(false);
    navigate("/checkout");
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[999]" onClose={setIsOpen}>
        
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </Transition.Child>

        {/* Drawer */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-y-0 right-0 flex max-w-full">

            <Transition.Child
              as={Fragment}
              enter="transform transition ease-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in duration-200"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="w-screen max-w-md bg-white shadow-xl h-full flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center px-6 py-5 border-b">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-medium tracking-wide">
                      Cart
                    </h2>

                    {totalItems > 0 && (
                      <span className="text-sm border rounded-full w-6 h-6 grid place-items-center">
                        {totalItems}
                      </span>
                    )}
                  </div>

                  <button onClick={() => setIsOpen(false)}>
                    <X size={22} />
                  </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {!cartItems.length ? (
                    <p className="text-gray-500 text-center mt-10">
                      Your cart is empty
                    </p>
                  ) : (
                    cartItems.map((item) => (
                      <div
                        key={item.key}
                        className="flex justify-between gap-3 pb-5 mb-5 border-b"
                      >
                        
                        {/* Image */}
                        <img
                          src={item.image}
                          className="w-20 h-24 object-cover rounded-md border"
                        />

                        {/* Details */}
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          {item.size && (
                            <p className="text-sm text-gray-500">
                              {item.size}
                            </p>
                          )}

                          <p className="font-semibold mt-1">
                            ₹{(item.discountPrice || item.price).toLocaleString()}
                          </p>

                          {/* Quantity */}
                          <div className="mt-3 flex items-center gap-3 border px-3 py-1.5 w-fit rounded-md">
                            <button onClick={() => decrease(item)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => increase(item)}>+</button>
                          </div>
                        </div>

                        {/* Delete */}
                        <button
                          onClick={() => removeFromCart(item.key)}
                          className="text-gray-500 hover:text-black"
                        >
                          🗑
                        </button>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer Price Section */}
                <div className="border-t px-6 py-4 space-y-2">

                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      Duties & taxes included. Shipping calculated at checkout.
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <button
                    disabled={!cartItems.length}
                    onClick={goCheckout}
                    className="w-full bg-[#5A0A0A] hover:bg-black text-white py-4 rounded-md mt-3 tracking-wide disabled:opacity-50"
                  >
                    Check out
                  </button>
                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>

      </Dialog>
    </Transition.Root>
  );
}
