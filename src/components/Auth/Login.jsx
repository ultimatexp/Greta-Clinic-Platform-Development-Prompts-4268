import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import useStore from '../../store/useStore';

const { FiUser, FiLock, FiActivity } = FiIcons;

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [selectedRole, setSelectedRole] = useState('doctor');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useStore();

  const roles = [
    { value: 'admin', label: 'Administrator', description: 'Full system access' },
    { value: 'doctor', label: 'Doctor', description: 'Medical records, SOAP notes' },
    { value: 'receptionist', label: 'Receptionist', description: 'Patient registration, appointments' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login
    setTimeout(() => {
      const roleData = {
        admin: { name: 'ผอ.สมศักดิ์ ใจดี', clinic: 'คลินิกสุขภาพดี' },
        doctor: { name: 'นพ.สมหมาย รักษาคน', clinic: 'คลินิกสุขภาพดี' },
        receptionist: { name: 'คุณสมหญิง ยิ้มแย้ม', clinic: 'คลินิกสุขภาพดี' }
      };

      setUser({
        id: '1',
        username: credentials.username,
        name: roleData[selectedRole].name,
        role: selectedRole,
        clinic: roleData[selectedRole].clinic
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-full mb-4"
          >
            <SafeIcon icon={FiActivity} className="text-2xl text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-medical-800 mb-2">Greta</h1>
          <p className="text-medical-500">Clinic Management Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-medical-700 mb-2">
              Role *
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-3 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              {roles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.label} - {role.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-medical-700 mb-2">
              Username
            </label>
            <div className="relative">
              <SafeIcon 
                icon={FiUser} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medical-400" 
              />
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-medical-700 mb-2">
              Password
            </label>
            <div className="relative">
              <SafeIcon 
                icon={FiLock} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medical-400" 
              />
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-medical-500">
            Demo credentials: Any username/password
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;