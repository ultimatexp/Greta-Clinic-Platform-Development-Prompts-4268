import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiUserPlus, FiCalendar, FiFileText, FiPackage } = FiIcons;

const QuickActions = () => {
  const actions = [
    {
      title: 'Add New Patient',
      description: 'Register a new patient',
      icon: FiUserPlus,
      color: 'bg-blue-500',
      href: '/patients'
    },
    {
      title: 'Schedule Appointment',
      description: 'Book new appointment',
      icon: FiCalendar,
      color: 'bg-green-500',
      href: '/appointments'
    },
    {
      title: 'Medical Record',
      description: 'Create new record',
      icon: FiFileText,
      color: 'bg-purple-500',
      href: '/medical-records'
    },
    {
      title: 'Check Inventory',
      description: 'View stock levels',
      icon: FiPackage,
      color: 'bg-orange-500',
      href: '/inventory'
    }
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-medical-100">
      <h3 className="text-lg font-semibold text-medical-800 mb-6">Quick Actions</h3>
      
      <div className="space-y-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link 
              to={action.href}
              className="flex items-center space-x-4 p-4 rounded-lg hover:bg-medical-50 transition-colors group"
            >
              <div className={`p-2 rounded-lg ${action.color} group-hover:scale-110 transition-transform`}>
                <SafeIcon icon={action.icon} className="text-white text-lg" />
              </div>
              <div>
                <p className="font-medium text-medical-800 group-hover:text-primary-600 transition-colors">
                  {action.title}
                </p>
                <p className="text-sm text-medical-500">{action.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;