// src/components/SitePrivacyNotice.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "br_cookie_consent_v1";
const SHOW_DELAY_MS = 3500; // 2.5s after page load

const SitePrivacyNotice = () => {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) return; // already accepted / set once

      const timer = setTimeout(() => {
        setVisible(true);
      }, SHOW_DELAY_MS);

      return () => clearTimeout(timer);
    } catch {
      const timer = setTimeout(() => {
        setVisible(true);
      }, SHOW_DELAY_MS);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveChoice = (value) => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ value, timestamp: Date.now() })
      );
    } catch {}
  };

  const handleAcceptAll = () => {
    saveChoice("accepted_all");
    setVisible(false);
  };

  const handleMoreOptions = () => {
    setExpanded((prev) => !prev);
  };

  if (!visible) return null;

  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="w-11/12 max-w-md rounded-2xl bg-white [box-shadow:rgba(60,64,67,0.3)_0_1px_2px_0,rgba(60,64,67,0.15)_0_2px_6px_2px] animate-fadeIn">
      <div className="flex flex-col items-center justify-between pt-9 px-6 pb-6 relative">
          {/* SVG icon, text, options, buttons exactly as before */}
          {/* ... keep the content you already have ... */}

          {/* Example: title */}
          <h5 className="text-sm font-semibold mb-2 text-left mr-auto text-zinc-700">
            Your privacy is important to us
          </h5>

          {/* Example: text + link */}
          <p className="w-full mb-4 text-sm text-justify text-zinc-700">
            We process your personal information to measure and improve our site
            and services, to assist our campaigns and to provide personalised
            content.
            <br />
            For more information see our{" "}
            <Link
              to="/privacy"
              className="text-sm cursor-pointer font-semibold transition-colors hover:text-[#634647] underline underline-offset-2"
            >
              Privacy Policy
            </Link>
            .
          </p>

          {/* Optional expanded block */}
          {expanded && (
            <div className="w-full mb-3 text-xs text-left text-zinc-600 space-y-2">
              <p>
                Necessary cookies are always on. Analytics and marketing cookies
                help us improve your experience.
              </p>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    disabled
                    className="accent-[#634647]"
                  />
                  <span>Necessary</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="accent-[#634647]"
                    onChange={() => {}}
                  />
                  <span>Analytics & Marketing</span>
                </label>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleMoreOptions}
            className="mb-2 text-sm mr-auto text-zinc-600 cursor-pointer font-semibold transition-colors hover:text-[#634647] hover:underline underline-offset-2"
          >
            {expanded ? "Hide options" : "More options"}
          </button>

          <button
            type="button"
            onClick={handleAcceptAll}
            className="absolute font-semibold right-6 bottom-6 cursor-pointer py-2 px-8 w-max break-keep text-sm rounded-lg transition-colors text-[#634647] hover:text-[#ddad81] bg-[#ddad81] hover:bg-[#634647]"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default SitePrivacyNotice;
