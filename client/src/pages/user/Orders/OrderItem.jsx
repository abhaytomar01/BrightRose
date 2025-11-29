import { Link } from "react-router-dom";

const OrderItem = ({ order, item }) => {
  const {
    _id,
    orderStatus,
    createdAt,
    amount,
  } = order;

  return (
    <Link
      to={`/user/orders/order_details/${_id}`}
      className="flex flex-col sm:flex-row items-start bg-white border rounded-lg shadow-sm p-5 hover:shadow-lg transition"
    >
      {/* Image */}
      <div className="w-full sm:w-28 h-20 mb-3 sm:mb-0">
        <img
          src={item?.image || "/fallback.jpg"}
          alt={item.name}
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
  );
};

export default OrderItem;
