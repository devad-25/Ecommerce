import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  Check,
  ChevronDown,
  ChevronUp,
  Tag,
  Shield,
  Lock,
  Clock,
  AlertCircle,
  BadgeCheck,
  Banknote,
  Percent,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCart } from "../context/cartcontext";

type PaymentMethod = "card" | "upi" | "netbanking" | "wallet" | "cod" | "emi";

interface SavedCard {
  id: string;
  type: string;
  lastFour: string;
  bank: string;
  expiry: string;
}

interface Bank {
  id: string;
  name: string;
  logo: string;
}

interface WalletOption {
  id: string;
  name: string;
  balance: number;
  logo: string;
}

const Payment = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("card");
  const [selectedCard, setSelectedCard] = useState<string>("");
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [selectedWallet, setSelectedWallet] = useState<string>("");
  const [selectedEmiOption, setSelectedEmiOption] = useState<string>("");
  const [upiId, setUpiId] = useState("");
  const [showAllBanks, setShowAllBanks] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Card form states
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // Mock data
  const savedCards: SavedCard[] = [
    { id: "1", type: "Visa", lastFour: "4242", bank: "HDFC Bank", expiry: "12/26" },
    { id: "2", type: "Mastercard", lastFour: "8888", bank: "ICICI Bank", expiry: "09/25" },
  ];

  const popularBanks: Bank[] = [
    { id: "hdfc", name: "HDFC Bank", logo: "🏦" },
    { id: "icici", name: "ICICI Bank", logo: "🏦" },
    { id: "sbi", name: "State Bank of India", logo: "🏦" },
    { id: "axis", name: "Axis Bank", logo: "🏦" },
    { id: "kotak", name: "Kotak Mahindra", logo: "🏦" },
    { id: "pnb", name: "Punjab National Bank", logo: "🏦" },
  ];

  const allBanks: Bank[] = [
    ...popularBanks,
    { id: "bob", name: "Bank of Baroda", logo: "🏦" },
    { id: "canara", name: "Canara Bank", logo: "🏦" },
    { id: "idbi", name: "IDBI Bank", logo: "🏦" },
    { id: "union", name: "Union Bank", logo: "🏦" },
    { id: "yes", name: "Yes Bank", logo: "🏦" },
    { id: "indusind", name: "IndusInd Bank", logo: "🏦" },
  ];

  const wallets: WalletOption[] = [
    { id: "paytm", name: "Paytm Wallet", balance: 1250.0, logo: "💳" },
    { id: "phonepe", name: "PhonePe Wallet", balance: 500.0, logo: "📱" },
    { id: "amazon", name: "Amazon Pay", balance: 2100.5, logo: "🛒" },
    { id: "mobikwik", name: "MobiKwik", balance: 350.0, logo: "💰" },
  ];

  const emiOptions = [
    { id: "3", months: 3, interest: 0 },
    { id: "6", months: 6, interest: 12 },
    { id: "9", months: 9, interest: 14 },
    { id: "12", months: 12, interest: 15 },
  ];

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = (subtotal > 50 || subtotal === 0) ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping + tax - discount;

  // Calculate EMI amounts
  const emiOptionsWithAmounts = emiOptions.map((opt) => ({
    ...opt,
    monthlyAmount: (total * (1 + opt.interest / 100)) / opt.months,
  }));

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "save10") {
      setPromoApplied(true);
    }
  };

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      navigate("/orders");
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            to="/checkout"
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Checkout
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payment</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-sm font-medium text-green-600 dark:text-green-400">Cart</span>
            </div>
            <div className="w-16 h-1 bg-green-500"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-sm font-medium text-green-600 dark:text-green-400">Address</span>
            </div>
            <div className="w-16 h-1 bg-green-500"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">3</span>
              </div>
              <span className="ml-2 text-sm font-medium text-blue-600 dark:text-blue-400">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 transition-colors ${
                selectedMethod === "card"
                  ? "border-blue-500"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <button
                onClick={() => setSelectedMethod("card")}
                className="w-full p-4 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedMethod === "card"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {selectedMethod === "card" && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <CreditCard className="h-6 w-6 text-gray-600 dark:text-gray-400 mr-3" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Credit / Debit Card</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Visa, Mastercard, Rupay & more</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/100px-Visa_Inc._logo.svg.png" alt="Visa" className="h-6" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/100px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6" />
                </div>
              </button>

              {selectedMethod === "card" && (
                <div className="px-4 pb-4 border-t dark:border-gray-700">
                  {savedCards.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Saved Cards</h4>
                      <div className="space-y-2">
                        {savedCards.map((card) => (
                          <label
                            key={card.id}
                            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedCard === card.id
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                : "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                            }`}
                          >
                            <input
                              type="radio"
                              name="savedCard"
                              value={card.id}
                              checked={selectedCard === card.id}
                              onChange={(e) => setSelectedCard(e.target.value)}
                              className="sr-only"
                            />
                            <div className="flex items-center flex-1">
                              <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded mr-3 flex items-center justify-center">
                                <span className="text-white text-xs font-bold">{card.type[0]}</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {card.type} •••• {card.lastFour}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{card.bank}</p>
                              </div>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{card.expiry}</span>
                            {selectedCard === card.id && (
                              <BadgeCheck className="h-5 w-5 text-blue-500 ml-2" />
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <label
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedCard === "new"
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="savedCard"
                        value="new"
                        checked={selectedCard === "new"}
                        onChange={(e) => setSelectedCard(e.target.value)}
                        className="sr-only"
                      />
                      <CreditCard className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <span className="font-medium text-gray-900 dark:text-white">Add New Card</span>
                    </label>

                    {selectedCard === "new" && (
                      <div className="mt-4 space-y-4 pl-8">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Card Number
                          </label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            maxLength={19}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              maxLength={5}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="MM/YY"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              CVV
                            </label>
                            <input
                              type="password"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              maxLength={4}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              placeholder="•••"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Name on Card
                          </label>
                          <input
                            type="text"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="John Doe"
                          />
                        </div>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                            Save this card for future payments
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 transition-colors ${
                selectedMethod === "upi"
                  ? "border-blue-500"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <button
                onClick={() => setSelectedMethod("upi")}
                className="w-full p-4 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedMethod === "upi"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {selectedMethod === "upi" && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <Smartphone className="h-6 w-6 text-gray-600 dark:text-gray-400 mr-3" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">UPI</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Google Pay, PhonePe, Paytm & more</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-2xl">📱</span>
                </div>
              </button>

              {selectedMethod === "upi" && (
                <div className="px-4 pb-4 border-t dark:border-gray-700">
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { name: "GPay", icon: "🟢" },
                        { name: "PhonePe", icon: "🟣" },
                        { name: "Paytm", icon: "🔵" },
                        { name: "BHIM", icon: "🟠" },
                      ].map((app) => (
                        <button
                          type="button"
                          key={app.name}
                          className="flex flex-col items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <span className="text-2xl mb-1">{app.icon}</span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">{app.name}</span>
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">or enter UPI ID</span>
                      </div>
                    </div>
                    <div>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="username@upi"
                      />
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        A payment request will be sent to your UPI app
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 transition-colors ${
                selectedMethod === "netbanking"
                  ? "border-blue-500"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <button
                onClick={() => setSelectedMethod("netbanking")}
                className="w-full p-4 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedMethod === "netbanking"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {selectedMethod === "netbanking" && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <Building2 className="h-6 w-6 text-gray-600 dark:text-gray-400 mr-3" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Net Banking</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">All major banks supported</p>
                  </div>
                </div>
                <span className="text-2xl">🏦</span>
              </button>

              {selectedMethod === "netbanking" && (
                <div className="px-4 pb-4 border-t dark:border-gray-700">
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Popular Banks</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {(showAllBanks ? allBanks : popularBanks).map((bank) => (
                        <label
                          key={bank.id}
                          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedBank === bank.id
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                          }`}
                        >
                          <input
                            type="radio"
                            name="bank"
                            value={bank.id}
                            checked={selectedBank === bank.id}
                            onChange={(e) => setSelectedBank(e.target.value)}
                            className="sr-only"
                          />
                          <span className="mr-2">{bank.logo}</span>
                          <span className="text-sm text-gray-900 dark:text-white truncate">{bank.name}</span>
                        </label>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowAllBanks(!showAllBanks)}
                      className="mt-3 flex items-center text-blue-600 dark:text-blue-400 text-sm hover:underline"
                    >
                      {showAllBanks ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-1" /> Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-1" /> Show All Banks
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 transition-colors ${
                selectedMethod === "wallet"
                  ? "border-blue-500"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <button
                onClick={() => setSelectedMethod("wallet")}
                className="w-full p-4 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedMethod === "wallet"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {selectedMethod === "wallet" && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <Wallet className="h-6 w-6 text-gray-600 dark:text-gray-400 mr-3" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Wallets</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Paytm, PhonePe, Amazon Pay</p>
                  </div>
                </div>
                <span className="text-2xl">💳</span>
              </button>

              {selectedMethod === "wallet" && (
                <div className="px-4 pb-4 border-t dark:border-gray-700">
                  <div className="mt-4 space-y-2">
                    {wallets.map((wallet) => (
                      <label
                        key={wallet.id}
                        className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedWallet === wallet.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="wallet"
                            value={wallet.id}
                            checked={selectedWallet === wallet.id}
                            onChange={(e) => setSelectedWallet(e.target.value)}
                            className="sr-only"
                          />
                          <span className="text-xl mr-3">{wallet.logo}</span>
                          <span className="font-medium text-gray-900 dark:text-white">{wallet.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            ${wallet.balance.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Available</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 transition-colors ${
                selectedMethod === "emi"
                  ? "border-blue-500"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <button
                onClick={() => setSelectedMethod("emi")}
                className="w-full p-4 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedMethod === "emi"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {selectedMethod === "emi" && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <Percent className="h-6 w-6 text-gray-600 dark:text-gray-400 mr-3" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">EMI</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">No Cost EMI available</p>
                  </div>
                </div>
                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs font-medium px-2 py-1 rounded">
                  0% Interest
                </span>
              </button>

              {selectedMethod === "emi" && (
                <div className="px-4 pb-4 border-t dark:border-gray-700">
                  <div className="mt-4 space-y-2">
                    {emiOptionsWithAmounts.map((option) => (
                      <label
                        key={option.id}
                        className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedEmiOption === option.id
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="emi"
                            value={option.id}
                            checked={selectedEmiOption === option.id}
                            onChange={(e) => setSelectedEmiOption(e.target.value)}
                            className="sr-only"
                          />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{option.months} Months</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {option.interest === 0 ? "No Cost EMI" : `${option.interest}% interest`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-white">
                            ${option.monthlyAmount.toFixed(2)}/mo
                          </p>
                          {option.interest === 0 && (
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">FREE</span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    EMI available on cards from HDFC, ICICI, SBI, Axis & more
                  </p>
                </div>
              )}
            </div>

            <div
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-2 transition-colors ${
                selectedMethod === "cod"
                  ? "border-blue-500"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <button
                onClick={() => setSelectedMethod("cod")}
                className="w-full p-4 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedMethod === "cod"
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {selectedMethod === "cod" && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <Banknote className="h-6 w-6 text-gray-600 dark:text-gray-400 mr-3" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Cash on Delivery</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pay when you receive</p>
                  </div>
                </div>
                <span className="text-2xl">💵</span>
              </button>

              {selectedMethod === "cod" && (
                <div className="px-4 pb-4 border-t dark:border-gray-700">
                  <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-start">
                      <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      Additional charge of $2.00 will be applicable for Cash on Delivery orders.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 object-contain bg-white rounded-lg p-1"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white truncate max-w-[150px]">{item.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 border-t dark:border-gray-700 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {shipping === 0 ? (
                      <span className="text-green-600 dark:text-green-400">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span className="font-medium text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span className="flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      Promo Discount
                    </span>
                    <span className="font-medium">-${discount.toFixed(2)}</span>
                  </div>
                )}
                {selectedMethod === "cod" && (
                  <div className="flex justify-between text-yellow-600 dark:text-yellow-400">
                    <span>COD Charge</span>
                    <span className="font-medium">+$2.00</span>
                  </div>
                )}
                <div className="border-t dark:border-gray-700 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      ${(total + (selectedMethod === "cod" ? 2 : 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                {!showPromoInput ? (
                  <button
                    onClick={() => setShowPromoInput(true)}
                    className="flex items-center text-blue-600 dark:text-blue-400 text-sm hover:underline"
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    Have a promo code?
                  </button>
                ) : (
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter code"
                        disabled={promoApplied}
                      />
                      <button
                        onClick={handleApplyPromo}
                        disabled={promoApplied}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          promoApplied
                            ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {promoApplied ? "Applied" : "Apply"}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing || cartItems.length === 0}
                className={`w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center ${
                  (isProcessing || cartItems.length === 0) ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isProcessing ? (
                  <>
                    <Clock className="animate-spin h-5 w-5 mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    Pay ${(total + (selectedMethod === "cod" ? 2 : 0)).toFixed(2)}
                  </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                <Shield className="h-4 w-4 mr-2" />
                <span>Secure 256-bit SSL Encryption</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Payment;
