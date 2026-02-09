import React from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, X, ShoppingCart, Heart } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, message }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const isCart = message.toLowerCase().includes("buy");
  const Icon = isCart ? ShoppingCart : Heart;

  const handleLogin = () => {
    onClose();
    navigate("/login", { state: { from: window.location.pathname } });
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 max-w-sm w-full mx-4 p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isCart
                ? "bg-blue-100 dark:bg-blue-900/30"
                : "bg-red-100 dark:bg-red-900/30"
            }`}
          >
            <Icon
              className={`h-7 w-7 ${
                isCart
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-red-500 dark:text-red-400"
              }`}
            />
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {message}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Please login to continue shopping.
          </p>

          <div className="space-y-3">
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <LogIn className="h-5 w-5" />
              Go to Login
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
