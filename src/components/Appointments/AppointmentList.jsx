import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import useStore from '../../store/useStore';
import AddAppointmentModal from './AddAppointmentModal';

const { FiPlus, FiCalendar, FiClock, FiUser, FiFilter, FiSearch } = FiIcons;

const AppointmentList = () => {
  const { appointments } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAppointments = appointments.filter(appointment => {
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'consultation': return 'bg-purple-100 text-purple-800';
      case 'follow-up': return 'bg-orange-100 text-orange-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-medical-800 mb-2">Appointments</h1>
          <p className="text-medical-500">Manage patient appointments and scheduling</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          <SafeIcon icon={FiPlus} />
          <span>New Appointment</span>
        </motion.button>
      </motion.div>

      <div className="bg-white rounded-xl shadow-sm border border-medical-100">
        <div className="p-6 border-b border-medical-100">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <SafeIcon 
                icon={FiSearch} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medical-400" 
              />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiFilter} className="text-medical-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-medical-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-medical-700">Patient</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-medical-700">Date & Time</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-medical-700">Type</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-medical-700">Doctor</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-medical-700">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-medical-700">Notes</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-medical-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-medical-100">
              {filteredAppointments.map((appointment, index) => (
                <motion.tr
                  key={appointment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-medical-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <SafeIcon icon={FiUser} className="text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-medical-800">{appointment.patientName}</p>
                        <p className="text-sm text-medical-500">ID: {appointment.patientId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-medical-600">
                      <SafeIcon icon={FiCalendar} className="text-sm" />
                      <div>
                        <p className="font-medium">{new Date(appointment.date).toLocaleDateString('th-TH')}</p>
                        <div className="flex items-center space-x-1 text-sm text-medical-500">
                          <SafeIcon icon={FiClock} className="text-xs" />
                          <span>{appointment.time}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(appointment.type)}`}>
                      {appointment.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-medical-600">{appointment.doctor}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-medical-600 max-w-xs truncate">
                    {appointment.notes || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        <SafeIcon icon={FiCalendar} className="text-sm" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12 text-medical-500">
            <SafeIcon icon={FiCalendar} className="text-4xl mx-auto mb-4" />
            <p className="text-lg">No appointments found</p>
            <p className="text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddAppointmentModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default AppointmentList;