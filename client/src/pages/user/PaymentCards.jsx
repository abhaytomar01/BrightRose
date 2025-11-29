import { useEffect, useState } from "react";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { toast } from "react-toastify";
import { Plus, Trash2, CreditCard, Edit2, X } from "lucide-react";

const PaymentCards = () => {
  const { authUser } = useAuth();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [form, setForm] = useState({
    cardholder: "",
    cardNumber: "",
    expiry: "",
    type: "",
  });

  // --------------------------------------------
  // Fetch saved cards
  // --------------------------------------------
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/user/cards`,
          { headers: { Authorization: `Bearer ${authUser.token}` } }
        );
        setCards(res.data.cards || []);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };

    fetchCards();
  }, []);

  const openModal = (index = null) => {
    if (index !== null) {
      setEditingIndex(index);
      setForm(cards[index]);
    } else {
      setEditingIndex(null);
      setForm({
        cardholder: "",
        cardNumber: "",
        expiry: "",
        type: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // --------------------------------------------
  // Save or Edit Card
  // --------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (form.cardNumber.replace(/\s/g, "").length !== 16) {
      toast.error("Card number must be 16 digits");
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) {
      toast.error("Expiry must be in MM/YY format");
      return;
    }

    let updatedCards = [...cards];

    if (editingIndex !== null) {
      updatedCards[editingIndex] = form;
    } else {
      if (cards.length >= 5) {
        toast.error("You can save up to 5 cards only");
        return;
      }
      updatedCards.push(form);
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/user/update-cards`,
        { cards: updatedCards },
        { headers: { Authorization: `Bearer ${authUser.token}` } }
      );

      setCards(res.data.cards);
      toast.success("Card saved successfully");
      closeModal();
    } catch (err) {
      console.log(err);
      toast.error("Failed to save card");
    }
  };

  // --------------------------------------------
  // Delete Card
  // --------------------------------------------
  const deleteCard = async (index) => {
    try {
      const updated = cards.filter((_, i) => i !== index);

      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/v1/user/update-cards`,
        { cards: updated },
        { headers: { Authorization: `Bearer ${authUser.token}` } }
      );

      setCards(res.data.cards);
      toast.success("Card removed");
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete card");
    }
  };

  // --------------------------------------------
  // UI
  // --------------------------------------------

  if (loading) return <p className="p-6">Loading cards...</p>;

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-light tracking-wide">Saved Cards</h2>

        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 border border-black rounded-full hover:bg-black hover:text-white transition"
        >
          <Plus size={18} /> Add Card
        </button>
      </div>

      {/* Card List */}
      {cards.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-xl shadow text-gray-500">
          No saved cards found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="p-5 border rounded-xl shadow-sm bg-gradient-to-br from-gray-50 to-white"
            >
              {/* Top row */}
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 text-gray-800 font-medium">
                  <CreditCard size={20} /> {card.type || "Card"}
                </div>

                <div className="flex gap-3">
                  <Edit2
                    size={18}
                    className="cursor-pointer hover:text-blue-600"
                    onClick={() => openModal(index)}
                  />

                  <Trash2
                    size={18}
                    className="cursor-pointer hover:text-red-600"
                    onClick={() => deleteCard(index)}
                  />
                </div>
              </div>

              {/* Card Number */}
              <p className="tracking-wider text-lg font-semibold">
                **** **** **** {card.cardNumber.slice(-4)}
              </p>

              <p className="mt-2 text-sm text-gray-700">{card.cardholder}</p>
              <p className="text-sm text-gray-500">Exp: {card.expiry}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[999]">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">

            <button
              onClick={closeModal}
              className="absolute top-4 right-4"
            >
              <X size={22} />
            </button>

            <h2 className="text-lg font-semibold mb-4">
              {editingIndex !== null ? "Edit Card" : "Add Card"}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>

              <input
                type="text"
                placeholder="Cardholder Name"
                required
                value={form.cardholder}
                onChange={(e) =>
                  setForm({ ...form, cardholder: e.target.value })
                }
                className="w-full border p-3 rounded-md"
              />

              <input
                type="text"
                placeholder="Card Number (16 digits)"
                value={form.cardNumber}
                maxLength="19"
                required
                onChange={(e) => {
                  const formatted = e.target.value
                    .replace(/\D/g, "")
                    .match(/.{1,4}/g)
                    ?.join(" ") || "";
                  setForm({ ...form, cardNumber: formatted });
                }}
                className="w-full border p-3 rounded-md"
              />

              <input
                type="text"
                placeholder="Expiry (MM/YY)"
                value={form.expiry}
                required
                maxLength="5"
                onChange={(e) =>
                  setForm({
                    ...form,
                    expiry: e.target.value.replace(/[^0-9/]/g, ""),
                  })
                }
                className="w-full border p-3 rounded-md"
              />

              <input
                type="text"
                placeholder="Card Type (e.g., VISA, MasterCard)"
                value={form.type}
                required
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value })
                }
                className="w-full border p-3 rounded-md"
              />

              <button className="w-full py-3 bg-black text-white rounded-md tracking-wide hover:opacity-90 transition">
                Save Card
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PaymentCards;
