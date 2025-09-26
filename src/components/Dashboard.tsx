import React, { useState, useEffect } from 'react';
import { LogOut, BookOpen, User, CheckCircle, Star, Award } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  display_name: string;
  email: string;
  phone?: string;
}

interface Purchase {
  id: string;
  course: {
    title: string;
    description: string;
  };
  status: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else {
          setProfile(profileData);
        }

        // Fetch user purchases
        const { data: purchasesData, error: purchasesError } = await supabase
          .from('purchases')
          .select(`
            *,
            course:courses(title, description)
          `)
          .eq('user_id', user.id)
          .eq('status', 'completed');

        if (purchasesError) {
          console.error('Error fetching purchases:', purchasesError);
        } else {
          setPurchases(purchasesData || []);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Loading your course...</p>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-gray-900">
                  {profile?.display_name || user?.email?.split('@')[0]}
                </p>
              </div>
              <button
                onClick={signOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Your Course Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Continue your journey to success with Napoleon Hill's proven principles
          </p>
        </div>

        {/* Course Access */}
        {purchases.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* My Courses */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
              </div>

              <div className="space-y-4">
                {purchases.map((purchase) => (
                  <div key={purchase.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {purchase.course.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          {purchase.course.description}
                        </p>
                        <div className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-green-600 font-medium">Active</span>
                        </div>
                      </div>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                        Continue Learning
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Summary */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <User className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <p className="text-gray-900">{profile?.display_name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{profile?.email}</p>
                </div>
                
                {profile?.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-gray-900">{profile.phone}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                  <p className="text-gray-900">
                    {new Date(user?.created_at || '').toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-green-600">
                  <Award className="w-5 h-5" />
                  <span className="font-semibold">Premium Member</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* No Courses Yet */
          <div className="text-center bg-white rounded-xl shadow-lg p-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No courses found
            </h2>
            <p className="text-gray-600 mb-8">
              It looks like you haven't purchased any courses yet, or your purchase is still being processed.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Browse Courses
            </button>
          </div>
        )}

        {/* Course Progress (if courses exist) */}
        {purchases.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Progress</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">13</div>
                <p className="text-gray-600">Modules Available</p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">0</div>
                <p className="text-gray-600">Modules Completed</p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <Star className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">0%</div>
                <p className="text-gray-600">Course Progress</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;