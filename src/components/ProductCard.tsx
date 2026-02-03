import React from "react";
import { Link } from "react-router-dom";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { useCart } from "../context/cartcontext";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  discount?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  rating,
  reviews,
  image,
  discount,
}) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const inWishlist = isInWishlist(id);

  const handleAddToCart = () => {
    addToCart({ id, name, price, image }, 1);
  };

  const handleToggleWishlist = () => {
    toggleWishlist({ id, name, price, image });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 hover:shadow-md transition-shadow duration-200 group">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        />

        {discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
            {discount}% OFF
          </div>
        )}

        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 p-2 bg-white dark:bg-gray-700 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity ${
            inWishlist ? "ring-2 ring-red-300" : ""
          }`}
        >
          <Heart
            className={`h-4 w-4 ${
              inWishlist ? "text-red-500" : "text-gray-700 dark:text-gray-300"
            }`}
          />
        </button>
      </div>

      <div className="p-4">
        <Link to={`/product/${id}`}>
          <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2">{name}</h3>
        </Link>

        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(rating)
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300 dark:text-gray-600"
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">({reviews})</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold dark:text-white">${price}</span>
          {originalPrice && (
            <span className="text-sm line-through text-gray-500 dark:text-gray-400">
              ${originalPrice}
            </span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
