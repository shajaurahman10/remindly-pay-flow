import React, { useState } from 'react';
import { Save, MessageSquare, CreditCard, Bell, Globe, Key } from 'lucide-react';
import { toast } from 'sonner';

interface SettingsState {
  reminderTemplate: string;
  paymentGateway: 'razorpay' | 'stripe';
  razorpayKeyId: string;
  razorpayKeySecret: string;
  stripePublishableKey: string;
  stripeSecretKey: string;
  whatsappToken: string;
  whatsappPhoneId: string;
  businessName: string;
  businessPhone: string;
  businessEmail: string;
  autoReminders: boolean;
  reminderDays: number[];
}

const Settings = () => {
  const [settings, setSettings] = useState<SettingsState>({
    reminderTemplate: 'Hi {{clientName}}, this is a reminder for your pending payment of {{amount}}. Due date: {{dueDate}}. Please pay here: {{paymentLink}}',
    paymentGateway: 'razorpay',
    razorpayKeyId: '',
    razorpayKeySecret: '',
    stripePublishableKey: '',
    stripeSecretKey: '',
    whatsappToken: '',
    whatsappPhoneId: '',
    businessName: '',
    businessPhone: '',
    businessEmail: '',
    autoReminders: true,
    reminderDays: [1, 3, 7],
  });

  const handleSave = () => {
    // TODO: Save settings to backend
    toast.success('Settings saved successfully!');
  };

  const handleTemplateChange = (value: string) => {
    setSettings(prev => ({ ...prev, reminderTemplate: value }));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Configure your WhatsApp reminders and payment settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WhatsApp Settings */}
        <div className="glass-effect p-6 rounded-xl">
          <div className="flex items-center mb-4">
            <MessageSquare className="w-5 h-5 text-green-400 mr-2" />
            <h2 className="text-xl font-semibold text-white">WhatsApp Configuration</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                WhatsApp Business API Token
              </label>
              <input
                type="password"
                value={settings.whatsappToken}
                onChange={(e) => setSettings(prev => ({ ...prev, whatsappToken: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your WhatsApp API token"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number ID
              </label>
              <input
                type="text"
                value={settings.whatsappPhoneId}
                onChange={(e) => setSettings(prev => ({ ...prev, whatsappPhoneId: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your phone number ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message Template
              </label>
              <textarea
                value={settings.reminderTemplate}
                onChange={(e) => handleTemplateChange(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your reminder message template"
              />
              <p className="text-xs text-gray-400 mt-1">
                Use {`{{clientName}}, {{amount}}, {{dueDate}}, {{paymentLink}}`} as placeholders
              </p>
              
              {settings.reminderTemplate && (
                <div className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <h3 className="text-green-400 font-medium mb-2">Template Preview</h3>
                  <p className="text-sm text-gray-300">
                    {settings.reminderTemplate
                      .replace(/\{\{clientName\}\}/g, 'John Doe')
                      .replace(/\{\{amount\}\}/g, '₹15,000')
                      .replace(/\{\{paymentLink\}\}/g, 'https://pay.example.com/abc123')
                      .replace(/\{\{dueDate\}\}/g, '15 Jan 2024')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Gateway Settings */}
        <div className="glass-effect p-6 rounded-xl">
          <div className="flex items-center mb-4">
            <CreditCard className="w-5 h-5 text-blue-400 mr-2" />
            <h2 className="text-xl font-semibold text-white">Payment Gateway</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Payment Gateway
              </label>
              <select
                value={settings.paymentGateway}
                onChange={(e) => setSettings(prev => ({ ...prev, paymentGateway: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="razorpay">Razorpay (India)</option>
                <option value="stripe">Stripe (Global)</option>
              </select>
            </div>

            {settings.paymentGateway === 'razorpay' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Razorpay Key ID
                  </label>
                  <input
                    type="text"
                    value={settings.razorpayKeyId}
                    onChange={(e) => setSettings(prev => ({ ...prev, razorpayKeyId: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="rzp_test_..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Razorpay Key Secret
                  </label>
                  <input
                    type="password"
                    value={settings.razorpayKeySecret}
                    onChange={(e) => setSettings(prev => ({ ...prev, razorpayKeySecret: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter Razorpay secret key"
                  />
                </div>
              </>
            )}

            {settings.paymentGateway === 'stripe' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stripe Publishable Key
                  </label>
                  <input
                    type="text"
                    value={settings.stripePublishableKey}
                    onChange={(e) => setSettings(prev => ({ ...prev, stripePublishableKey: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="pk_test_..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stripe Secret Key
                  </label>
                  <input
                    type="password"
                    value={settings.stripeSecretKey}
                    onChange={(e) => setSettings(prev => ({ ...prev, stripeSecretKey: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="sk_test_..."
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Business Information */}
        <div className="glass-effect p-6 rounded-xl">
          <div className="flex items-center mb-4">
            <Globe className="w-5 h-5 text-purple-400 mr-2" />
            <h2 className="text-xl font-semibold text-white">Business Information</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Business Name
              </label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) => setSettings(prev => ({ ...prev, businessName: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Your Business Name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Business Phone
              </label>
              <input
                type="tel"
                value={settings.businessPhone}
                onChange={(e) => setSettings(prev => ({ ...prev, businessPhone: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="+91 9876543210"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Business Email
              </label>
              <input
                type="email"
                value={settings.businessEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, businessEmail: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="business@example.com"
              />
            </div>
          </div>
        </div>

        {/* Reminder Settings */}
        <div className="glass-effect p-6 rounded-xl">
          <div className="flex items-center mb-4">
            <Bell className="w-5 h-5 text-yellow-400 mr-2" />
            <h2 className="text-xl font-semibold text-white">Reminder Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Auto Reminders</h3>
                <p className="text-sm text-gray-400">Automatically send reminders on due dates</p>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, autoReminders: !prev.autoReminders }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoReminders ? 'bg-primary-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.autoReminders ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reminder Days (before due date)
              </label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 5, 7, 14].map(day => (
                  <button
                    key={day}
                    onClick={() => {
                      const newDays = settings.reminderDays.includes(day)
                        ? settings.reminderDays.filter(d => d !== day)
                        : [...settings.reminderDays, day];
                      setSettings(prev => ({ ...prev, reminderDays: newDays }));
                    }}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      settings.reminderDays.includes(day)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {day} day{day > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
