import { Link } from "react-router-dom";

const OrderItem = ({ order, item }) => {
  const {
    _id,
    orderStatus,
    createdAt,
    amount,
    invoiceUrl,   // <-- make sure this exists in backend response
  } = order;

  return (
    <div className="flex flex-col bg-white border rounded-lg shadow-sm hover:shadow-lg transition p-5">

      {/* Main Clickable Area (Link to Order Details) */}
      <Link
        to={`/user/orders/order_details/${_id}`}
        className="flex flex-col sm:flex-row items-start"
      >
        {/* Image */}
        <div className="w-full sm:w-28 h-20 mb-3 sm:mb-0">
          <img
            src={item?.image || "/fallback.jpg"}
            alt={item?.name}
            className="w-full h-full object-contain"
            draggable="false"
          />
        </div>

        {/* Details */}
        <div className="flex justify-between w-full sm:px-5">

          <div className="flex flex-col">
            <p className="text-sm font-medium">{item?.name}</p>
            <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
          </div>

          <div className="text-right">
            <p className="text-sm font-semibold">₹{amount}</p>
            <p className="text-xs text-gray-600">
              Ordered: {new Date(createdAt).toDateString()}
            </p>
            <p className="text-xs font-medium text-black mt-1">
              {orderStatus}
            </p>
          </div>

        </div>
      </Link>

      {/* ⭐ Invoice Download Button (Below Card) */}
      {invoiceUrl ? (
        <a
          href={`${import.meta.env.VITE_SERVER_URL}/${invoiceUrl}`}
          target="_blank"
          rel="noreferrer"
          className="text-[#AD000F] underline text-sm mt-4 self-start hover:text-black transition"
        >
          Download Invoice (PDF)
        </a>
      ) : (
        <p className="text-xs text-gray-500 mt-4">
          Invoice will be available after order confirmation.
        </p>
      )}

    </div>
  );
};

export default OrderItem;
