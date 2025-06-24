import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import useStore from '../../store/useStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const { FiBarChart3, FiDownload, FiCalendar, FiUsers, FiTrendingUp, FiDollarSign } = FiIcons;

const Reports = () => {
  const { patients, appointments, medicalRecords, vouchers } = useStore();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 45000, patients: 120 },
    { month: 'Feb', revenue: 52000, patients: 135 },
    { month: 'Mar', revenue: 48000, patients: 128 },
    { month: 'Apr', revenue: 61000, patients: 156 },
    { month: 'May', revenue: 55000, patients: 142 },
    { month: 'Jun', revenue: 67000, patients: 168 },
  ];

  const appointmentTypes = [
    { name: 'Consultation', value: 45, color: '#3B82F6' },
    { name: 'Follow-up', value: 30, color: '#10B981' },
    { name: 'Check-up', value: 20, color: '#F59E0B' },
    { name: 'Emergency', value: 5, color: '#EF4444' },
  ];

  const patientAgeGroups = [
    { age: '0-18', count: 25 },
    { age: '19-35', count: 45 },
    { age: '36-50', count: 38 },
    { age: '51-65', count: 28 },
    { age: '65+', count: 15 },
  ];

  const exportReport = () => {
    const reportData = {
      period: selectedPeriod,
      generated: new Date().toISOString(),
      totalPatients: patients.length,
      totalAppointments: appointments.length,
      totalRecords: medicalRecords.length,
      activeVouchers: vouchers.filter(v => v.isActive).length,
      revenueData,
      appointmentTypes,
      patientAgeGroups
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clinic-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-medical-800 mb-2">Reports & Analytics</h1>
          <p className="text-medical-500">Comprehensive insights into your clinic's performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportReport}
            className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            <SafeIcon icon={FiDownload} />
            <span>Export Report</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-medical-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-medical-500">Total Revenue</p>
              <p className="text-2xl font-bold text-medical-800">฿348,000</p>
              <p className="text-sm text-green-600 mt-1">+15% from last month</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <SafeIcon icon={FiDollarSign} className="text-xl text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-medical-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-medical-500">Total Patients</p>
              <p className="text-2xl font-bold text-medical-800">{patients.length}</p>
              <p className="text-sm text-blue-600 mt-1">+8 new this month</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <SafeIcon icon={FiUsers} className="text-xl text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-medical-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-medical-500">Appointments</p>
              <p className="text-2xl font-bold text-medical-800">{appointments.length}</p>
              <p className="text-sm text-purple-600 mt-1">95% completion rate</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <SafeIcon icon={FiCalendar} className="text-xl text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-medical-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-medical-500">Growth Rate</p>
              <p className="text-2xl font-bold text-medical-800">+23%</p>
              <p className="text-sm text-orange-600 mt-1">Month over month</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <SafeIcon icon={FiTrendingUp} className="text-xl text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-medical-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-medical-800">Revenue Trend</h3>
            <SafeIcon icon={FiBarChart3} className="text-medical-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#0ea5e9" 
                strokeWidth={3}
                dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Appointment Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-medical-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-medical-800">Appointment Types</h3>
            <SafeIcon icon={FiCalendar} className="text-medical-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={appointmentTypes}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {appointmentTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {appointmentTypes.map((type, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: type.color }}
                ></div>
                <span className="text-sm text-medical-600">{type.name}: {type.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Patient Demographics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-medical-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-medical-800">Patient Age Groups</h3>
            <SafeIcon icon={FiUsers} className="text-medical-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={patientAgeGroups}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="age" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-medical-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-medical-800">Key Metrics</h3>
            <SafeIcon icon={FiTrendingUp} className="text-medical-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-medical-50 rounded-lg">
              <div>
                <p className="text-sm text-medical-500">Average Wait Time</p>
                <p className="text-xl font-semibold text-medical-800">12 minutes</p>
              </div>
              <div className="text-green-600">
                <SafeIcon icon={FiTrendingUp} className="text-xl" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-medical-50 rounded-lg">
              <div>
                <p className="text-sm text-medical-500">Patient Satisfaction</p>
                <p className="text-xl font-semibold text-medical-800">4.8/5.0</p>
              </div>
              <div className="text-green-600">
                <SafeIcon icon={FiTrendingUp} className="text-xl" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-medical-50 rounded-lg">
              <div>
                <p className="text-sm text-medical-500">No-show Rate</p>
                <p className="text-xl font-semibold text-medical-800">5.2%</p>
              </div>
              <div className="text-red-600">
                <SafeIcon icon={FiTrendingUp} className="text-xl transform rotate-180" />
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-medical-50 rounded-lg">
              <div>
                <p className="text-sm text-medical-500">Revenue per Patient</p>
                <p className="text-xl font-semibold text-medical-800">฿2,340</p>
              </div>
              <div className="text-green-600">
                <SafeIcon icon={FiTrendingUp} className="text-xl" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;