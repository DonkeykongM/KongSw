import React, { useState } from 'react';
import { ArrowLeft, User, Mail, Calendar, BookOpen, Trophy, Target, Edit2, Save, X, Lock, Eye, EyeOff, Camera, AlertCircle } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { getCompletedWeeksCount, getTotalProgress } from '../utils/progressStorage';
import { useProfile } from '../hooks/useProfile';

interface ProfilePageProps {
  onBack: () => void;
  onSignOut: () => Promise<{ error: any }>;
  user: SupabaseUser;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBack, onSignOut, user }) => {
  const { profile, loading, updateProfile, changePassword } = useProfile(user);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [editData, setEditData] = useState({
    display_name: '',
    bio: '',
    goals: '',
    favorite_module: ''
  });
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  // Update editData when profile loads
  React.useEffect(() => {
    if (profile) {
      setEditData({
        display_name: profile.display_name,
        bio: profile.bio,
        goals: profile.goals,
        favorite_module: profile.favorite_module
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    setSaveSuccess('');

    const success = await updateProfile(editData);
    
    if (success) {
      setIsEditing(false);
      setSaveSuccess('Profil sparad framgångsrikt!');
      setTimeout(() => setSaveSuccess(''), 3000);
    } else {
      setSaveError('Kunde inte spara profil. Försök igen.');
    }
    
    setSaving(false);
  };

  const handleCancel = () => {
    if (profile) {
      setEditData({
        display_name: profile.display_name,
        bio: profile.bio,
        goals: profile.goals,
        favorite_module: profile.favorite_module
      });
    }
    setIsEditing(false);
    setSaveError('');
    setSaveSuccess('');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Nya lösenord matchar inte');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('Nytt lösenord måste vara minst 8 tecken långt');
      return;
    }

    const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
    
    if (result.error) {
      setPasswordError(result.error.message);
    } else {
      setPasswordSuccess('Lösenord ändrat framgångsrikt!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordSection(false);
      setTimeout(() => setPasswordSuccess(''), 3000);
    }
  };

  const handlePasswordCancel = () => {
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordError('');
    setPasswordSuccess('');
    setShowPasswordSection(false);
  };

  const joinDate = new Date(user.created_at || Date.now());
  const formattedJoinDate = joinDate.toLocaleDateString('sv-SE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Laddar profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <button
              onClick={onBack}
              className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Tillbaka till kursen
            </button>
            <button
              onClick={onSignOut}
              className="flex items-center text-gray-600 hover:text-gray-700 transition-colors"
            >
              <User className="w-5 h-5 mr-2" />
              Logga ut
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full p-4 w-20 h-20 mx-auto mb-6 shadow-2xl">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Din framgångsprofil
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Följ din resa genom Napoleon Hills principer
          </p>
        </div>

        {/* Success Messages */}
        {saveSuccess && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              {saveSuccess}
            </p>
          </div>
        )}

        {passwordSuccess && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              {passwordSuccess}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            {/* Profile Avatar Section */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full p-6 w-24 h-24 flex items-center justify-center shadow-lg">
                  <User className="w-12 h-12 text-white" />
                </div>
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border-2 border-gray-200 hover:bg-gray-50 transition-colors">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Profilinformation</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Redigera</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Sparar...' : 'Spara'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex items-center space-x-1 bg-gray-600 text-white px-3 py-1 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    <span>Avbryt</span>
                  </button>
                </div>
              )}
            </div>

            {/* Error Messages */}
            {saveError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2 mb-4">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600">{saveError}</p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Användarnamn</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.display_name}
                    onChange={(e) => setEditData({...editData, display_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ditt visningsnamn"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile?.display_name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">E-post</label>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <p className="text-gray-900">{user.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medlem sedan</label>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <p className="text-gray-900">{formattedJoinDate}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Biografi</label>
                {isEditing ? (
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData({...editData, bio: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Berätta om din framgångsresa..."
                  />
                ) : (
                  <p className="text-gray-900">{profile?.bio}</p>
                )}
              </div>

              {/* Password Change Section */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Säkerhet</h3>
                  {!showPasswordSection ? (
                    <button
                      onClick={() => setShowPasswordSection(true)}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Ändra lösenord</span>
                    </button>
                  ) : (
                    <button
                      onClick={handlePasswordCancel}
                      className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Avbryt</span>
                    </button>
                  )}
                </div>

                {showPasswordSection && (
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nuvarande lösenord</label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nytt lösenord</label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                          minLength={8}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bekräfta nytt lösenord</label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                          minLength={8}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {passwordError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2">
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-red-600">{passwordError}</p>
                      </div>
                    )}

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={handlePasswordCancel}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Avbryt
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Uppdatera lösenord
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Success Journey */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Framgångsresa</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nuvarande mål</label>
                {isEditing ? (
                  <textarea
                    value={editData.goals}
                    onChange={(e) => setEditData({...editData, goals: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Beskriv dina nuvarande mål och visioner..."
                  />
                ) : (
                  <div className="flex items-start space-x-2">
                    <Target className="w-4 h-4 text-blue-600 mt-1" />
                    <p className="text-gray-900">{profile?.goals}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Favoritmodul</label>
                {isEditing ? (
                  <select
                    value={editData.favorite_module}
                    onChange={(e) => setEditData({...editData, favorite_module: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Önskans kraft">Önskans kraft</option>
                    <option value="Tro och övertygelse">Tro och övertygelse</option>
                    <option value="Autosuggestion">Autosuggestion</option>
                    <option value="Specialiserad kunskap">Specialiserad kunskap</option>
                    <option value="Kreativ fantasi">Kreativ fantasi</option>
                    <option value="Organiserad planering">Organiserad planering</option>
                    <option value="Uthållighet">Uthållighet</option>
                    <option value="Beslutsamhet">Beslutsamhet</option>
                    <option value="Master Mind">Master Mind</option>
                    <option value="Hjärnan och ditt sinne">Hjärnan och ditt sinne</option>
                    <option value="Transmutation av sexuell energi">Transmutation av sexuell energi</option>
                    <option value="Det sjätte sinnet">Det sjätte sinnet</option>
                    <option value="Rikedomsfilosofin">Rikedomsfilosofin</option>
                  </select>
                ) : (
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <p className="text-gray-900">{profile?.favorite_module}</p>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-medium text-yellow-800">Framgångsmilstolpe</h3>
                </div>
                <p className="text-yellow-700 text-sm">
                  Grattis! Du är en del av de exklusiva första 100 medlemmarna med tillgång till Napoleon Hills AI-hjärna.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Lärframsteg</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center bg-blue-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">13</div>
              <p className="text-sm text-blue-700">Moduler tillgängliga</p>
            </div>
            
            <div className="text-center bg-green-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-green-600 mb-2">{getCompletedWeeksCount()}</div>
              <p className="text-sm text-green-700">Moduler slutförda</p>
            </div>
            
            <div className="text-center bg-purple-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-600 mb-2">{getTotalProgress()}%</div>
              <p className="text-sm text-purple-700">Totalt framsteg</p>
            </div>
          </div>

          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">Nästa steg</h3>
            {getCompletedWeeksCount() === 0 ? (
              <p className="text-gray-600 text-sm">
                Börja med Modul 1: "Önskans kraft" för att påbörja din transformationsresa. 
                Varje modul bygger på den föregående för att skapa bestående förändring.
              </p>
            ) : getCompletedWeeksCount() === 13 ? (
              <p className="text-green-600 text-sm font-semibold">
                🎉 Grattis! Du har slutfört alla 13 moduler. Du har behärskat Napoleon Hills framgångsprinciper!
              </p>
            ) : (
              <p className="text-blue-600 text-sm">
                Fantastiska framsteg! Fortsätt med nästa modul för att fortsätta bygga ditt framgångstankesätt. 
                Du är {getCompletedWeeksCount()}/13 moduler igenom din transformation.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;