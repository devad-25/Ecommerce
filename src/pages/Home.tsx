import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, Shield, Headphones } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import CategoryCard from "../components/CategoryCard";
import FeaturedCarousel from "./FeaturedCarousel";
import type { Product, Category } from "../shared/types";

type APIRawProduct = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: { rate: number; count: number };
};

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [featuredError, setFeaturedError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Fetch featured products
    const fetchFeatured = async () => {
      setLoadingFeatured(true);
      setFeaturedError(null);
      try {
        const res = await fetch("https://fakestoreapi.com/products");
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data: APIRawProduct[] = await res.json();

        // Map API data to Product type
        const mapped: Product[] = data.map((p) => {
          const price = Number(p.price) || 0;
          const originalPrice = Math.round(price * 1.2 * 100) / 100; // +20%
          const discount =
            originalPrice > price
              ? Math.round(((originalPrice - price) / originalPrice) * 100)
              : 0;

          return {
            id: String(p.id), // <--- convert id to string
            name: p.title || "Unknown Product",
            price,
            originalPrice: originalPrice > price ? originalPrice : undefined,
            discount: discount > 0 ? discount : undefined,
            rating: p.rating?.rate ?? 0,
            reviews: p.rating?.count ?? 0,
            image: p.image || "/placeholder.png",
            category: p.category || "Misc",
          };
        });

        // Pick top 6 rated products
        const topRated = mapped
          .slice()
          .sort((a, b) => b.rating - a.rating || Number(b.id) - Number(a.id))
          .slice(0, 6);

        if (mounted) setFeaturedProducts(topRated);
      } catch (err: any) {
        if (mounted)
          setFeaturedError(err?.message || "Failed to load featured products");
      } finally {
        if (mounted) setLoadingFeatured(false);
      }
    };

    // Fetch categories
    const fetchCategories = async () => {
      setLoadingCategories(true);
      setCategoriesError(null);

      try {
        const res = await fetch("https://fakestoreapi.com/products/categories");
        if (!res.ok) throw new Error(`API error: ${res.status}`);

        const categoryNames: string[] = await res.json();

        const categoriesWithImages: Category[] = await Promise.all(
          categoryNames.map(async (cat) => {
            // Fetch 1 product from this category
            const prodRes = await fetch(
              `https://fakestoreapi.com/products/category/${encodeURIComponent(cat)}`,
            );

            const products: APIRawProduct[] = await prodRes.json();

            const image =
              products.length > 0
                ? products[0].image // ✔ Use the actual product image
                : "/placeholder-category.jpg";

            return {
              id: cat.toLowerCase().replace(/\s+/g, "-"),
              name: cat.charAt(0).toUpperCase() + cat.slice(1),
              image,
              productCount: products.length,
            };
          }),
        );

        setCategories(categoriesWithImages);
      } catch (err: any) {
        setCategoriesError(err?.message || "Failed to load categories");
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchFeatured();
    fetchCategories();

    return () => {
      mounted = false;
    };
  }, []);

  const heroPrimary = useMemo(
    () => ({
      title: "Shop Everything You Need",
      subtitle: "Discover millions of products at unbeatable prices",
    }),
    [],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {heroPrimary.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-2xl mx-auto">
              {heroPrimary.subtitle}
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow"
            >
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on orders over $50</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-600">Your payment information is safe</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Headphones className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Get help whenever you need it</p>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Shop by Category
              </h2>
              <p className="text-lg text-gray-600">
                Find what you're looking for
              </p>
            </div>

            {loadingCategories ? (
              <p className="text-center py-10">Loading categories...</p>
            ) : categoriesError ? (
              <p className="text-center py-10 text-red-600">
                {categoriesError}
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categories.map((category) => (
                  <CategoryCard key={category.id} {...category} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-1">
                  Featured Products
                </h2>
                <p className="text-lg text-gray-600">
                  Handpicked items just for you
                </p>
              </div>
              <Link
                to="/products"
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                View All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {loadingFeatured ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="h-56 bg-gray-100 rounded-lg shadow-sm border p-4"
                  />
                ))}
              </div>
            ) : featuredProducts.length === 0 ? (
              <p className="text-center py-10 text-gray-600">
                No featured products available.
              </p>
            ) : (
              <FeaturedCarousel products={featuredProducts} />
            )}
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-16 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg text-gray-300 mb-8">
              Get the latest deals and offers
            </p>
            <div className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-r-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
