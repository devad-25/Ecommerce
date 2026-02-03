import React from 'react';
import { Package, Truck, CheckCircle } from 'lucide-react';

interface OrderCardProps {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered';
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
}

const OrderCard: React.FC<OrderCardProps> = ({ id, date, status, total, items }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-orange-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'processing':
        return 'text-blue-600 bg-blue-50';
      case 'shipped':
        return 'text-orange-600 bg-orange-50';
      case 'delivered':
        return 'text-green-600 bg-green-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">Order #{id}</h3>
          <p className="text-sm text-gray-600">Placed on {date}</p>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="text-sm font-medium capitalize">{status}</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 object-cover rounded-lg"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold text-gray-900">${item.price}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <span className="font-semibold text-lg">Total: ${total}</span>
        <div className="space-x-2">
          <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            Track Order
          </button>
          {status === 'delivered' && (
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Reorder
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;