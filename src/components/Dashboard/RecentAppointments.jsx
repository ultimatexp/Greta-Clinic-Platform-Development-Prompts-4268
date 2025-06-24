import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import useStore from '../../store/useStore';

const { FiClock, FiUser, FiCalendar } = FiIcons;

const RecentAppointments = () => {
  const { appointments } = useStore();
  
  const todayAppointments = appointments
    .filter(apt => apt.date === new Date().toISOString().split('T')[0])
    .slice(0, 5);

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-medical-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-medical-800">Today's Appointments</h3>
        <Link 
          to="/appointments"
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
        >
          View All
        </Link>
      </div>

      <div className="space-y-4">
        {todayAppointments.length === 0 ? (
          <div className="text-center py-8 text-medical-500">
            <SafeIcon icon={FiCalendar} className="text-3xl mx-auto mb-2" />
            <p>No appointments scheduled for today</p>
          </div>
        ) : (
          todayAppointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-medical-50 rounded-lg hover:bg-medical-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiUser} className="text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-medical-800">{appointment.patientName}</p>
                  <div className="flex items-center space-x-2 text-sm text-medical-500">
                    <SafeIcon icon={FiClock} className="text-xs" />
                    <span>{appointment.time}</span>
                    <span>•</span>
                    <span>{appointment.type}</span>
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                {appointment.status}
              </span>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentAppointments;