import React, { useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";

const Modal = ({ isOpen, onClose, children, size }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-[10000] px-3">
      <div
        className={`bg-[#1c1c1c] rounded-lg w-full shadow-xl border border-gray-700 ${size}`}
      >
        <div className="p-4 text-white overflow-y-auto max-h-[80vh] relative">
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-400 hover:text-white focus:outline-none absolute right-4 top-3 z-[2]"
          >
            <IoCloseSharp size={24} />
          </button>

          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
