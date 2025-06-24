import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import useStore from '../../store/useStore';
import AddInventoryModal from './AddInventoryModal';
import ImportExportModal from './ImportExportModal';

const { FiPlus, FiPackage, FiSearch, FiFilter, FiDownload, FiUpload, FiAlertTriangle } = FiIcons;

const Inventory = () => {
  const { inventory } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportExportModal, setShowImportExportModal] = useState(false);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (item) => {
    if (item.currentStock <= item.minStock) {
      return { status: 'low', color: 'bg-red-100 text-red-800', text: 'Low Stock' };
    } else if (item.currentStock <= item.minStock * 1.5) {
      return { status: 'medium', color: 'bg-yellow-100 text-yellow-800', text: 'Medium' };
    } else {
      return { status: 'good', color: 'bg-green-100 text-green-800', text: 'Good' };
    }
  };

  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStock);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-medical-800 mb-2">Inventory Management</h1>
          <p className="text-medical-500">Track medications, equipment, and supplies</p>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowImportExportModal(true)}
            className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            <SafeIcon icon={FiUpload} />
            <span>Import/Export</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            <SafeIcon icon={FiPlus} />
            <span>Add Item</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4"
        >
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiAlertTriangle} className="text-red-600 text-xl" />
            <div>
              <h3 className="font-semibold text-red-800">Low Stock Alert</h3>
              <p className="text-red-600">
                {lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''} running low on stock
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {lowStockItems.slice(0, 5).map((item) => (
              <span
                key={item.id}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
              >
                {item.name} ({item.currentStock} left)
              </span>
            ))}
            {lowStockItems.length > 5 && (
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                +{lowStockItems.length - 5} more
              </span>
            )}
          </div>
        </motion.div>
      )}

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
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <SafeIcon icon={FiFilter} className="text-medical-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="medication">Medications</option>
                <option value="equipment">Equipment</option>
                <option value="supplies">Supplies</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-medical-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-medical-700">Item</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-medical-700">Category</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-medical-700">Stock</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-medical-700">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-medical-700">Unit Price</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-medical-700">Supplier</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-medical-700">Expiry</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-medical-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-medical-100">
              {filteredInventory.map((item, index) => {
                const stockStatus = getStockStatus(item);
                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-medical-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <SafeIcon icon={FiPackage} className="text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-medical-800">{item.name}</p>
                          <p className="text-sm text-medical-500">Batch: {item.batchNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-medical-800">
                        <p className="font-medium">{item.currentStock}</p>
                        <p className="text-sm text-medical-500">Min: {item.minStock}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                        {stockStatus.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-medical-600">
                      ฿{item.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-medical-600">
                      {item.supplier}
                    </td>
                    <td className="px-6 py-4 text-medical-600">
                      {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString('th-TH') : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <SafeIcon icon={FiPackage} className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredInventory.length === 0 && (
          <div className="text-center py-12 text-medical-500">
            <SafeIcon icon={FiPackage} className="text-4xl mx-auto mb-4" />
            <p className="text-lg">No inventory items found</p>
            <p className="text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddInventoryModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showImportExportModal && (
        <ImportExportModal
          isOpen={showImportExportModal}
          onClose={() => setShowImportExportModal(false)}
        />
      )}
    </div>
  );
};

export default Inventory;