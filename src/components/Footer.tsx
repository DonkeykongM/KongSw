import React from 'react';
import { Mail, Phone, MapPin, FileText, Shield, Cookie } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-gradient-to-r from-neutral-800 to-neutral-900 text-white py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src="https://j0bzpddd4j.ufs.sh/f/bwjssIq7FWHCTuLlG8ZtZKdCcYS0qzlf2bvOgIJwexGAMR89" alt="KongMindset Logo" className="w-8 h-8" />
              <span className="text-xl font-display font-bold">KongMindset</span>
            </div>
            <p className="text-neutral-300 text-sm leading-relaxed">
              Transformera ditt tankesätt och bygga rikedom med Napoleon Hills tidlösa principer. 
              Bemästra de 13 framgångsprinciperna från "Tänk och Bli Rik."
            </p>
            <div className="text-neutral-400 text-sm">
              <p>KongMindset AB</p>
              <p>Org.nr: 559123-4567</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Snabblänkar</h3>
            <ul className="space-y-2">
              {[
                { id: 'home', label: 'Hem' },
                { id: 'modules', label: 'Kursmoduler' },
                { id: 'resources', label: 'Resurser' },
                { id: 'contact', label: 'Kontakt' }
              ].map(link => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate?.(link.id)}
                    className="text-neutral-300 hover:text-white text-sm transition-colors duration-200 text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Juridiskt</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate?.('privacy-policy')}
                  className="text-neutral-300 hover:text-white text-sm transition-colors duration-200 flex items-center space-x-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>Integritetspolicy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('cookie-policy')}
                  className="text-neutral-300 hover:text-white text-sm transition-colors duration-200 flex items-center space-x-2"
                >
                  <Cookie className="w-4 h-4" />
                  <span>Cookie-policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('terms-of-service')}
                  className="text-neutral-300 hover:text-white text-sm transition-colors duration-200 flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Användarvillkor</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Kontakta oss</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-neutral-300 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:support@kongmindset.se" className="hover:text-white transition-colors">
                  support@kongmindset.se
                </a>
              </div>
              <div className="flex items-center space-x-2 text-neutral-300 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+46812345678" className="hover:text-white transition-colors">
                  +46 8 123 456 78
                </a>
              </div>
              <div className="flex items-start space-x-2 text-neutral-300 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p>Framgångsgatan 123</p>
                  <p>123 45 Stockholm</p>
                  <p>Sverige</p>
                </div>
              </div>
            </div>
            
            <div className="text-neutral-400 text-sm">
              <p className="font-semibold">Supporttider:</p>
              <p>Mån-Fre: 09:00-18:00 CET</p>
              <p>Lör: 10:00-16:00 CET</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-neutral-300 text-sm">
              &copy; {new Date().getFullYear()} KongMindset AB. Alla rättigheter förbehållna.
            </p>
            
            <div className="flex space-x-6 text-neutral-300 text-sm">
              <span>🇸🇪 Sverige</span>
              <span>💳 Säkra betalningar</span>
              <span>🛡️ GDPR-kompatibel</span>
            </div>
          </div>
          
          <div className="mt-4 text-center text-neutral-400 text-xs">
            <p>
              KongMindset bygger på Napoleon Hills klassiska verk "Think and Grow Rich" (1937) som är i public domain. 
              Vårt kursinnehåll och AI-mentor är originalverk skyddade av upphovsrätt.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;