import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import useStore from '../../store/useStore';
import StatsCard from './StatsCard';
import RecentAppointments from './RecentAppointments';
import QuickActions from './QuickActions';

const { FiUsers, FiCalendar, FiFileText, FiTrendingUp } = FiIcons;

const Dashboard = () => {
  const { patients, appointments, medicalRecords } = useStore();

  const todayAppointments = appointments.filter(apt => 
    apt.date === new Date().toISOString().split('T')[0]
  );

  const completedToday = appointments.filter(apt => 
    apt.date === new Date().toISOString().split('T')[0] && apt.status === 'completed'
  );

  const stats = [
    {
      title: 'Total Patients',
      value: patients.length,
      icon: FiUsers,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: "Today's Appointments",
      value: todayAppointments.length,
      icon: FiCalendar,
      color: 'bg-green-500',
      change: '+5%'
    },
    {
      title: 'Completed Today',
      value: completedToday.length,
      icon: FiFileText,
      color: 'bg-purple-500',
      change: '+8%'
    },
    {
      title: 'Revenue This Month',
      value: '฿45,200',
      icon: FiTrendingUp,
      color: 'bg-orange-500',
      change: '+15%'
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-medical-800 mb-2">Dashboard</h1>
        <p className="text-medical-500">Overview of your clinic's performance</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="lg:col-span-2"
        >
          <RecentAppointments />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <QuickActions />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;