import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ id, name, image, productCount }) => {
  return (
    <Link
      to={`/category/${id}`}
      className="group block bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
    >
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={image}
          alt={name}
          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>
        <p className="text-sm text-gray-600">{productCount} products</p>
      </div>
    </Link>
  );
};

export default CategoryCard;