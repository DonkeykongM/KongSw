import React from 'react';
import { BookOpen, Star, Users, Shield, CreditCard, CheckCircle } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onPurchase: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onPurchase }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">CourseHub</span>
            </div>
            <button
              onClick={onLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Master Success Principles
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Learn Napoleon Hill's 13 proven principles for building wealth and success through our comprehensive online course.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={onPurchase}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Get Instant Access - $97
            </button>
            <button
              onClick={onLogin}
              className="border border-gray-300 text-gray-700 font-semibold py-4 px-8 rounded-lg text-lg hover:bg-gray-50 transition-colors"
            >
              Already have an account?
            </button>
          </div>

          {/* Trust Signals */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600 mb-16">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span>30-day money back guarantee</span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-blue-500" />
              <span>Secure payment via Stripe</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-500" />
              <span>Join 10,000+ students</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What You'll Get</h2>
            <p className="text-lg text-gray-600">Complete course access with lifetime updates</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">13 Complete Modules</h3>
              <p className="text-gray-600">Comprehensive lessons covering every success principle</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Practical Exercises</h3>
              <p className="text-gray-600">Hands-on activities to apply what you learn</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Star className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Lifetime Access</h3>
              <p className="text-gray-600">Learn at your own pace with permanent access</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Life?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start your journey to success today with instant access to our complete course
          </p>
          <button
            onClick={onPurchase}
            className="bg-white text-blue-600 font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Get Started Now - $97
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;