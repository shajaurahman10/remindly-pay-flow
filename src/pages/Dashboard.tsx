
import React, { useState, useEffect } from 'react';
import { Plus, Users, Clock, CheckCircle, AlertCircle, Search, Filter, Send, CreditCard, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePaymentTracking } from '../hooks/usePaymentTracking';
import { createWhatsAppService } from '../services/whatsappService';
import { toast } from 'sonner';

interface Client {
  id: string;
  userId: string;
  name: string;
  phone: string;
  amount: number;
  startDate: string;
  endDate: string;
  paymentOptions: Array<{ id: string; label: string; enabled: boolean }>;
  upiId?: string;
  razorpayLink?: string;
  qrCodeUrl?: string;
  status: 'pending' | 'paid' | 'overdue';
  reminderSent: boolean;
  lastReminder?: string;
  createdAt: string;
  notes?: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { paymentUpdates, getLatestPaymentUpdate } = usePaymentTracking();
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserClients = async () => {
      if (!user) return;
      
      try {
        // TODO: Replace with actual API call to fetch user's clients
        // const response = await fetch(`/api/clients?userId=${user.id}`);
        // const userClients = await response.json();
        // setClients(userClients);
        
        // For now, set empty array since we're removing hardcoded data
        setClients([]);
      } catch (error) {
        console.error('Error fetching clients:', error);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserClients();
  }, [user]);

  // Update client status when payment updates are received
  useEffect(() => {
    if (paymentUpdates.length > 0) {
      const latestUpdate = paymentUpdates[paymentUpdates.length - 1];
      
      setClients(prev => prev.map(client => {
        if (client.id === latestUpdate.clientId) {
          return {
            ...client,
            status: latestUpdate.status === 'paid' ? 'paid' : client.status,
          };
        }
        return client;
      }));
    }
  }, [paymentUpdates]);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalClients: clients.length,
    pendingPayments: clients.filter(c => c.status === 'pending').length,
    overduePayments: clients.filter(c => c.status === 'overdue').length,
    totalPending: clients.filter(c => c.status === 'pending' || c.status === 'overdue').reduce((sum, c) => sum + c.amount, 0),
    totalPaid: clients.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0),
  };

  const sendManualReminder = async (client: Client) => {
    try {
      // TODO: Get WhatsApp credentials from settings
      const whatsappToken = 'your_whatsapp_token';
      const phoneNumberId = 'your_phone_number_id';
      
      if (!whatsappToken || !phoneNumberId) {
        toast.error('WhatsApp not configured. Please check settings.');
        return;
      }

      const whatsappService = createWhatsAppService(whatsappToken, phoneNumberId);
      
      await whatsappService.sendPaymentReminder(
        client.phone,
        client.name,
        client.amount.toString(),
        new Date(client.endDate).toLocaleDateString('en-IN'),
        client.upiId,
        client.razorpayLink,
        client.qrCodeUrl
      );
      
      // Update last reminder sent
      setClients(prev => prev.map(c => 
        c.id === client.id 
          ? { ...c, lastReminder: new Date().toISOString().split('T')[0], reminderSent: true }
          : c
      ));
      
      toast.success(`Reminder sent to ${client.name}`);
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.error('Failed to send reminder');
    }
  };

  const markAsPaid = async (clientId: string) => {
    try {
      // TODO: Replace with actual API call
      // await fetch('/api/clients/payment-status', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ clientId, status: 'paid', userId: user?.id })
      // });
      
      setClients(prev => prev.map(client => 
        client.id === clientId 
          ? { ...client, status: 'paid' as const }
          : client
      ));
      
      toast.success('Payment marked as received');
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status');
    }
  };

  const openRazorpayLink = (link?: string) => {
    if (link) {
      window.open(link, '_blank');
    } else {
      toast.error('No payment link available');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isOverdue = (endDate: string, status: string) => {
    return new Date(endDate) < new Date() && status !== 'paid';
  };

  const getStatusColor = (client: Client) => {
    if (client.status === 'paid') return 'bg-green-500/20 text-green-400';
    if (isOverdue(client.endDate, client.status)) return 'bg-red-500/20 text-red-400';
    return 'bg-orange-500/20 text-orange-400';
  };

  const getStatusText = (client: Client) => {
    if (client.status === 'paid') return 'Paid';
    if (isOverdue(client.endDate, client.status)) return 'Overdue';
    return 'Pending';
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Payment Dashboard</h1>
          <p className="text-gray-400 mt-1">Monitor client payments and automated reminders</p>
        </div>
        <Link
          to="/add-client"
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Client
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="glass-effect p-6 rounded-xl card-hover">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-gray-400 text-sm font-medium">Total Clients</p>
              <p className="text-2xl font-bold text-white">{stats.totalClients}</p>
            </div>
          </div>
        </div>

        <div className="glass-effect p-6 rounded-xl card-hover">
          <div className="flex items-center">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-gray-400 text-sm font-medium">Pending</p>
              <p className="text-2xl font-bold text-white">{stats.pendingPayments}</p>
            </div>
          </div>
        </div>

        <div className="glass-effect p-6 rounded-xl card-hover">
          <div className="flex items-center">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-gray-400 text-sm font-medium">Overdue</p>
              <p className="text-2xl font-bold text-white">{stats.overduePayments}</p>
            </div>
          </div>
        </div>

        <div className="glass-effect p-6 rounded-xl card-hover">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-gray-400 text-sm font-medium">Amount Pending</p>
              <p className="text-xl font-bold text-white">{formatCurrency(stats.totalPending)}</p>
            </div>
          </div>
        </div>

        <div className="glass-effect p-6 rounded-xl card-hover">
          <div className="flex items-center">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-gray-400 text-sm font-medium">Amount Received</p>
              <p className="text-xl font-bold text-white">{formatCurrency(stats.totalPaid)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-effect p-6 rounded-xl">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="pl-10 pr-8 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="glass-effect rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Clients & Payment Status</h2>
        </div>
        <div className="overflow-x-auto">
          {filteredClients.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No clients found</h3>
              <p className="text-gray-500 mb-6">
                {clients.length === 0 
                  ? "Start by adding your first client to track payments and send automated reminders."
                  : "No clients match your current search criteria."
                }
              </p>
              {clients.length === 0 && (
                <Link
                  to="/add-client"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all duration-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Client
                </Link>
              )}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Payment Window
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Payment Options
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{client.name}</div>
                        <div className="text-sm text-gray-400">{client.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{formatCurrency(client.amount)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        <div>Start: {formatDate(client.startDate)}</div>
                        <div className={isOverdue(client.endDate, client.status) ? 'text-red-400' : ''}>
                          End: {formatDate(client.endDate)}
                          {isOverdue(client.endDate, client.status) && (
                            <span className="ml-2 text-xs">(Overdue)</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(client)}`}>
                        {getStatusText(client)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {client.upiId && (
                          <span className="inline-flex px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded">
                            UPI
                          </span>
                        )}
                        {client.razorpayLink && (
                          <span className="inline-flex px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded">
                            Razorpay
                          </span>
                        )}
                        {client.qrCodeUrl && (
                          <span className="inline-flex px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                            QR Code
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      {client.status !== 'paid' && (
                        <>
                          <button
                            onClick={() => sendManualReminder(client)}
                            className="text-primary-400 hover:text-primary-300 font-medium transition-colors flex items-center"
                            title="Send WhatsApp reminder"
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Remind
                          </button>
                          {client.razorpayLink && (
                            <button
                              onClick={() => openRazorpayLink(client.razorpayLink)}
                              className="text-purple-400 hover:text-purple-300 font-medium transition-colors flex items-center"
                              title="Open Razorpay payment link"
                            >
                              <CreditCard className="w-4 h-4 mr-1" />
                              Pay
                            </button>
                          )}
                          <button
                            onClick={() => markAsPaid(client.id)}
                            className="text-green-400 hover:text-green-300 font-medium transition-colors"
                          >
                            Mark Paid
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
