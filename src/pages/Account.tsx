import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, MapPin, CreditCard, Bell, Shield, LogOut, X, Trash2, Eye, EyeOff,
  Lock, Mail, Smartphone, Download, ChevronRight, Package, Clock,
  AlertTriangle, Tag, ShoppingCart, Heart, Settings, HelpCircle,
  Camera, Phone, Calendar, Edit2, Award, RotateCcw,
  Truck, FileText, Percent, XCircle, Info
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../context/cartcontext';
import { toast } from 'react-toastify';

type TabType = 'overview' | 'notifications' | 'privacy';

type Notification = {
  id: number;
  type: 'order' | 'promo' | 'security' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
};

type NotificationFilter = 'all' | 'order' | 'promo' | 'security' | 'system';

const initialNotifications: Notification[] = [
  { id: 1, type: 'order', title: 'Order Shipped', message: 'Your order #ORD-2024-1234 has been shipped via FedEx. Expected delivery by Feb 8.', time: '2 hours ago', read: false },
  { id: 2, type: 'promo', title: 'Flash Sale - 30% Off!', message: 'Exclusive flash sale on electronics & gadgets. Use code FLASH30 at checkout. Valid till midnight!', time: '5 hours ago', read: false },
  { id: 3, type: 'security', title: 'New Login Detected', message: 'A new login was detected from Chrome on Windows 11 in New York, US. If this wasn\'t you, secure your account immediately.', time: '1 day ago', read: false },
  { id: 4, type: 'order', title: 'Order Delivered', message: 'Your order #ORD-2024-1198 containing "Wireless Headphones" has been delivered successfully.', time: '2 days ago', read: true },
  { id: 5, type: 'system', title: 'Profile Updated', message: 'Your account profile information was updated. If you didn\'t make this change, please contact support.', time: '3 days ago', read: true },
  { id: 6, type: 'promo', title: 'New Arrivals Just Dropped', message: 'Fresh styles are here! Check out 200+ new products added to our store this week.', time: '4 days ago', read: true },
  { id: 7, type: 'order', title: 'Refund Processed', message: 'Your refund of $29.99 for order #ORD-2024-1150 has been processed. It will reflect in 3-5 business days.', time: '5 days ago', read: true },
  { id: 8, type: 'security', title: 'Password Changed', message: 'Your account password was changed successfully. If you didn\'t make this change, reset your password now.', time: '1 week ago', read: true },
];

