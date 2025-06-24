import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import useStore from '../../store/useStore';
import RoleBasedAccess from '../Auth/RoleBasedAccess';

const { FiActivity, FiHome, FiUsers, FiCalendar, FiFileText, FiPackage, FiGift, FiBarChart3, FiLogOut } = FiIcons;

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useStore();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome, roles: ['admin', 'doctor', 'receptionist'] },
    { name: 'Patients', href: '/patients', icon: FiUsers, roles: ['admin', 'doctor', 'receptionist'] },
    { name: 'Appointments', href: '/appointments', icon: FiCalendar, roles: ['admin', 'doctor', 'receptionist'] },
    { name: 'Medical Records', href: '/medical-records', icon: FiFileText, roles: ['admin', 'doctor'] },
    { name: 'Inventory', href: '/inventory', icon: FiPackage, roles: ['admin', 'receptionist'] },
    { name: 'Vouchers', href: '/vouchers', icon: FiGift, roles: ['admin', 'receptionist'] },
    { name: 'Reports', href: '/reports', icon: FiBarChart3, roles: ['admin'] }
  ];

  return (
    <div className="bg-white w-64 shadow-lg flex flex-col">
      <div className="p-6 border-b border-medical-200">
        <div className="flex items-center space-x-3">
          <div className="bg-primary-500 p-2 rounded-lg">
            <SafeIcon icon={FiActivity} className="text-xl text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-medical-800">Greta</h1>
            <p className="text-sm text-medical-500">Clinic Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item, index) => {
            const isActive = location.pathname === item.href;
            
            return (
              <RoleBasedAccess key={item.name} allowedRoles={item.roles}>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-500'
                        : 'text-medical-600 hover:bg-medical-50 hover:text-medical-800'
                    }`}
                  >
                    <SafeIcon icon={item.icon} className="text-lg" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </motion.li>
              </RoleBasedAccess>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-medical-200">
        <div className="mb-3 px-4 py-2 bg-medical-50 rounded-lg">
          <p className="text-sm font-medium text-medical-800">{user?.name}</p>
          <p className="text-xs text-medical-500 capitalize">{user?.role}</p>
        </div>
        
        <button 
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-medical-600 hover:bg-medical-50 hover:text-medical-800 transition-colors w-full"
        >
          <SafeIcon icon={FiLogOut} className="text-lg" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;