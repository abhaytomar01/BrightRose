import React from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { formatDate } from "../../../utils/functions";

const Tracker = ({ statusHistory = [], currentStatus, orderOn }) => {
  // Sort history newest first
  const history = [...statusHistory].sort((a, b) => new Date(b.date) - new Date(a.date));

  // Fallback if no history exists (for very old orders)
  if (!history.length) {
    history.push({
      status: currentStatus || "PLACED",
      date: orderOn || new Date(),
      message: "Order placed successfully",
    });
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "PLACED":
      case "PAID":
        return "text-blue-600";
      case "PACKED":
      case "SHIPPED":
        return "text-indigo-600";
      case "OUT_FOR_DELIVERY":
        return "text-yellow-600";
      case "DELIVERED":
        return "text-green-600";
      case "CANCELLED":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case "PLACED":
      case "PAID":
        return "bg-blue-100";
      case "PACKED":
      case "SHIPPED":
        return "bg-indigo-100";
      case "OUT_FOR_DELIVERY":
        return "bg-yellow-100";
      case "DELIVERED":
        return "bg-green-100";
      case "CANCELLED":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="py-4">
      <h3 className="text-lg font-semibold mb-6">Order Timeline</h3>

      <div className="relative border-l-2 border-gray-200 ml-3 md:ml-4 space-y-8">
        {history.map((event, index) => {
          const isLatest = index === 0;
          const statusColor = getStatusColor(event.status);
          const statusBg = getStatusBg(event.status);

          return (
            <div key={index} className="relative pl-6 md:pl-8">
              {/* Timeline dot */}
              <div className="absolute -left-[11px] top-1">
                {isLatest ? (
                  <CheckCircleIcon className={`${statusColor} bg-white rounded-full`} style={{ fontSize: 22 }} />
                ) : (
                  <RadioButtonUncheckedIcon className="text-gray-300 bg-white rounded-full" style={{ fontSize: 22 }} />
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1 md:gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 tracking-wide uppercase text-sm">
                      {event.status.replace(/_/g, " ")}
                    </span>
                    {isLatest && (
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${statusColor} ${statusBg}`}>
                        Latest
                      </span>
                    )}
                  </div>

                  {event.message && (
                    <p className="text-gray-600 text-sm mt-1">{event.message}</p>
                  )}
                  {event.location && (
                    <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
                      📍 {event.location}
                    </p>
                  )}
                </div>

                <div className="text-left md:text-right mt-1 md:mt-0">
                  <p className="text-xs font-medium text-gray-800">
                    {new Date(event.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(event.date).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tracker;
