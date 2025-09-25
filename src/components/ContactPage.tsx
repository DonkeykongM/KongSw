import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';

interface ContactPageProps {
  onBack: () => void;
  onSignOut: () => Promise<{ error: any }>;
}

const ContactPage: React.FC<ContactPageProps> = ({ onBack, onSignOut }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    // Validate form
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Vänligen fyll i alla obligatoriska fält');
      setSubmitting(false);
      return;
    }

    // Simulate form submission (in real app, this would send to your backend)
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Ett fel uppstod. Försök igen senare.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Tillbaka till kursen</span>
            </button>
            <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent">Kontakta oss</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-primary-800 mb-4">Kom i kontakt</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Har du frågor om vår Tänk och Bli Rik-kurs? Behöver teknisk support? Vi är här för att hjälpa dig på din resa till framgång.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-display font-semibold text-primary-800 mb-6">Kontaktinformation</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary-100 p-3 rounded-full">
                      <Mail className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-neutral-800">E-post</p>
                      <p className="text-neutral-600">support@kongmindset.com</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-display font-semibold text-primary-800 mb-6">Skicka oss ett meddelande</h3>
              
              {/* Success Message */}
              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start space-x-2 mb-6">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-green-600 font-medium">Meddelande skickat!</p>
                    <p className="text-sm text-green-700">Vi svarar inom 24 timmar</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2 mb-6">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                    Ditt namn *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Ange ditt fullständiga namn"
                     autoComplete="name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                    E-postadress *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Ange din e-postadress"
                     autoComplete="email"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-2">
                    Ämne
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={submitting}
                    className="w-full border-2 border-gray-500 rounded-md bg-white text-black disabled:opacity-50"
                    style={{ 
                      fontSize: '16px',
                      minHeight: '48px',
                      padding: '12px 16px',
                      WebkitAppearance: 'menulist',
                      MozAppearance: 'menulist',
                      appearance: 'menulist',
                      position: 'relative',
                      zIndex: 999
                    }}
                  >
                    <option value="">Välj ämne</option>
                    <option value="course-question">Kursfråga</option>
                    <option value="technical-support">Teknisk support</option>
                    <option value="billing">Fakturering/betalning</option>
                    <option value="feature-request">Funktionsförfrågan</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Annat</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                    Meddelande *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Beskriv din fråga eller ditt bekymmer i detalj..."
                     maxLength={2000}
                  />
                   <div className="text-right text-sm text-gray-500 mt-1">
                     {formData.message.length}/2000 tecken
                   </div>
                </div>

                 {/* GDPR Consent */}
                 <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                   <div className="flex items-start space-x-3">
                     <input
                       type="checkbox"
                       id="gdpr-consent"
                       required
                       disabled={submitting}
                       className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                     />
                     <label htmlFor="gdpr-consent" className="text-sm text-blue-800 cursor-pointer">
                       Jag samtycker till att KongMindset behandlar mina personuppgifter enligt vår{' '}
                       <button
                         type="button"
                         className="underline hover:no-underline font-medium"
                         onClick={() => window.open('#privacy-policy', '_blank')}
                       >
                         integritetspolicy
                       </button>
                       . Uppgifterna används endast för att svara på din förfrågan. *
                     </label>
                   </div>
                 </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[48px]"
                >
                  <Send className="w-5 h-5" />
                  <span>{submitting ? 'Skickar...' : 'Skicka meddelande'}</span>
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-500">
                <p className="mb-2">* Obligatoriska fält</p>
                <div className="space-y-1">
                  <p>📧 Vi svarar vanligtvis inom 24 timmar</p>
                  <p>🔒 Dina uppgifter behandlas säkert enligt GDPR</p>
                  <p>🇸🇪 Support på svenska och engelska</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;