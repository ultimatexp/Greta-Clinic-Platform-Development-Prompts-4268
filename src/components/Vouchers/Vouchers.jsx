import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import useStore from '../../store/useStore';
import AddVoucherModal from './AddVoucherModal';

const { FiPlus, FiGift, FiSearch, FiFilter, FiPercent, FiDollarSign, FiCalendar, FiUsers, FiEdit, FiTrash2 } = FiIcons;

const Vouchers = () => {
  const { vouchers } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredVouchers = vouchers.filter(voucher => {
    const matchesSearch = voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voucher.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && voucher.isActive) ||
                         (filterStatus === 'inactive' && !voucher.isActive);
    return matchesSearch && matchesStatus;
  });

  const getVoucherTypeIcon = (type) => {
    return type === 'percentage' ? FiPercent : FiDollarSign;
  };

  const getVoucherTypeColor = (type) => {
    return type === 'percentage' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700';
  };

  const isVoucherExpired = (validTo) => {
    return new Date(validTo) < new Date();
  };

  const getVoucherStatus = (voucher) => {
    if (!voucher.isActive) {
      return { status: 'inactive', color: 'bg-gray-100 text-gray-700', text: 'Inactive' };
    } else if (isVoucherExpired(voucher.validTo)) {
      return { status: 'expired', color: 'bg-red-100 text-red-700', text: 'Expired' };
    } else if (voucher.usedCount >= voucher.usageLimit) {
      return { status: 'used-up', color: 'bg-orange-100 text-orange-700', text: 'Used Up' };
    } else {
      return { status: 'active', color: 'bg-green-100 text-green-700', text: 'Active' };
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
          <h1 className="text-3xl font-bold text-medical-800 mb-2">Voucher Management</h1>
          <p className="text-medical-500">Create and manage discount vouchers for patients</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          <SafeIcon icon={FiPlus} />
          <span>Create Voucher</span>
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-medical-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-medical-500">Total Vouchers</p>
              <p className="text-2xl font-bold text-medical-800">{vouchers.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <SafeIcon icon={FiGift} className="text-xl text-blue-600" />
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
              <p className="text-sm text-medical-500">Active Vouchers</p>
              <p className="text-2xl font-bold text-medical-800">
                {vouchers.filter(v => v.isActive && !isVoucherExpired(v.validTo)).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <SafeIcon icon={FiCalendar} className="text-xl text-green-600" />
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
              <p className="text-sm text-medical-500">Total Usage</p>
              <p className="text-2xl font-bold text-medical-800">
                {vouchers.reduce((sum, v) => sum + v.usedCount, 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <SafeIcon icon={FiUsers} className="text-xl text-purple-600" />
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
              <p className="text-sm text-medical-500">Avg. Discount</p>
              <p className="text-2xl font-bold text-medical-800">15%</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <SafeIcon icon={FiPercent} className="text-xl text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

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
                placeholder="Search vouchers..."
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-medical-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-medical-700">Voucher Code</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-medical-700">Type</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-medical-700">Value</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-medical-700">Usage</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-medical-700">Valid Period</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-medical-700">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-medical-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-medical-100">
              {filteredVouchers.map((voucher, index) => {
                const status = getVoucherStatus(voucher);
                const TypeIcon = getVoucherTypeIcon(voucher.type);
                
                return (
                  <motion.tr
                    key={voucher.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-medical-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <SafeIcon icon={FiGift} className="text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-medical-800">{voucher.code}</p>
                          <p className="text-sm text-medical-500">{voucher.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getVoucherTypeColor(voucher.type)}`}>
                        <SafeIcon icon={TypeIcon} className="text-xs" />
                        <span>{voucher.type}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 text-medical-700 font-medium">
                      {voucher.type === 'percentage' ? `${voucher.value}%` : `฿${voucher.value}`}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-medical-600">
                        <p className="font-medium">{voucher.usedCount}/{voucher.usageLimit}</p>
                        <div className="w-full bg-medical-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-primary-500 h-2 rounded-full" 
                            style={{ width: `${(voucher.usedCount / voucher.usageLimit) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-medical-600">
                      <div>
                        <p className="text-sm">{new Date(voucher.validFrom).toLocaleDateString('th-TH')}</p>
                        <p className="text-sm">to {new Date(voucher.validTo).toLocaleDateString('th-TH')}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <SafeIcon icon={FiEdit} className="text-sm" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <SafeIcon icon={FiTrash2} className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredVouchers.length === 0 && (
          <div className="text-center py-12 text-medical-500">
            <SafeIcon icon={FiGift} className="text-4xl mx-auto mb-4" />
            <p className="text-lg">No vouchers found</p>
            <p className="text-sm">Create your first voucher to get started</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddVoucherModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default Vouchers;