const notificationIcon = (type: string) => {
  switch (type) {
    case 'order': return <Package className="h-5 w-5 text-blue-500" />;
    case 'promo': return <Tag className="h-5 w-5 text-green-500" />;
    case 'security': return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    case 'system': return <Settings className="h-5 w-5 text-purple-500" />;
    default: return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

const Account = () => {
  const navigate = useNavigate();
  const { wishlistItems, cartItems } = useCart();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [notificationFilter, setNotificationFilter] = useState<NotificationFilter>('all');

  const [privacySettings, setPrivacySettings] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    profileVisibility: 'private' as 'public' | 'private',
    dataSharing: false,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    orderUpdates: true,
    promoAlerts: true,
    personalizedAds: false,
    activityStatus: true,
  });

  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    memberSince: 'January 2024',
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = notificationFilter === 'all'
    ? notifications
    : notifications.filter(n => n.type === notificationFilter);

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification removed');
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  const togglePrivacySetting = (key: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Preference updated successfully');
  };

  const handleSignOut = () => {
    toast.info('You have been signed out');
    navigate('/');
  };

  const handleDownloadData = () => {
    toast.info('Preparing your data download...');
    setTimeout(() => toast.success('Your data export is ready!'), 2000);
  };

  const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
        enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  // Quick action cards (Amazon-style grid)
  const quickActions = [
    { title: 'Your Orders', desc: 'Track, return, or buy things again', icon: Package, link: '/orders', color: 'from-blue-500 to-blue-600', badge: '2 active' },
    { title: 'Your Wishlist', desc: 'Items you\'ve saved for later', icon: Heart, link: '/wishlist', color: 'from-pink-500 to-rose-600', badge: wishlistItems.length > 0 ? `${wishlistItems.length} items` : undefined },
    { title: 'Your Cart', desc: 'Review items in your cart', icon: ShoppingCart, link: '/cart', color: 'from-orange-500 to-orange-600', badge: cartItems.length > 0 ? `${cartItems.length} items` : undefined },
    { title: 'Your Addresses', desc: 'Edit or add delivery addresses', icon: MapPin, link: '#', color: 'from-green-500 to-emerald-600' },
    { title: 'Payment Methods', desc: 'Manage cards & UPI', icon: CreditCard, link: '#', color: 'from-purple-500 to-purple-600' },
    { title: 'Coupons & Offers', desc: 'Available discounts for you', icon: Percent, link: '#', color: 'from-yellow-500 to-amber-600', badge: '3 new' },
    { title: 'Returns & Refunds', desc: 'Check refund status or return items', icon: RotateCcw, link: '#', color: 'from-teal-500 to-teal-600' },
    { title: 'Help & Support', desc: '24/7 customer service', icon: HelpCircle, link: '#', color: 'from-indigo-500 to-indigo-600' },
  ];

  const notificationFilterTabs: { key: NotificationFilter; label: string; icon: typeof Bell }[] = [
    { key: 'all', label: 'All', icon: Bell },
    { key: 'order', label: 'Orders', icon: Package },
    { key: 'promo', label: 'Offers', icon: Tag },
    { key: 'security', label: 'Alerts', icon: AlertTriangle },
    { key: 'system', label: 'Updates', icon: Info },
  ];

  const getFilterCount = (filter: NotificationFilter) => {
    if (filter === 'all') return notifications.filter(n => !n.read).length;
    return notifications.filter(n => n.type === filter && !n.read).length;
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gray-900 dark:text-white font-medium">My Account</span>
        </nav>

        {/* Profile Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-6 py-8">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full border-3 border-white shadow-lg object-cover"
                />
                <button className="absolute -bottom-1 -right-1 bg-white text-blue-600 p-1.5 rounded-full shadow-md hover:bg-gray-50 transition-colors">
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex-1 text-center sm:text-left text-white">
                <h1 className="text-xl font-bold mb-1">{user.name}</h1>
                <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4 text-blue-100 text-sm">
                  <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{user.email}</span>
                  <span className="hidden sm:block">|</span>
                  <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{user.phone}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-blue-200 text-xs mt-2">
                  <Calendar className="h-3 w-3" />
                  <span>Member since {user.memberSince}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('overview')}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors border border-white/20"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b dark:border-gray-700 overflow-x-auto">
            {([
              { key: 'overview' as TabType, label: 'Overview', icon: User },
              { key: 'notifications' as TabType, label: 'Notifications', icon: Bell, badge: unreadCount },
              { key: 'privacy' as TabType, label: 'Privacy & Settings', icon: Shield },
            ]).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-3.5 text-sm font-medium whitespace-nowrap transition-colors relative ${
                  activeTab === tab.key
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {tab.badge ? (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
                    {tab.badge}
                  </span>
                ) : null}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ==================== OVERVIEW TAB ==================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Actions Grid */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map(action => (
                  <Link
                    key={action.title}
                    to={action.link}
                    className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-4 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`bg-gradient-to-br ${action.color} p-2.5 rounded-lg shadow-sm`}>
                        <action.icon className="h-5 w-5 text-white" />
                      </div>
                      {action.badge && (
                        <span className="text-[11px] font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                          {action.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{action.desc}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Two Column: Personal Info + Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
                  <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <h2 className="font-semibold text-gray-900 dark:text-white">Personal Information</h2>
                    </div>
                    <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-300">
                      Edit
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-8">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">First Name</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">John</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Last Name</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Doe</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Phone Number</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Gender</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Male</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Date of Birth</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">15 March 1990</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Saved Addresses */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
                  <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <h2 className="font-semibold text-gray-900 dark:text-white">Manage Addresses</h2>
                    </div>
                    <button className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors font-medium">
                      + Add New
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    {/* Address Card 1 */}
                    <div className="border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded">DEFAULT</span>
                          <span className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">HOME</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 text-xs font-medium">Edit</button>
                          <button className="text-red-500 dark:text-red-400 hover:text-red-600 text-xs font-medium">Remove</button>
                        </div>
                      </div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">John Doe</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        123 Main Street, Apartment 4B, New York, NY 10001
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Phone: +1 (555) 123-4567</p>
                    </div>
                    {/* Address Card 2 */}
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">WORK</span>
                        <div className="flex items-center gap-3">
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 text-xs font-medium">Edit</button>
                          <button className="text-red-500 dark:text-red-400 hover:text-red-600 text-xs font-medium">Remove</button>
                        </div>
                      </div>
                      <p className="font-medium text-sm text-gray-900 dark:text-white">John Doe</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        456 Business Ave, Suite 200, San Francisco, CA 94102
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Phone: +1 (555) 987-6543</p>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
                  <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <h2 className="font-semibold text-gray-900 dark:text-white">Saved Payment Methods</h2>
                    </div>
                    <button className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors font-medium">
                      + Add New
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-9 bg-gradient-to-r from-blue-700 to-blue-500 rounded-md flex items-center justify-center shadow-sm">
                          <span className="text-white text-[10px] font-bold tracking-wider">VISA</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-900 dark:text-white">&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Expires 12/28</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded">Default</span>
                        <button className="text-blue-600 dark:text-blue-400 text-xs font-medium">Edit</button>
                        <button className="text-red-500 dark:text-red-400 text-xs font-medium">Remove</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-9 bg-gradient-to-r from-red-600 to-orange-500 rounded-md flex items-center justify-center shadow-sm">
                          <span className="text-white text-[10px] font-bold tracking-wider">MC</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm text-gray-900 dark:text-white">&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 8901</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Expires 06/27</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="text-blue-600 dark:text-blue-400 text-xs font-medium">Edit</button>
                        <button className="text-red-500 dark:text-red-400 text-xs font-medium">Remove</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Account Stats */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-5">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Account Summary</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Total Orders</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">12</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Total Spent</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">$1,247.89</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Reward Points</span>
                      <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">450 pts</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b dark:border-gray-700">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Wishlist</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{wishlistItems.length} items</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Member Since</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">Jan 2024</span>
                    </div>
                  </div>
                </div>

                {/* Rewards Card */}
                <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-orange-500 rounded-xl shadow-sm p-5 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <Award className="h-6 w-6" />
                    <h3 className="font-semibold">EcomStore Rewards</h3>
                  </div>
                  <p className="text-2xl font-bold">450 Points</p>
                  <p className="text-yellow-100 text-xs mt-1 mb-4">Earn 1 pt per $1 spent &bull; 100 pts = $5 off</p>
                  <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                    <div className="bg-white rounded-full h-2" style={{ width: '45%' }} />
                  </div>
                  <p className="text-[11px] text-yellow-100">50 more points to unlock Silver tier</p>
                  <button className="w-full mt-4 bg-white text-orange-600 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-50 transition-colors">
                    Redeem Points
                  </button>
                </div>

                {/* Coupons */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Available Coupons</h3>
                    <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      3 NEW
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg p-3 bg-blue-50/50 dark:bg-blue-900/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-sm text-blue-600 dark:text-blue-400">SAVE10</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">10% off on orders above $50</p>
                        </div>
                        <button className="text-blue-600 dark:text-blue-400 text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 px-2.5 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                          Copy
                        </button>
                      </div>
                    </div>
                    <div className="border-2 border-dashed border-green-300 dark:border-green-700 rounded-lg p-3 bg-green-50/50 dark:bg-green-900/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-sm text-green-600 dark:text-green-400">FREESHIP</p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400">Free shipping on all orders</p>
                        </div>
                        <button className="text-green-600 dark:text-green-400 text-xs font-semibold bg-green-100 dark:bg-green-900/30 px-2.5 py-1 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
                  <div className="px-5 py-3 border-b dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Quick Links</h3>
                  </div>
                  <div>
                    <button
                      onClick={() => setActiveTab('notifications')}
                      className="w-full flex items-center justify-between px-5 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b dark:border-gray-700"
                    >
                      <div className="flex items-center gap-3">
                        <Bell className="h-4 w-4 text-gray-400" />
                        <span>Notifications</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                        )}
                        <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('privacy')}
                      className="w-full flex items-center justify-between px-5 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b dark:border-gray-700"
                    >
                      <div className="flex items-center gap-3">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <span>Privacy & Settings</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                    </button>
                    <Link
                      to="/orders"
                      className="w-full flex items-center justify-between px-5 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b dark:border-gray-700"
                    >
                      <div className="flex items-center gap-3">
                        <Truck className="h-4 w-4 text-gray-400" />
                        <span>Track Orders</span>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-5 py-3 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== NOTIFICATIONS TAB ==================== */}
        {activeTab === 'notifications' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filter Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden sticky top-6">
                <div className="px-5 py-4 border-b dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
                </div>
                <div className="p-2">
                  {notificationFilterTabs.map(tab => {
                    const count = getFilterCount(tab.key);
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setNotificationFilter(tab.key)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors ${
                          notificationFilter === tab.key
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <tab.icon className="h-4 w-4" />
                          <span>{tab.label}</span>
                        </div>
                        {count > 0 && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            notificationFilter === tab.key
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                          }`}>
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Notification Preferences in sidebar */}
                <div className="border-t dark:border-gray-700 p-4">
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Channels</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Email</span>
                      </div>
                      <ToggleSwitch enabled={privacySettings.emailNotifications} onToggle={() => togglePrivacySetting('emailNotifications')} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">SMS</span>
                      </div>
                      <ToggleSwitch enabled={privacySettings.smsNotifications} onToggle={() => togglePrivacySetting('smsNotifications')} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Push</span>
                      </div>
                      <ToggleSwitch enabled={privacySettings.pushNotifications} onToggle={() => togglePrivacySetting('pushNotifications')} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification List */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      {notificationFilter === 'all' ? 'All Notifications' :
                       notificationFilter === 'order' ? 'Order Updates' :
                       notificationFilter === 'promo' ? 'Offers & Promotions' :
                       notificationFilter === 'security' ? 'Security Alerts' : 'System Updates'}
                    </h2>
                    {unreadCount > 0 && (
                      <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold px-2 py-0.5 rounded-full">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300">
                        Mark all read
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button onClick={clearAllNotifications} className="text-xs text-gray-500 dark:text-gray-400 font-medium hover:text-red-500 dark:hover:text-red-400">
                        Clear all
                      </button>
                    )}
                  </div>
                </div>

                {/* List */}
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-16">
                    <Bell className="h-16 w-16 text-gray-200 dark:text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No notifications</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="divide-y dark:divide-gray-700">
                    {filteredNotifications.map(notification => (
                      <div
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`flex items-start gap-4 px-6 py-4 cursor-pointer transition-colors ${
                          notification.read
                            ? 'hover:bg-gray-50 dark:hover:bg-gray-700/30'
                            : 'bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                        }`}
                      >
                        <div className={`flex-shrink-0 mt-0.5 p-2 rounded-full ${
                          notification.type === 'order' ? 'bg-blue-100 dark:bg-blue-900/30' :
                          notification.type === 'promo' ? 'bg-green-100 dark:bg-green-900/30' :
                          notification.type === 'security' ? 'bg-orange-100 dark:bg-orange-900/30' :
                          'bg-purple-100 dark:bg-purple-900/30'
                        }`}>
                          {notificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className={`text-sm ${notification.read ? 'font-medium text-gray-900 dark:text-white' : 'font-semibold text-gray-900 dark:text-white'}`}>
                                {notification.title}
                                {!notification.read && (
                                  <span className="inline-block ml-2 h-2 w-2 bg-blue-500 rounded-full" />
                                )}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {notification.time}
                            </span>
                            <button
                              onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                              className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 opacity-0 group-hover:opacity-100"
                              title="Delete notification"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                          className="flex-shrink-0 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== PRIVACY & SETTINGS TAB ==================== */}
        {activeTab === 'privacy' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden sticky top-6">
                <div className="px-5 py-4 border-b dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Settings</h3>
                </div>
                <nav className="p-2">
                  <a href="#security" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                    <Lock className="h-4 w-4 text-gray-400" />
                    Login & Security
                  </a>
                  <a href="#notifications-pref" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                    <Bell className="h-4 w-4 text-gray-400" />
                    Notification Preferences
                  </a>
                  <a href="#privacy-controls" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                    <Shield className="h-4 w-4 text-gray-400" />
                    Privacy Controls
                  </a>
                  <a href="#data-management" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                    <FileText className="h-4 w-4 text-gray-400" />
                    Data Management
                  </a>
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Login & Security */}
              <div id="security" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
                <div className="flex items-center gap-2 px-6 py-4 border-b dark:border-gray-700">
                  <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="font-semibold text-gray-900 dark:text-white">Login & Security</h2>
                </div>
                <div className="divide-y dark:divide-gray-700">
                  <div className="flex items-center justify-between px-6 py-5">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Add an extra layer of security to your account using SMS or authenticator app</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded ${privacySettings.twoFactorAuth ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                        {privacySettings.twoFactorAuth ? 'Enabled' : 'Disabled'}
                      </span>
                      <ToggleSwitch enabled={privacySettings.twoFactorAuth} onToggle={() => togglePrivacySetting('twoFactorAuth')} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-6 py-5">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Login Alerts</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Get notified via email when someone logs into your account from a new device</p>
                    </div>
                    <ToggleSwitch enabled={privacySettings.loginAlerts} onToggle={() => togglePrivacySetting('loginAlerts')} />
                  </div>
                  <div className="flex items-center justify-between px-6 py-5">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Password</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Last changed 30 days ago</p>
                    </div>
                    <button className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 px-3 py-1.5 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                      Change
                    </button>
                  </div>
                  <div className="flex items-center justify-between px-6 py-5">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Profile Visibility</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Control who can see your profile information and activity</p>
                    </div>
                    <button
                      onClick={() =>
                        setPrivacySettings(prev => ({
                          ...prev,
                          profileVisibility: prev.profileVisibility === 'public' ? 'private' : 'public',
                        }))
                      }
                      className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                        privacySettings.profileVisibility === 'private'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                      }`}
                    >
                      {privacySettings.profileVisibility === 'private' ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      {privacySettings.profileVisibility === 'private' ? 'Private' : 'Public'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div id="notifications-pref" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
                <div className="flex items-center gap-2 px-6 py-4 border-b dark:border-gray-700">
                  <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="font-semibold text-gray-900 dark:text-white">Notification Preferences</h2>
                </div>
                <div className="px-6 py-2">
                  {/* Channel Headers */}
                  <div className="hidden sm:grid grid-cols-[1fr,60px,60px,60px] gap-4 py-3 border-b dark:border-gray-700">
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</span>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Email</span>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">SMS</span>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Push</span>
                  </div>
                  {/* Row items */}
                  <div className="divide-y dark:divide-gray-700">
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr,60px,60px,60px] gap-4 py-4 items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Order Updates</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Shipping, delivery, and return updates</p>
                      </div>
                      <div className="flex sm:justify-center"><ToggleSwitch enabled={privacySettings.orderUpdates} onToggle={() => togglePrivacySetting('orderUpdates')} /></div>
                      <div className="flex sm:justify-center"><ToggleSwitch enabled={privacySettings.smsNotifications} onToggle={() => togglePrivacySetting('smsNotifications')} /></div>
                      <div className="flex sm:justify-center"><ToggleSwitch enabled={privacySettings.pushNotifications} onToggle={() => togglePrivacySetting('pushNotifications')} /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr,60px,60px,60px] gap-4 py-4 items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Promotions & Deals</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Sales, coupons, and personalized recommendations</p>
                      </div>
                      <div className="flex sm:justify-center"><ToggleSwitch enabled={privacySettings.promoAlerts} onToggle={() => togglePrivacySetting('promoAlerts')} /></div>
                      <div className="flex sm:justify-center"><ToggleSwitch enabled={false} onToggle={() => {}} /></div>
                      <div className="flex sm:justify-center"><ToggleSwitch enabled={privacySettings.promoAlerts} onToggle={() => togglePrivacySetting('promoAlerts')} /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr,60px,60px,60px] gap-4 py-4 items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Account & Security</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Login alerts, password changes, suspicious activity</p>
                      </div>
                      <div className="flex sm:justify-center"><ToggleSwitch enabled={privacySettings.loginAlerts} onToggle={() => togglePrivacySetting('loginAlerts')} /></div>
                      <div className="flex sm:justify-center"><ToggleSwitch enabled={privacySettings.loginAlerts} onToggle={() => togglePrivacySetting('loginAlerts')} /></div>
                      <div className="flex sm:justify-center"><ToggleSwitch enabled={privacySettings.loginAlerts} onToggle={() => togglePrivacySetting('loginAlerts')} /></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-[1fr,60px,60px,60px] gap-4 py-4 items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Marketing Emails</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Newsletter, product launches, and brand updates</p>
                      </div>
                      <div className="flex sm:justify-center"><ToggleSwitch enabled={privacySettings.marketingEmails} onToggle={() => togglePrivacySetting('marketingEmails')} /></div>
                      <div className="flex sm:justify-center"><ToggleSwitch enabled={false} onToggle={() => {}} /></div>
                      <div className="flex sm:justify-center"><ToggleSwitch enabled={false} onToggle={() => {}} /></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy Controls */}
              <div id="privacy-controls" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
                <div className="flex items-center gap-2 px-6 py-4 border-b dark:border-gray-700">
                  <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="font-semibold text-gray-900 dark:text-white">Privacy Controls</h2>
                </div>
                <div className="divide-y dark:divide-gray-700">
                  <div className="flex items-center justify-between px-6 py-5">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Data Sharing</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Allow sharing anonymized usage data to improve our services and recommendations</p>
                    </div>
                    <ToggleSwitch enabled={privacySettings.dataSharing} onToggle={() => togglePrivacySetting('dataSharing')} />
                  </div>
                  <div className="flex items-center justify-between px-6 py-5">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Personalized Ads</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Show ads based on your browsing and purchase history</p>
                    </div>
                    <ToggleSwitch enabled={privacySettings.personalizedAds} onToggle={() => togglePrivacySetting('personalizedAds')} />
                  </div>
                  <div className="flex items-center justify-between px-6 py-5">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Activity Status</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Show others when you're active on the platform</p>
                    </div>
                    <ToggleSwitch enabled={privacySettings.activityStatus} onToggle={() => togglePrivacySetting('activityStatus')} />
                  </div>
                </div>
              </div>

              {/* Data Management */}
              <div id="data-management" className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700">
                <div className="flex items-center gap-2 px-6 py-4 border-b dark:border-gray-700">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="font-semibold text-gray-900 dark:text-white">Data Management</h2>
                </div>
                <div className="divide-y dark:divide-gray-700">
                  <button
                    onClick={handleDownloadData}
                    className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Download Your Data</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Request a copy of your personal data, order history, and account information</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  </button>
                  <button className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                        <XCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Deactivate Account</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Temporarily deactivate your account. You can reactivate anytime</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  </button>
                  <button className="w-full flex items-center justify-between px-6 py-5 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                        <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-red-600 dark:text-red-400">Delete Account Permanently</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Permanently remove your account and all associated data. This cannot be undone</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-red-400 flex-shrink-0" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Account;
