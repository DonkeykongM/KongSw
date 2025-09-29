import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Settings, Database, Zap, RefreshCw } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface DiagnosticResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  action?: string;
}

const SupabaseDiagnostic: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    const results: DiagnosticResult[] = [];

    // Check 1: Environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      results.push({
        name: 'Supabase URL',
        status: 'error',
        message: 'VITE_SUPABASE_URL saknas eller är placeholder',
        action: 'Konfigurera Supabase-anslutning'
      });
    } else {
      results.push({
        name: 'Supabase URL',
        status: 'success',
        message: `Konfigurerad: ${supabaseUrl.substring(0, 30)}...`
      });
    }

    if (!supabaseKey || supabaseKey.includes('placeholder')) {
      results.push({
        name: 'Supabase Anon Key',
        status: 'error',
        message: 'VITE_SUPABASE_ANON_KEY saknas eller är placeholder',
        action: 'Konfigurera Supabase-anslutning'
      });
    } else {
      results.push({
        name: 'Supabase Anon Key',
        status: 'success',
        message: `Konfigurerad: ${supabaseKey.substring(0, 20)}...`
      });
    }

    // Check 2: Supabase connection
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('simple_logins').select('count').limit(1);
        if (error) {
          results.push({
            name: 'Databas-anslutning',
            status: 'error',
            message: `Databasfel: ${error.message}`,
            action: 'Kontrollera databas-schema'
          });
        } else {
          results.push({
            name: 'Databas-anslutning',
            status: 'success',
            message: 'Anslutning till databas fungerar'
          });
        }
      } catch (err: any) {
        results.push({
          name: 'Databas-anslutning',
          status: 'error',
          message: `Anslutningsfel: ${err.message}`,
          action: 'Kontrollera nätverksanslutning'
        });
      }

      // Check 3: Webhook functions
      try {
        const webhookUrl = `https://acdwexqoonauzzjtoexx.supabase.co/functions/v1/stripe-webhook`;
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({ test: true })
        });

        if (response.status === 404) {
          results.push({
            name: 'Stripe Webhook',
            status: 'error',
            message: 'Webhook-funktion inte distribuerad',
            action: 'Distribuera Edge Functions till Supabase'
          });
        } else {
          results.push({
            name: 'Stripe Webhook',
            status: 'success',
            message: 'Webhook-funktion tillgänglig'
          });
        }
      } catch (err) {
        results.push({
          name: 'Stripe Webhook',
          status: 'warning',
          message: 'Kunde inte testa webhook (kan vara normalt)',
          action: 'Kontrollera manuellt i Supabase'
        });
      }

      // Check 4: Checkout function
      try {
        const checkoutUrl = `https://acdwexqoonauzzjtoexx.supabase.co/functions/v1/stripe-checkout`;
        const response = await fetch(checkoutUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({ test: true })
        });

        if (response.status === 404) {
          results.push({
            name: 'Stripe Checkout',
            status: 'error',
            message: 'Checkout-funktion inte distribuerad',
            action: 'Distribuera Edge Functions till Supabase'
          });
        } else {
          results.push({
            name: 'Stripe Checkout',
            status: 'success',
            message: 'Checkout-funktion tillgänglig'
          });
        }
      } catch (err) {
        results.push({
          name: 'Stripe Checkout',
          status: 'warning',
          message: 'Kunde inte testa checkout (kan vara normalt)',
          action: 'Kontrollera manuellt i Supabase'
        });
      }
    } else {
      results.push({
        name: 'Supabase-konfiguration',
        status: 'error',
        message: 'Supabase inte konfigurerat',
        action: 'Konfigurera Supabase-anslutning'
      });
    }

    setDiagnostics(results);
    setLoading(false);
  };

  const testLogin = async () => {
    setTesting(true);
    try {
      // Test with demo credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@kongmindset.se',
        password: 'Test123!'
      });

      if (error) {
        alert(`Inloggningstest misslyckades: ${error.message}`);
      } else {
        alert('✅ Inloggningstest lyckades! Systemet fungerar.');
        // Sign out immediately
        await supabase.auth.signOut();
      }
    } catch (err: any) {
      alert(`Inloggningstest fel: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const hasErrors = diagnostics.some(d => d.status === 'error');
  const hasWarnings = diagnostics.some(d => d.status === 'warning');

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Database className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Supabase System Diagnostik</h2>
        </div>
        <button
          onClick={runDiagnostics}
          disabled={loading}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Uppdatera</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Kontrollerar systemkonfiguration...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Overall Status */}
          <div className={`rounded-lg p-4 border-2 ${
            hasErrors ? 'bg-red-50 border-red-300' : 
            hasWarnings ? 'bg-yellow-50 border-yellow-300' : 
            'bg-green-50 border-green-300'
          }`}>
            <div className="flex items-center space-x-2">
              {hasErrors ? (
                <XCircle className="w-6 h-6 text-red-500" />
              ) : hasWarnings ? (
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-500" />
              )}
              <span className={`font-bold ${
                hasErrors ? 'text-red-800' : 
                hasWarnings ? 'text-yellow-800' : 
                'text-green-800'
              }`}>
                {hasErrors ? '🚨 Systemfel upptäckta' : 
                 hasWarnings ? '⚠️ Varningar upptäckta' : 
                 '✅ Alla system fungerar'}
              </span>
            </div>
          </div>

          {/* Individual Checks */}
          {diagnostics.map((diagnostic, index) => (
            <div key={index} className={`rounded-lg p-4 border ${getStatusColor(diagnostic.status)}`}>
              <div className="flex items-start space-x-3">
                {getStatusIcon(diagnostic.status)}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{diagnostic.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{diagnostic.message}</p>
                  {diagnostic.action && (
                    <p className="text-sm font-medium text-blue-600 mt-2">
                      👉 {diagnostic.action}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Setup Instructions */}
          {hasErrors && (
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
                <div className="flex items-start space-x-2">
                  <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                  <div>
                    <p className="font-semibold">Klicka "Uppdatera" ovan för att testa anslutningen</p>
                    <p className="text-xs text-blue-600">Diagnostiken kommer att visa om allt fungerar</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Test Login Button */}
          {isSupabaseConfigured && (
            <div className="text-center pt-4 border-t">
              <button
                onClick={testLogin}
                disabled={testing}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 inline-flex items-center space-x-2"
              >
                <Zap className="w-5 h-5" />
                <span>{testing ? 'Testar inloggning...' : 'Testa inloggning'}</span>
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Testar med demo-uppgifter: test@kongmindset.se
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SupabaseDiagnostic;