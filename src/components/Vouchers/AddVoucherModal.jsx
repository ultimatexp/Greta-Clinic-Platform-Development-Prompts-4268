import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import useStore from '../../store/useStore';

const { FiX, FiGift, FiPercent, FiDollarSign } = FiIcons;

const AddVoucherModal = ({ isOpen, onClose }) => {
  const { addVoucher } = useStore();
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    description: '',
    validFrom: new Date().toISOString().split('T')[0],
    validTo: '',
    usageLimit: '',
    isActive: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newVoucher = {
      ...formData,
      value: parseFloat(formData.value),
      usageLimit: parseInt(formData.usageLimit),
      usedCount: 0
    };

    addVoucher(newVoucher);
    onClose();
  };

  const generateVoucherCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code: result });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl"
          >
            <div className="p-6 border-b border-medical-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-medical-800">Create New Voucher</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-medical-400 hover:text-medical-600 transition-colors"
                >
                  <SafeIcon icon={FiX} className="text-xl" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-medical-700 mb-2">
                    Voucher Code *
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="flex-1 px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="e.g., SAVE20"
                      required
                    />
                    <button
                      type="button"
                      onClick={generateVoucherCode}
                      className="px-3 py-2 bg-medical-100 text-medical-600 rounded-lg hover:bg-medical-200 transition-colors"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-medical-700 mb-2">
                    Discount Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (฿)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-medical-700 mb-2">
                    Discount Value *
                  </label>
                  <div className="relative">
                    <SafeIcon 
                      icon={formData.type === 'percentage' ? FiPercent : FiDollarSign} 
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medical-400" 
                    />
                    <input
                      type="number"
                      min="0"
                      step={formData.type === 'percentage' ? '1' : '0.01'}
                      max={formData.type === 'percentage' ? '100' : undefined}
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder={formData.type === 'percentage' ? '20' : '100'}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-medical-700 mb-2">
                    Usage Limit *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-medical-700 mb-2">
                    Valid From *
                  </label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-medical-700 mb-2">
                    Valid To *
                  </label>
                  <input
                    type="date"
                    value={formData.validTo}
                    onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
                    min={formData.validFrom}
                    className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-medical-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Special discount for new patients"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-medical-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-medical-700">
                  Activate voucher immediately
                </label>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-medical-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 text-medical-600 border border-medical-200 rounded-lg hover:bg-medical-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Create Voucher
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddVoucherModal;