import React, { useState } from "react";
import ProductCard from "../components/ProductCard";

type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  discount?: number;
  category?: string;
};

type Props = {
  products: Product[];
  itemsPerPage?: number; // optional, default 3
};

const FeaturedCarousel: React.FC<Props> = ({ products, itemsPerPage = 3 }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const totalSlides = Math.ceil(products.length / itemsPerPage);

  const handleDotClick = (index: number) => setActiveIndex(index);

  const visibleProducts = products.slice(
    activeIndex * itemsPerPage,
    activeIndex * itemsPerPage + itemsPerPage,
  );

  return (
    <div className="flex flex-col items-center">
      {/* Product Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {visibleProducts.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>

      {/* Dots Navigation */}
      <div className="flex mt-6 space-x-2">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleDotClick(idx)}
            className={`w-3 h-3 rounded-full transition-colors ${
              idx === activeIndex ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedCarousel;
