import React, { useState } from 'react';
import { ArrowLeft, Mail, User, CreditCard, Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface PurchaseFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

const PurchaseForm: React.FC<PurchaseFormProps> = ({ onBack, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create Stripe checkout session
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          courseId: 'napoleon-hill-course',
          successUrl: `${window.location.origin}?payment=success`,
          cancelUrl: `${window.location.origin}?payment=cancelled`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { checkoutUrl } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = checkoutUrl;
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to home</span>
        </button>

        {/* Purchase Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full p-4 w-16 h-16 mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Purchase</h1>
            <p className="text-gray-600">Get instant access to the complete course</p>
          </div>

          {/* Course Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8 border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">Napoleon Hill Success Course</h3>
            <p className="text-blue-700 text-sm mb-4">Complete 13-module transformation program</p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-blue-800">$97</span>
              <div className="text-xs text-blue-600">
                <CheckCircle className="w-4 h-4 inline mr-1" />
                Lifetime access
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="First name"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Last name"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Phone Field (Optional) */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your phone number"
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Security Notice */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">Secure Purchase</span>
              </div>
              <ul className="text-sm text-green-700 space-y-1">
                <li>✓ Your account will be created automatically after payment</li>
                <li>✓ Login credentials will be emailed to you</li>
                <li>✓ All payments processed securely via Stripe</li>
                <li>✓ 30-day money-back guarantee</li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Processing...' : 'Proceed to Secure Payment - $97'}
            </button>
          </form>

          <div className="text-center mt-6 text-sm text-gray-500">
            Your payment is processed securely by Stripe. We never store your payment information.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseForm;