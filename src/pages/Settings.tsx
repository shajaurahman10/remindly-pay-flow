import React, { useState } from 'react';
import { Save, MessageSquare, CreditCard, Bell, Globe, Key } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const [settings, setSettings] = useState({
    // WhatsApp Settings
    whatsappToken: '',
    phoneNumberId: '',
    
    // Payment Settings
    razorpayKeyId: '',
    razorpayKeySecret: '',
    stripePublishableKey: '',
    stripeSecretKey: '',
    paymentProvider: 'razorpay',
    
    // Message Templates
    reminderTemplate: 'Hi {{clientName}}, this is a reminder for your pending payment of ₹{{amount}}. Please pay here: {{paymentLink}}.',
    confirmationTemplate: 'Hi {{clientName}}, we have received your payment of ₹{{amount}}. Thank you!',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    webhookUrl: '',
    
    // Business Info
    businessName: '',
    businessPhone: '',
    businessEmail: '',
    businessWebsite: '',
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('whatsapp');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare },
    { id: 'payment', name: 'Payment', icon: CreditCard },
    { id: 'templates', name: 'Templates', icon: MessageSquare },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'business', name: 'Business', icon: Globe },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Configure your application settings and integrations</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="glass-effect rounded-xl p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary-600/20 text-primary-300 border border-primary-500/30'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <div className="glass-effect rounded-xl p-8">
              {/* WhatsApp Settings */}
              {activeTab === 'whatsapp' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-4">WhatsApp Cloud API</h2>
                    <p className="text-gray-400 mb-6">Configure your Meta WhatsApp Cloud API credentials</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      WhatsApp Access Token
                    </label>
                    <input
                      type="password"
                      name="whatsappToken"
                      value={settings.whatsappToken}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your WhatsApp access token"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Get this from your Meta for Developers console
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number ID
                    </label>
                    <input
                      type="text"
                      name="phoneNumberId"
                      value={settings.phoneNumberId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your phone number ID"
                    />
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <h3 className="text-blue-400 font-medium mb-2">Setup Instructions</h3>
                    <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                      <li>Go to Meta for Developers console</li>
                      <li>Create a WhatsApp Business app</li>
                      <li>Get your access token and phone number ID</li>
                      <li>Add your webhook URL for message status updates</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* Payment Settings */}
              {activeTab === 'payment' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Payment Gateway</h2>
                    <p className="text-gray-400 mb-6">Configure your payment processing settings</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Payment Provider
                    </label>
                    <select
                      name="paymentProvider"
                      value={settings.paymentProvider}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="razorpay">Razorpay (India)</option>
                      <option value="stripe">Stripe (Global)</option>
                    </select>
                  </div>

                  {settings.paymentProvider === 'razorpay' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Razorpay Key ID
                        </label>
                        <input
                          type="text"
                          name="razorpayKeyId"
                          value={settings.razorpayKeyId}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="rzp_test_..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Razorpay Key Secret
                        </label>
                        <input
                          type="password"
                          name="razorpayKeySecret"
                          value={settings.razorpayKeySecret}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Enter your Razorpay secret key"
                        />
                      </div>
                    </>
                  )}

                  {settings.paymentProvider === 'stripe' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Stripe Publishable Key
                        </label>
                        <input
                          type="text"
                          name="stripePublishableKey"
                          value={settings.stripePublishableKey}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="pk_test_..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Stripe Secret Key
                        </label>
                        <input
                          type="password"
                          name="stripeSecretKey"
                          value={settings.stripeSecretKey}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="sk_test_..."
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Message Templates */}
              {activeTab === 'templates' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Message Templates</h2>
                    <p className="text-gray-400 mb-6">Customize your WhatsApp message templates</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Payment Reminder Template
                    </label>
                    <textarea
                      name="reminderTemplate"
                      value={settings.reminderTemplate}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your reminder template"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Use variables: {{clientName}}, {{amount}}, {{paymentLink}}, {{dueDate}}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Payment Confirmation Template
                    </label>
                    <textarea
                      name="confirmationTemplate"
                      value={settings.confirmationTemplate}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your confirmation template"
                    />
                  </div>

                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                    <h3 className="text-green-400 font-medium mb-2">Template Preview</h3>
                    <p className="text-sm text-gray-300">
                      {settings.reminderTemplate
                        .replace(/\{\{clientName\}\}/g, 'John Doe')
                        .replace(/\{\{amount\}\}/g, '₹15,000')
                        .replace(/\{\{paymentLink\}\}/g, 'https://pay.example.com/abc123')
                        .replace(/\{\{dueDate\}\}/g, '15 Jan 2024')}
                    </p>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Notification Settings</h2>
                    <p className="text-gray-400 mb-6">Configure how you receive notifications</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                      <div>
                        <h3 className="text-white font-medium">Email Notifications</h3>
                        <p className="text-gray-400 text-sm">Receive payment updates via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="emailNotifications"
                          checked={settings.emailNotifications}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                      <div>
                        <h3 className="text-white font-medium">SMS Notifications</h3>
                        <p className="text-gray-400 text-sm">Receive critical alerts via SMS</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="smsNotifications"
                          checked={settings.smsNotifications}
                          onChange={handleChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Webhook URL (Optional)
                    </label>
                    <input
                      type="url"
                      name="webhookUrl"
                      value={settings.webhookUrl}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="https://your-app.com/webhook"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Receive payment status updates at this URL
                    </p>
                  </div>
                </div>
              )}

              {/* Business Settings */}
              {activeTab === 'business' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-4">Business Information</h2>
                    <p className="text-gray-400 mb-6">Update your business details for invoices and messages</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Business Name
                      </label>
                      <input
                        type="text"
                        name="businessName"
                        value={settings.businessName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter your business name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Business Phone
                      </label>
                      <input
                        type="tel"
                        name="businessPhone"
                        value={settings.businessPhone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="+91 9876543210"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Business Email
                      </label>
                      <input
                        type="email"
                        name="businessEmail"
                        value={settings.businessEmail}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="business@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        name="businessWebsite"
                        value={settings.businessWebsite}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="https://www.example.com"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end pt-6 border-t border-gray-700 mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    'Saving...'
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
