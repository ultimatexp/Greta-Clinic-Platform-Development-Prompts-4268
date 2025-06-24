import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';

const StatsCard = ({ title, value, icon, color, change }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-xl shadow-sm border border-medical-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-medical-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-medical-800">{value}</p>
          <p className="text-sm text-green-600 mt-1">{change} from last month</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <SafeIcon icon={icon} className="text-xl text-white" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;