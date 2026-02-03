import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import OrderCard from '../components/OrderCard';

const Orders = () => {
  const orders = [
    {
      id: 'ORD-2026-001',
      date: 'January 15, 2026',
      status: 'delivered' as const,
      total: 309.97,
      items: [
        {
          name: 'Wireless Bluetooth Headphones',
          quantity: 1,
          price: 79.99,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'
        },
        {
          name: 'Smart Fitness Watch',
          quantity: 1,
          price: 199.99,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop'
        },
        {
          name: 'Wireless Charging Pad',
          quantity: 1,
          price: 29.99,
          image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop'
        }
      ]
    },
    {
      id: 'ORD-2026-002',
      date: 'January 20, 2026',
      status: 'shipped' as const,
      total: 149.98,
      items: [
        {
          name: 'Laptop Backpack',
          quantity: 1,
          price: 49.99,
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop'
        },
        {
          name: 'Bluetooth Speaker',
          quantity: 1,
          price: 89.99,
          image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop'
        }
      ]
    },
    {
      id: 'ORD-2026-003',
      date: 'January 22, 2026',
      status: 'processing' as const,
      total: 39.98,
      items: [
        {
          name: 'Smartphone Case',
          quantity: 2,
          price: 19.99,
          image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=400&h=300&fit=crop'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your Orders</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Track and manage your orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl text-gray-400">📦</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">No orders yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Start shopping to see your orders here</p>
            <a
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard key={order.id} {...order} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Orders;