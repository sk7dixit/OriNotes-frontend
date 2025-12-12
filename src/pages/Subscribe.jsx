import React, { useState, useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import api from "../services/api";
import { useAuth } from '../context/AuthContext';
import { Check, Shield, CreditCard, HelpCircle, Star, Zap, Clock, Users } from 'lucide-react';

// Environment variable
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID;

const PricingCard = ({ plan, selected, onSelect }) => {
  const isPopular = plan.id === 'monthly';

  return (
    <div
      onClick={() => onSelect(plan.id)}
      className={`relative p-8 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col h-full
        ${selected
          ? 'bg-gradient-to-b from-gray-800 to-gray-900 border-cyan-500 shadow-xl shadow-cyan-500/10 scale-105 z-10'
          : 'bg-gray-800/40 border-gray-700 hover:border-gray-600 hover:bg-gray-800/60'
        }
      `}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
          MOST POPULAR
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-medium text-gray-300 mb-2">{plan.name}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-white">${plan.price}</span>
          <span className="text-gray-500">/{plan.label}</span>
        </div>
        <p className="text-sm text-gray-400 mt-2">{plan.description}</p>
      </div>

      <div className="space-y-4 mb-8 flex-1">
        {plan.features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className={`mt-1 p-0.5 rounded-full ${selected ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-700 text-gray-400'}`}>
              <Check size={12} strokeWidth={3} />
            </div>
            <span className="text-sm text-gray-300">{feature}</span>
          </div>
        ))}
      </div>

      <button
        className={`w-full py-3 rounded-xl font-semibold transition-all
          ${selected
            ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/25'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }
        `}
      >
        {selected ? 'Selected' : 'Choose Plan'}
      </button>
    </div>
  );
};

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-800">
      <button
        className="w-full py-4 flex items-center justify-between text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-gray-300 font-medium">{question}</span>
        <span className={`text-cyan-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen && (
        <div className="pb-4 text-gray-400 text-sm leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

function Subscribe() {
  const { user, updateUserProfile } = useAuth();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [planAmount, setPlanAmount] = useState(null);

  const plans = [
    {
      id: "weekly",
      name: "Weekly",
      price: 5.00,
      label: "week",
      description: "Perfect for cramming before exams.",
      features: ["Unlimited downloads", "7 days of access", "Mobile optimized", "Basic support"]
    },
    {
      id: "monthly",
      name: "Monthly",
      price: 15.00,
      label: "mo",
      description: "Best value for regular students.",
      features: ["Unlimited downloads", "Ad-free experience", "Priority downloads", "Premium support", "Verified Student Badge"]
    },
    {
      id: "semester",
      name: "Semester",
      price: 60.00,
      label: "sem",
      description: "Pay once, sorted for the term.",
      features: ["Everything in Monthly", "6 months access", "Offline access", "Exclusive study guides", "Top tier badge"]
    },
  ];

  const faqs = [
    { q: "How does the billing work?", a: "You pay a one-time fee for the duration of the plan selected. It does not auto-renew automatically unless you enable it in settings." },
    { q: "Can I upgrade my plan later?", a: "Yes, you can upgrade at any time. The remaining value of your current plan will be credited towards the new one." },
    { q: "Is my payment information secure?", a: "Absolutely. We use PayPal for processing payments, ensuring your financial data is encrypted and never stored on our servers." },
    { q: "What happens after my subscription ends?", a: "Your account reverts to the free tier. You won't lose your data, but premium features like unlimited downloads will be locked." },
  ];

  useEffect(() => {
    const currentPlan = plans.find(p => p.id === selectedPlan);
    setPlanAmount(currentPlan ? currentPlan.price.toFixed(2) : null);
  }, [selectedPlan]);

  const createOrder = async () => {
    setMessage("");
    if (!selectedPlan || !planAmount) {
      setMessage("Please select a valid plan.");
      return Promise.reject(new Error("Plan not selected"));
    }
    try {
      const response = await api.post("/payments/create-order", {
        plan: selectedPlan,
        amount: planAmount
      });
      return response.data.id;
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Failed to create PayPal order.";
      setMessage(`❌ ${errorMsg}`);
      return Promise.reject(err);
    }
  };

  const onApprove = async (data) => {
    setMessage("Processing payment...");
    setLoading(true);
    try {
      const response = await api.post(`/payments/capture-order/${data.orderID}`);
      if (response.data.status === 'COMPLETED') {
        setMessage("✅ Payment successful! Welcome to Premium.");
        const profileRes = await api.get("/users/profile");
        updateUserProfile(profileRes.data);
      } else {
        setMessage(`⚠️ Payment status: ${response.data.status}. Please contact support.`);
      }
    } catch (err) {
      setMessage(err.response?.data?.error || "Payment failed. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  if (!user?.is_subscription_enabled) {
    return (
      <div className="min-h-screen bg-[#0A0A0C] flex flex-col items-center justify-center text-center p-6">
        <div className="bg-yellow-500/10 p-4 rounded-full mb-4">
          <Clock className="text-yellow-500 w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold mb-2 text-white">Subscriptions Paused</h2>
        <p className="text-gray-400 max-w-md">We are currently upgrading our payment systems. Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-gray-100 font-inter pb-20">

      {/* Header */}
      <div className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />
        <h1 className="relative text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
          Invest in Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Academic Success</span>
        </h1>
        <p className="relative text-lg text-gray-400 max-w-2xl mx-auto">
          Get unlimited access to premium notes across all universities. Join thousands of students boosting their grades today.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6">

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              selected={selectedPlan === plan.id}
              onSelect={setSelectedPlan}
            />
          ))}
        </div>

        {/* Payment Logic Section */}
        {selectedPlan && planAmount && (
          <div className="max-w-md mx-auto bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />

            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Due</p>
                <div className="text-3xl font-bold text-white">${planAmount}</div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-2 text-gray-400 text-sm mb-1">
                  <Shield size={14} className="text-green-400" /> Secure SSL
                </div>
                <div className="flex gap-2">
                  {/* Visual Payment Icons */}
                  <div className="bg-white rounded px-1 py-0.5 h-6 w-8 flex items-center justify-center"><span className="text-[8px] font-bold text-blue-800 italic">VISA</span></div>
                  <div className="bg-white rounded px-1 py-0.5 h-6 w-8 flex items-center justify-center"><span className="text-[8px] font-bold text-blue-600">Pay</span><span className="text-[8px] font-bold text-cyan-500">Pal</span></div>
                </div>
              </div>
            </div>

            <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID, currency: "USD" }}>
              <PayPalButtons
                style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
                disabled={loading}
                forceReRender={[selectedPlan, planAmount]}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={(err) => setMessage("❌ Transaction error. Please try again.")}
              />
            </PayPalScriptProvider>

            {message && (
              <div className={`mt-4 p-3 rounded-lg text-sm font-medium text-center ${message.startsWith('✅') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {message}
              </div>
            )}
          </div>
        )}

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 md:p-8">
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>

        {/* Trust Footer */}
        <div className="text-center mt-20 pt-10 border-t border-gray-900 text-gray-500 text-sm flex flex-col md:flex-row items-center justify-center gap-6">
          <span className="flex items-center gap-2"><Shield size={16} /> 256-bit SSL Encryption</span>
          <span className="flex items-center gap-2"><Check size={16} /> 30-Day Money Back Guarantee</span>
          <span className="flex items-center gap-2"><Star size={16} /> 4.9/5 Student Rating</span>
        </div>

      </div>
    </div>
  );
}

export default Subscribe;
