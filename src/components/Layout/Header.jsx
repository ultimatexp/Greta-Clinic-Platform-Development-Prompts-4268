import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import useStore from '../../store/useStore';

const { FiBell, FiSearch, FiUser } = FiIcons;

const Header = () => {
  const { user } = useStore();

  return (
    <header className="bg-white shadow-sm border-b border-medical-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold text-medical-800">
            Welcome back, {user?.name}
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <SafeIcon 
              icon={FiSearch} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medical-400" 
            />
            <input
              type="text"
              placeholder="Search patients, appointments..."
              className="pl-10 pr-4 py-2 w-64 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 text-medical-400 hover:text-medical-600 transition-colors"
          >
            <SafeIcon icon={FiBell} className="text-xl" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </motion.button>

          <div className="flex items-center space-x-3 px-3 py-2 bg-medical-50 rounded-lg">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiUser} className="text-white text-sm" />
            </div>
            <div>
              <p className="text-sm font-medium text-medical-800">{user?.name}</p>
              <p className="text-xs text-medical-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;