import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Filter, Grid, List, ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

type APIRawProduct = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
};

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

const ITEMS_PER_PAGE = 12;

const Products: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  // read search query from url
  const searchQueryRaw = useMemo(() => {
    try {
      const params = new URLSearchParams(location.search);
      return params.get("search") ?? "";
    } catch {
      return "";
    }
  }, [location.search]);

  const searchQuery = searchQueryRaw.toLowerCase().trim();

  // Fetch products from Fake Store API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("https://fakestoreapi.com/products");
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      const data: APIRawProduct[] = await res.json();

      const mapped: Product[] = data.map((p) => ({
        id: String(p.id),
        name: p.title,
        price: typeof p.price === "number" ? p.price : Number(p.price) || 0,
        originalPrice: undefined,
        rating: p.rating?.rate ?? 0,
        reviews: p.rating?.count ?? 0,
        image: p.image,
        category: p.category,
      }));

      setAllProducts(mapped);
    } catch (err: any) {
      setError(err?.message ?? "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset page when search changes or products change
  useEffect(() => {
    setPage(1);
  }, [searchQueryRaw, sortBy, itemsPerPage]);

  // Simple filtering by search query (case-insensitive substring)
  const filteredProducts = useMemo(() => {
    if (!searchQuery) return allProducts;
    return allProducts.filter((p) =>
      p.name.toLowerCase().includes(searchQuery),
    );
  }, [allProducts, searchQuery]);

  // Sorting
  const sortedProducts = useMemo(() => {
    const copy = [...filteredProducts];
    switch (sortBy) {
      case "price-low":
        copy.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        copy.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        copy.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        // Fake Store doesn't provide created date; use id as proxy (higher id -> newer)
        copy.sort((a, b) => Number(b.id) - Number(a.id));
        break;
      case "featured":
      default:
        // keep API order (or fallback to name)
        copy.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return copy;
  }, [filteredProducts, sortBy]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(sortedProducts.length / itemsPerPage),
  );
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginated = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, page, itemsPerPage]);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const goToPage = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));

  // helper to render page buttons with small window and ellipsis
  const visiblePageNumbers = useMemo(() => {
    const maxButtons = 7;
    const pages: (number | "...")[] = [];
    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    const left = Math.max(1, page - 2);
    const right = Math.min(totalPages, page + 2);

    if (left > 1) {
      pages.push(1);
      if (left > 2) pages.push("...");
    }

    for (let i = left; i <= right; i++) pages.push(i);

    if (right < totalPages) {
      if (right < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  }, [page, totalPages]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
          <div className="flex items-center space-x-4">
            {/* Items per page */}
            <div className="relative">
              <select
                value={String(itemsPerPage)}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="8">8 per page</option>
                <option value="12">12 per page</option>
                <option value="24">24 per page</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                aria-pressed={viewMode === "grid"}
                title="Grid view"
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                aria-pressed={viewMode === "list"}
                title="List view"
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="w-64 bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                <p className="text-sm text-gray-600">
                  Filtering by category is not yet wired in this demo.
                </p>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Rating</h4>
                <p className="text-sm text-gray-600">
                  Use the sort menu to prioritize highest rated items.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <p className="text-sm text-gray-600">
                  Use the sort menu for price ordering or change items per page.
                </p>
              </div>
            </aside>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {searchQueryRaw && (
              <div className="mb-4 text-sm text-gray-600">
                Showing results for{" "}
                <span className="font-medium text-gray-900">
                  "{decodeURIComponent(searchQueryRaw)}"
                </span>
              </div>
            )}

            {loading ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: Math.min(8, itemsPerPage) }).map(
                  (_, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-lg shadow-sm border p-4 animate-fade-in"
                    >
                      <div className="bg-gray-100 h-40 w-full rounded mb-4" />
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                      <div className="h-8 bg-gray-200 rounded w-full mt-4" />
                    </div>
                  ),
                )}
              </div>
            ) : error ? (
              <div className="text-center py-20 text-red-600">
                Failed to load products: {error}
              </div>
            ) : (
              <>
                <div
                  className={`grid gap-6 ${
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1"
                  }`}
                >
                  {paginated.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>

                {sortedProducts.length === 0 && (
                  <div className="text-center py-20 text-gray-600">
                    No products found for your search.
                  </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between mt-12">
                  <div className="text-sm text-gray-600">
                    Showing{" "}
                    {sortedProducts.length === 0
                      ? 0
                      : (page - 1) * itemsPerPage + 1}{" "}
                    - {Math.min(page * itemsPerPage, sortedProducts.length)} of{" "}
                    {sortedProducts.length} results
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handlePrev}
                      disabled={page === 1}
                      className={`px-3 py-2 rounded-lg transition-colors ${page === 1 ? "text-gray-400 border border-gray-200" : "border border-gray-300 hover:bg-gray-50"}`}
                    >
                      Previous
                    </button>

                    <div className="flex items-center space-x-1">
                      {visiblePageNumbers.map((p, idx) =>
                        p === "..." ? (
                          <span
                            key={`dot-${idx}`}
                            className="px-2 text-gray-500"
                          >
                            …
                          </span>
                        ) : (
                          <button
                            key={p}
                            onClick={() => goToPage(p as number)}
                            className={`px-3 py-2 rounded-lg transition-colors ${p === page ? "bg-blue-600 text-white" : "border border-gray-300 hover:bg-gray-50"}`}
                            aria-current={p === page ? "page" : undefined}
                          >
                            {p}
                          </button>
                        ),
                      )}
                    </div>

                    <button
                      onClick={handleNext}
                      disabled={page === totalPages}
                      className={`px-3 py-2 rounded-lg transition-colors ${page === totalPages ? "text-gray-400 border border-gray-200" : "border border-gray-300 hover:bg-gray-50"}`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;
