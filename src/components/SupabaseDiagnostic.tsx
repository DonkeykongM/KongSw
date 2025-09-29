import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Settings, Database } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

const SupabaseDiagnostic: React.FC = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const hasUrl = supabaseUrl && !supabaseUrl.includes('placeholder');
  const hasKey = supabaseKey && !supabaseKey.includes('placeholder');

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <Database className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Supabase Status</h2>
      </div>

      <div className="space-y-4">
        {/* Overall Status */}
        <div className={`rounded-lg p-4 border-2 ${
          isSupabaseConfigured ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
        }`}>
          <div className="flex items-center space-x-2">
            {isSupabaseConfigured ? (
              <CheckCircle className="w-6 h-6 text-green-500" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500" />
            )}
            <span className={`font-bold ${
              isSupabaseConfigured ? 'text-green-800' : 'text-red-800'
            }`}>
              {isSupabaseConfigured ? '✅ Supabase konfigurerat' : '🚨 Supabase inte konfigurerat'}
            </span>
          </div>
        </div>

        {/* Individual Checks */}
        <div className={`rounded-lg p-4 border ${hasUrl ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-start space-x-3">
            {hasUrl ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">Supabase URL</h3>
              <p className="text-sm text-gray-600 mt-1">
                {hasUrl ? `Konfigurerad: ${supabaseUrl?.substring(0, 30)}...` : 'VITE_SUPABASE_URL saknas eller är placeholder'}
              </p>
            </div>
          </div>
        </div>

        <div className={`rounded-lg p-4 border ${hasKey ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
          <div className="flex items-start space-x-3">
            {hasKey ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">Supabase Anon Key</h3>
              <p className="text-sm text-gray-600 mt-1">
                {hasKey ? `Konfigurerad: ${supabaseKey?.substring(0, 20)}...` : 'VITE_SUPABASE_ANON_KEY saknas eller är placeholder'}
              </p>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        {!isSupabaseConfigured && (
          <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
            <h3 className="font-bold text-blue-800 mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Snabb Setup-guide
            </h3>
            <div className="space-y-3 text-sm text-blue-700">
              <div className="flex items-start space-x-2">
                <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                <div>
                  <p className="font-semibold">Klicka på Settings-ikonen (⚙️) ovanför preview</p>
                  <p className="text-xs text-blue-600">Ikonen finns i det övre högra hörnet av preview-fönstret</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                <div>
                  <p className="font-semibold">Klicka på "Supabase" knappen</p>
                  <p className="text-xs text-blue-600">Detta öppnar Supabase-konfigurationsguiden</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                <div>
                  <p className="font-semibold">Följ instruktionerna för att ansluta ditt Supabase-projekt</p>
                  <p className="text-xs text-blue-600">Detta skapar automatiskt .env-filen med rätt uppgifter</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupabaseDiagnostic;