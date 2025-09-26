import React from 'react';
import { CheckCircle, Mail, BookOpen, ArrowRight } from 'lucide-react';

interface SuccessPageProps {
  onContinue: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ onContinue }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-full p-6 w-24 h-24 mx-auto mb-8 shadow-2xl">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>

        {/* Success Message */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          🎉 Payment Successful!
        </h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            Welcome to the Course!
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Your account has been created automatically and you now have lifetime access to the complete course.
          </p>

          {/* What happens next */}
          <div className="space-y-4 text-left max-w-md mx-auto">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</div>
              <div>
                <h3 className="font-semibold text-gray-800">Account Created</h3>
                <p className="text-sm text-gray-600">Your user account has been set up automatically</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</div>
              <div>
                <h3 className="font-semibold text-gray-800">Email Sent</h3>
                <p className="text-sm text-gray-600">Login credentials have been sent to your email</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</div>
              <div>
                <h3 className="font-semibold text-gray-800">Course Access</h3>
                <p className="text-sm text-gray-600">You can now access all 13 modules immediately</p>
              </div>
            </div>
          </div>
        </div>

        {/* Email Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Mail className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Check Your Email</span>
          </div>
          <p className="text-blue-700 text-sm">
            We've sent your login credentials to the email address you provided. 
            If you don't see it within a few minutes, please check your spam folder.
          </p>
        </div>

        {/* Continue Button */}
        <button
          onClick={onContinue}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2"
        >
          <span>Access Your Course</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="mt-6 text-sm text-gray-500">
          <p>
            Need help? Contact us at{' '}
            <a href="mailto:support@coursehub.com" className="text-blue-600 hover:underline">
              support@coursehub.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;