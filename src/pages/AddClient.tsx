
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Phone, DollarSign, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const AddClient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    amount: '',
    dueDate: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.amount || !formData.dueDate) {
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

    // Validate due date
    if (new Date(formData.dueDate) < new Date()) {
      toast.error('Due date cannot be in the past');
      return;
    }

    setLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Client added successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to add client');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
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
    // Remove all non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    // Add country code if not present and number is 10 digits
    if (numericValue.length === 10 && !numericValue.startsWith('91')) {
      return '+91 ' + numericValue;
    }
    
    // Format existing number
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
    <div className="p-6 max-w-2xl mx-auto">
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
          <p className="text-gray-400 mt-1">Create a new client and set up payment reminders</p>
        </div>
      </div>

      {/* Form */}
      <div className="glass-effect p-8 rounded-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <p className="text-xs text-gray-500 mt-1">
              Include country code for international numbers
            </p>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>Amount (₹)</span>
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

          {/* Due Date */}
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-300 mb-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Due Date</span>
                <span className="text-red-400">*</span>
              </div>
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              required
            />
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
                  Add Client
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Info Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-effect p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-3">What happens next?</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Client will be added to your dashboard</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Automated reminders will be scheduled</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Payment link will be generated</span>
            </li>
          </ul>
        </div>

        <div className="glass-effect p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-3">Reminder Schedule</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>3 days before due date</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>1 day before due date</span>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>On due date</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddClient;
