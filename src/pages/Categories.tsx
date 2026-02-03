import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CategoryCard from "../components/CategoryCard";

type Category = {
  id: string;
  name: string;
  image: string;
  productCount: number;
};

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryImages: Record<string, string> = {
    electronics:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=200&fit=crop",
    jewelery:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=200&fit=crop",
    "men's clothing":
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop",
    "women's clothing":
      "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=400&h=200&fit=crop",
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await fetch("https://fakestoreapi.com/products/categories");
      const categoryList: string[] = await res.json(); // type the array

      const categoriesWithCounts: Category[] = await Promise.all(
        categoryList.map(async (cat) => {
          const res2 = await fetch(
            `https://fakestoreapi.com/products/category/${encodeURIComponent(
              cat,
            )}`,
          );
          const items = await res2.json();

          return {
            id: cat.toLowerCase().replace(/\s+/g, "-"),
            name: cat.charAt(0).toUpperCase() + cat.slice(1),
            image: categoryImages[cat] || categoryImages["electronics"],
            productCount: items.length,
          };
        }),
      );

      setCategories(categoriesWithCounts);
    } catch (err: any) {
      setError(err.message ?? "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Shop by Category
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Explore our wide range of product categories
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm p-4 animate-pulse"
              >
                <div className="bg-gray-200 dark:bg-gray-700 h-32 rounded mb-4" />
                <div className="bg-gray-200 dark:bg-gray-700 h-4 w-2/3 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-600 dark:text-red-400 py-12">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} {...category} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Categories;
