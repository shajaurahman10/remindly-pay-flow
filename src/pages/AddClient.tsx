
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Phone, DollarSign, Calendar, Upload, CreditCard, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

interface PaymentOption {
  id: string;
  label: string;
  enabled: boolean;
}

const AddClient = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    amount: '',
    startDate: '',
    endDate: '',
    upiId: '',
    notes: '',
    autoGenerateRazorpay: true,
  });
  
  const [paymentOptions, setPaymentOptions] = useState<PaymentOption[]>([
    { id: 'upi', label: 'UPI via GPay / PhonePe / Paytm', enabled: true },
    { id: 'bank', label: 'Bank Transfer', enabled: false },
    { id: 'cash', label: 'Cash', enabled: false },
  ]);
  
  const [qrCode, setQrCode] = useState<File | null>(null);
  const [qrCodePreview, setQrCodePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentOptionChange = (id: string) => {
    setPaymentOptions(prev => 
      prev.map(option => 
        option.id === id ? { ...option, enabled: !option.enabled } : option
      )
    );
  };

  const handleQrCodeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file');
        return;
      }
      
      setQrCode(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setQrCodePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateRazorpayLink = async (amount: string, clientName: string) => {
    // TODO: Replace with actual Razorpay API call
    // This would typically call your backend to create a payment link
    try {
      const response = await fetch('/api/create-payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount) * 100, // Razorpay expects amount in paise
          currency: 'INR',
          customer: {
            name: clientName,
            contact: formData.phone,
          },
          notify: {
            sms: true,
            email: false,
          },
          reminder_enable: true,
          notes: {
            created_by: user?.email || '',
            client_id: `client_${Date.now()}`,
          },
        }),
      });
      
      const data = await response.json();
      return data.short_url;
    } catch (error) {
      console.error('Error creating Razorpay link:', error);
      return `https://rzp.io/l/mock_${Date.now()}`;
    }
  };

  const uploadQrCode = async (file: File): Promise<string> => {
    // TODO: Replace with actual file upload logic (Firebase Storage, etc.)
    const formData = new FormData();
    formData.append('qr_code', file);
    
    try {
      const response = await fetch('/api/upload-qr', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Error uploading QR code:', error);
      return `https://example.com/qr/${Date.now()}.jpg`;
    }
  };

  const scheduleWhatsAppReminder = async (clientData: any) => {
    // TODO: Replace with actual WhatsApp API integration
    try {
      const response = await fetch('/api/schedule-reminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: clientData.id,
          phone: clientData.phone,
          amount: clientData.amount,
          startDate: clientData.startDate,
          endDate: clientData.endDate,
          upiId: clientData.upiId,
          razorpayLink: clientData.razorpayLink,
          qrCodeUrl: clientData.qrCodeUrl,
        }),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error scheduling WhatsApp reminder:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.amount || !formData.startDate || !formData.endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate phone number format
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      toast.error('Please enter a valid phone number');
      return;
    }

    // Validate amount
    if (isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Validate dates
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    if (startDate >= endDate) {
      toast.error('End date must be after start date');
      return;
    }

    // Check if at least one payment option is selected
    const hasSelectedPayment = paymentOptions.some(option => option.enabled);
    if (!hasSelectedPayment) {
      toast.error('Please select at least one payment option');
      return;
    }

    // Validate UPI ID if UPI payment is enabled
    const upiEnabled = paymentOptions.find(option => option.id === 'upi')?.enabled;
    if (upiEnabled && !formData.upiId) {
      toast.error('Please enter UPI ID for UPI payments');
      return;
    }

    setLoading(true);
    try {
      let razorpayLink = '';
      let qrCodeUrl = '';
      
      // Generate Razorpay payment link if enabled
      if (formData.autoGenerateRazorpay) {
        razorpayLink = await generateRazorpayLink(formData.amount, formData.name);
      }
      
      // Upload QR code if provided
      if (qrCode) {
        qrCodeUrl = await uploadQrCode(qrCode);
      }
      
      // Create client record
      const clientData = {
        id: `client_${Date.now()}`,
        userId: user?.uid || user?.id,
        name: formData.name,
        phone: formData.phone,
        amount: Number(formData.amount),
        startDate: formData.startDate,
        endDate: formData.endDate,
        paymentOptions: paymentOptions.filter(option => option.enabled),
        upiId: formData.upiId,
        razorpayLink,
        qrCodeUrl,
        notes: formData.notes,
        status: 'pending',
        reminderSent: false,
        createdAt: new Date().toISOString(),
      };
      
      // TODO: Save client to database
      console.log('Saving client:', clientData);
      
      // Schedule WhatsApp reminder
      await scheduleWhatsAppReminder(clientData);
      
      toast.success('Client added successfully! WhatsApp reminder scheduled.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Failed to add client. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    return numericValue;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setFormData(prev => ({
      ...prev,
      amount: formatted
    }));
  };

  const formatPhoneNumber = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue.length === 10 && !numericValue.startsWith('91')) {
      return '+91 ' + numericValue;
    }
    if (numericValue.startsWith('91') && numericValue.length === 12) {
      return '+91 ' + numericValue.slice(2);
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      phone: formatted
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Add New Client</h1>
          <p className="text-gray-400 mt-1">Create a new client with automated payment reminders</p>
        </div>
      </div>

      {/* Form */}
      <div className="glass-effect p-8 rounded-xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Client Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Client Name</span>
                  <span className="text-red-400">*</span>
                </div>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter client's full name"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Phone Number</span>
                  <span className="text-red-400">*</span>
                </div>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="+91 9876543210"
                required
              />
            </div>
          </div>

          {/* Amount and Payment Window */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Amount Due (₹)</span>
                  <span className="text-red-400">*</span>
                </div>
              </label>
              <input
                type="text"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleAmountChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="15000.00"
                required
              />
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Start Date (Reminder)</span>
                  <span className="text-red-400">*</span>
                </div>
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>End Date (Deadline)</span>
                  <span className="text-red-400">*</span>
                </div>
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Payment Options */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Payment Options <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {paymentOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={option.id}
                    checked={option.enabled}
                    onChange={() => handlePaymentOptionChange(option.id)}
                    className="w-4 h-4 text-primary-600 bg-gray-800 border-gray-700 rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <label htmlFor={option.id} className="text-sm text-gray-300">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* UPI ID */}
          {paymentOptions.find(option => option.id === 'upi')?.enabled && (
            <div>
              <label htmlFor="upiId" className="block text-sm font-medium text-gray-300 mb-2">
                UPI ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="upiId"
                name="upiId"
                value={formData.upiId}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="9876543210@okaxis"
                required
              />
            </div>
          )}

          {/* QR Code Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <div className="flex items-center space-x-2">
                <QrCode className="w-4 h-4" />
                <span>Upload QR Code (Optional)</span>
              </div>
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleQrCodeUpload}
                className="hidden"
                id="qr-upload"
              />
              <label
                htmlFor="qr-upload"
                className="flex items-center px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white hover:bg-gray-600 cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose QR Code
              </label>
              {qrCodePreview && (
                <div className="flex items-center space-x-2">
                  <img src={qrCodePreview} alt="QR Code Preview" className="w-12 h-12 rounded-lg" />
                  <span className="text-sm text-green-400">QR Code uploaded</span>
                </div>
              )}
            </div>
          </div>

          {/* Razorpay Integration */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="autoGenerateRazorpay"
              checked={formData.autoGenerateRazorpay}
              onChange={(e) => setFormData(prev => ({ ...prev, autoGenerateRazorpay: e.target.checked }))}
              className="w-4 h-4 text-primary-600 bg-gray-800 border-gray-700 rounded focus:ring-primary-500 focus:ring-2"
            />
            <label htmlFor="autoGenerateRazorpay" className="text-sm text-gray-300 flex items-center">
              <CreditCard className="w-4 h-4 mr-2" />
              Auto-generate Razorpay UPI Payment Link
            </label>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="Any additional information about this client or payment..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                'Adding Client...'
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Add Client & Schedule Reminder
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Info Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-effect p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-3">WhatsApp Reminder Features</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Automatic reminder on start date</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Multiple payment options included</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Razorpay payment tracking</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>QR code sharing support</span>
            </li>
          </ul>
        </div>

        <div className="glass-effect p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-3">Payment Integration</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Real-time payment status updates</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Automatic webhook processing</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Secure payment link generation</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Dashboard status monitoring</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddClient;
