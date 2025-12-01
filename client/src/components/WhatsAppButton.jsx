import React from "react";
import whatsappIcon from "../assets/images/whatsapp.png";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/919910929099"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-[9999]"
    >
      <img
        src={whatsappIcon}
        alt="WhatsApp"
        className="w-12 h-12 shadow-lg"
      />
    </a>
  );
}
