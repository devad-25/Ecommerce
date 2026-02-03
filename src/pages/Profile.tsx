import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Package,
  MapPin,
  CreditCard,
  Heart,
  Bell,
  Shield,
  Gift,
  HelpCircle,
  ChevronRight,
  Star,
  Settings,
  LogOut,
  Edit2,
  Camera,
  Phone,
  Mail,
  Calendar,
  Award,
  Truck,
  RotateCcw,
  MessageSquare,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/cartcontext";

const Profile = () => {
  const { wishlistItems, cartItems } = useCart();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock user data - in real app, this would come from auth context
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    memberSince: "January 2024",
    isPrime: true,
  };

  // Mock stats
  const stats = {
    totalOrders: 12,
    totalSpent: 1247.89,
    pendingOrders: 2,
    reviews: 8,
    coupons: 3,
    rewardPoints: 450,
  };

  // Mock recent orders
  const recentOrders = [
    {
      id: "ORD-2026-003",
      date: "January 22, 2026",
      status: "processing",
      total: 39.98,
      image: "https://images.unsplash.com/photo-1601593346740-925612772716?w=100&h=100&fit=crop",
      itemName: "Smartphone Case",
    },
    {
      id: "ORD-2026-002",
      date: "January 20, 2026",
      status: "shipped",
      total: 149.98,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop",
      itemName: "Laptop Backpack",
    },
    {
      id: "ORD-2026-001",
      date: "January 15, 2026",
      status: "delivered",
      total: 309.97,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
      itemName: "Wireless Headphones",
    },
  ];

  // Account menu sections (like Amazon's Your Account page)
  const accountSections = [
    {
      title: "Your Orders",
      description: "Track, return, or buy things again",
      icon: Package,
      link: "/orders",
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Login & Security",
      description: "Edit login, name, and mobile number",
      icon: Shield,
      link: "/account",
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Your Addresses",
      description: "Edit addresses for orders and gifts",
      icon: MapPin,
      link: "/account",
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Payment Options",
      description: "Edit or add payment methods",
      icon: CreditCard,
      link: "/account",
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Your Wishlist",
      description: "View and manage your saved items",
      icon: Heart,
      link: "/wishlist",
      color: "bg-red-100 text-red-600",
    },
    {
      title: "Gift Cards & Balance",
      description: "View balance or redeem a card",
      icon: Gift,
      link: "#",
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "shipped":
        return "Shipped";
      case "processing":
        return "Processing";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 md:p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <button className="absolute bottom-0 right-0 bg-white text-blue-600 p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
                {user.isPrime && (
                  <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                    PRIME
                  </span>
                )}
              </div>
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-blue-100 mb-4">
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </span>
                <span className="hidden md:block">|</span>
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {user.phone}
                </span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-blue-100">
                <Calendar className="h-4 w-4" />
                <span>Member since {user.memberSince}</span>
              </div>
            </div>

            {/* Edit Profile Button */}
            <Link
              to="/account"
              className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              Edit Profile
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-blue-500/30">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold">{stats.totalOrders}</div>
              <div className="text-blue-200 text-sm">Total Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold">${stats.totalSpent.toFixed(0)}</div>
              <div className="text-blue-200 text-sm">Total Spent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold">{wishlistItems.length}</div>
              <div className="text-blue-200 text-sm">Wishlist Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold">{stats.rewardPoints}</div>
              <div className="text-blue-200 text-sm">Reward Points</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Account Sections Grid (Amazon-style) */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Account</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accountSections.map((section) => (
                  <Link
                    key={section.title}
                    to={section.link}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-4 hover:shadow-md transition-shadow flex items-start gap-4 group"
                  >
                    <div className={`p-3 rounded-lg ${section.color}`}>
                      <section.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {section.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{section.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Orders</h2>
                <Link
                  to="/orders"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <img
                      src={order.image}
                      alt={order.itemName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">{order.itemName}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{order.id}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                      <p className="font-semibold text-gray-900 dark:text-white mt-1">${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {recentOrders.length === 0 && (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">No orders yet</p>
                  <Link
                    to="/products"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium mt-2 inline-block"
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>

            {/* Help & Support Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Need Help?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                  <Truck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Track Order</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Check delivery status</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                  <RotateCcw className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Returns</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Easy 30-day returns</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
                  <MessageSquare className="h-8 w-8 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Contact Us</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">24/7 customer support</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Rewards Card */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-sm p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Award className="h-8 w-8" />
                <h3 className="text-lg font-semibold">EcomStore Rewards</h3>
              </div>
              <div className="mb-4">
                <p className="text-3xl font-bold">{stats.rewardPoints}</p>
                <p className="text-yellow-100">Available Points</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3 mb-4">
                <p className="text-sm">
                  Earn 1 point for every $1 spent. Redeem 100 points for $5 off!
                </p>
              </div>
              <button className="w-full bg-white text-orange-600 py-2 rounded-lg font-medium hover:bg-yellow-50 transition-colors">
                Redeem Points
              </button>
            </div>

            {/* Coupons */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Coupons</h3>
                <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-1 rounded">
                  {stats.coupons} Available
                </span>
              </div>
              <div className="space-y-3">
                <div className="border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg p-3 bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-blue-600 dark:text-blue-400">SAVE10</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">10% off on orders above $50</p>
                    </div>
                    <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-300">
                      Copy
                    </button>
                  </div>
                </div>
                <div className="border-2 border-dashed border-green-300 dark:border-green-600 rounded-lg p-3 bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-green-600 dark:text-green-400">FREESHIP</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Free shipping on all orders</p>
                    </div>
                    <button className="text-green-600 dark:text-green-400 text-sm font-medium hover:text-green-700 dark:hover:text-green-300">
                      Copy
                    </button>
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-300">
                View All Coupons
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  to="/orders"
                  className="w-full flex items-center px-3 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Package className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                  <span className="flex-1">Your Orders</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
                <Link
                  to="/wishlist"
                  className="w-full flex items-center px-3 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Heart className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                  <span className="flex-1">Wishlist</span>
                  {wishlistItems.length > 0 && (
                    <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium px-2 py-0.5 rounded-full mr-2">
                      {wishlistItems.length}
                    </span>
                  )}
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
                <Link
                  to="/cart"
                  className="w-full flex items-center px-3 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <CreditCard className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                  <span className="flex-1">Cart</span>
                  {cartItems.length > 0 && (
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium px-2 py-0.5 rounded-full mr-2">
                      {cartItems.length}
                    </span>
                  )}
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
                <button className="w-full flex items-center px-3 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Bell className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                  <span className="flex-1">Notifications</span>
                  <span className="bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full mr-2">
                    3
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
                <Link
                  to="/account"
                  className="w-full flex items-center px-3 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Settings className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                  <span className="flex-1">Account Settings</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
                <button className="w-full flex items-center px-3 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <HelpCircle className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
                  <span className="flex-1">Help & Support</span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
                <hr className="my-2 dark:border-gray-700" />
                <button className="w-full flex items-center px-3 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                  <LogOut className="h-5 w-5 mr-3" />
                  <span className="flex-1">Sign Out</span>
                </button>
              </div>
            </div>

            {/* Recently Viewed */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recently Viewed</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[
                  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop",
                  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop",
                  "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=80&h=80&fit=crop",
                  "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=80&h=80&fit=crop",
                ].map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Recently viewed ${index + 1}`}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
              </div>
              <Link
                to="/products"
                className="block mt-3 text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-300"
              >
                Browse More Products
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
