const PaymentCards = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Saved Cards</h2>
      <div className="bg-gray-50 rounded-lg shadow p-6">
        <p className="text-gray-500">No saved payment cards found.</p>
      </div>
    </div>
  );
};

export default PaymentCards;
