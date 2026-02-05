import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  price,
  quantity,
  image,
  onUpdateQuantity,
  onRemove,
}) => {
  return (
    <div className="flex items-center space-x-4 py-4 border-b">
      <img
        src={image}
        alt={name}
        className="w-16 h-16 object-contain bg-white p-1 rounded-lg"
      />

      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{name}</h3>
        <p className="text-lg font-semibold text-gray-900">${price}</p>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onUpdateQuantity(id, Math.max(1, quantity - 1))}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-8 text-center font-medium">{quantity}</span>
        <button
          onClick={() => onUpdateQuantity(id, quantity + 1)}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="text-right">
        <p className="font-semibold text-gray-900">
          ${(price * quantity).toFixed(2)}
        </p>
        <button
          onClick={() => onRemove(id)}
          className="text-red-500 hover:text-red-700 transition-colors mt-1"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
