import React from 'react';
import { AlertTriangle, Settings } from 'lucide-react';

const SupabaseDiagnostic: React.FC = () => {
  return (
    <div className="bg-yellow-50 rounded-xl shadow-lg border-2 border-yellow-300 p-6 mb-8">
      <div className="flex items-center space-x-3 mb-4">
        <AlertTriangle className="w-6 h-6 text-yellow-600" />
        <h2 className="text-xl font-bold text-yellow-800">Supabase krävs</h2>
      </div>
      
      <div className="text-yellow-700 space-y-3">
        <p>För att använda inloggning och köpfunktioner behöver Supabase konfigureras:</p>
        
        <div className="bg-yellow-100 rounded-lg p-4">
          <h3 className="font-bold text-yellow-800 mb-2 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Snabb Setup:
          </h3>
          <ol className="space-y-2 text-sm text-yellow-800">
            <li>1. Klicka på Settings-ikonen (⚙️) ovanför preview</li>
            <li>2. Klicka på "Supabase" knappen</li>
            <li>3. Följ instruktionerna för att ansluta ditt projekt</li>
            <li>4. Ladda om sidan</li>
          </ol>
        </div>
        
        <p className="text-sm">
          <strong>Demo-läge:</strong> Du kan fortfarande se kursmaterialet, men inloggning och köp fungerar inte.
        </p>
      </div>
    </div>
  );
};

export default SupabaseDiagnostic;