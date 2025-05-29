
import React, { useState, useEffect } from 'react';
import { Plus, Users, Clock, CheckCircle, AlertCircle, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Client {
  id: string;
  name: string;
  phone: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'paid';
  lastReminder?: string;
}

const Dashboard = () => {
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'John Doe',
      phone: '+91 9876543210',
      amount: 15000,
      dueDate: '2024-01-15',
      status: 'pending',
      lastReminder: '2024-01-10'
    },
    {
      id: '2',
      name: 'Jane Smith',
      phone: '+91 9876543211',
      amount: 25000,
      dueDate: '2024-01-20',
      status: 'paid',
      lastReminder: '2024-01-08'
    },
    {
      id: '3',
      name: 'Mike Johnson',
      phone: '+91 9876543212',
      amount: 8000,
      dueDate: '2024-01-12',
      status: 'pending',
      lastReminder: '2024-01-09'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid'>('all');

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalClients: clients.length,
    pendingPayments: clients.filter(c => c.status === 'pending').length,
    totalPending: clients.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0),
    totalPaid: clients.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0),
  };

  const sendReminder = (clientId: string) => {
    // Mock sending reminder
    setClients(prev => prev.map(client => 
      client.id === clientId 
        ? { ...client, lastReminder: new Date().toISOString().split('T')[0] }
        : client
    ));
  };

  const markAsPaid = (clientId: string) => {
    setClients(prev => prev.map(client => 
      client.id === clientId 
        ? { ...client, status: 'paid' as const }
        : client
    ));
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

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Manage your clients and payment reminders</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <p className="text-gray-400 text-sm font-medium">Pending Payments</p>
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
              <p className="text-gray-400 text-sm font-medium">Amount Pending</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalPending)}</p>
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
              <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalPaid)}</p>
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
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'paid')}
              className="pl-10 pr-8 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="glass-effect rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Clients</h2>
        </div>
        <div className="overflow-x-auto">
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
                  Due Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Last Reminder
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
                    <div className={`text-sm ${isOverdue(client.dueDate) && client.status === 'pending' ? 'text-red-400' : 'text-white'}`}>
                      {formatDate(client.dueDate)}
                      {isOverdue(client.dueDate) && client.status === 'pending' && (
                        <span className="ml-2 text-xs text-red-400">(Overdue)</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      client.status === 'paid' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-orange-500/20 text-orange-400'
                    }`}>
                      {client.status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {client.lastReminder ? formatDate(client.lastReminder) : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    {client.status === 'pending' && (
                      <>
                        <button
                          onClick={() => sendReminder(client.id)}
                          className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
                        >
                          Send Reminder
                        </button>
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
