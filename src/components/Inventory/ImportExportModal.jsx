import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import useStore from '../../store/useStore';

const { FiX, FiUpload, FiDownload, FiFile } = FiIcons;

const ImportExportModal = ({ isOpen, onClose }) => {
  const { inventory } = useStore();
  const [activeTab, setActiveTab] = useState('import');

  const handleExport = () => {
    const csvData = [
      ['Name', 'Category', 'Current Stock', 'Min Stock', 'Max Stock', 'Unit Price', 'Supplier', 'Expiry Date', 'Batch Number'],
      ...inventory.map(item => [
        item.name,
        item.category,
        item.currentStock,
        item.minStock,
        item.maxStock,
        item.unitPrice,
        item.supplier,
        item.expiryDate || '',
        item.batchNumber
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target.result;
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        
        // Process CSV data here
        console.log('CSV imported:', { headers, lines });
        // Add logic to parse and add items to inventory
      };
      reader.readAsText(file);
    }
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
                <h2 className="text-2xl font-bold text-medical-800">Import/Export Inventory</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-medical-400 hover:text-medical-600 transition-colors"
                >
                  <SafeIcon icon={FiX} className="text-xl" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Tabs */}
              <div className="flex space-x-1 bg-medical-100 rounded-lg p-1 mb-6">
                <button
                  onClick={() => setActiveTab('import')}
                  className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-colors ${
                    activeTab === 'import'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-medical-600 hover:text-medical-800'
                  }`}
                >
                  Import Data
                </button>
                <button
                  onClick={() => setActiveTab('export')}
                  className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-colors ${
                    activeTab === 'export'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-medical-600 hover:text-medical-800'
                  }`}
                >
                  Export Data
                </button>
              </div>

              {activeTab === 'import' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <SafeIcon icon={FiUpload} className="text-2xl text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-medical-800 mb-2">Import Inventory Data</h3>
                    <p className="text-medical-500 mb-6">Upload a CSV file to import inventory items</p>
                  </div>

                  <div className="border-2 border-dashed border-medical-200 rounded-lg p-8 text-center">
                    <SafeIcon icon={FiFile} className="text-4xl text-medical-400 mx-auto mb-4" />
                    <p className="text-medical-600 mb-4">Drag and drop your CSV file here, or click to browse</p>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleImport}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label
                      htmlFor="csv-upload"
                      className="inline-flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors cursor-pointer"
                    >
                      <SafeIcon icon={FiUpload} />
                      <span>Choose File</span>
                    </label>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2">CSV Format Requirements:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• First row should contain headers</li>
                      <li>• Required columns: Name, Category, Current Stock, Min Stock, Max Stock, Unit Price, Supplier</li>
                      <li>• Optional columns: Expiry Date, Batch Number</li>
                      <li>• Date format: YYYY-MM-DD</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'export' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <SafeIcon icon={FiDownload} className="text-2xl text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-medical-800 mb-2">Export Inventory Data</h3>
                    <p className="text-medical-500 mb-6">Download your inventory data as a CSV file</p>
                  </div>

                  <div className="bg-medical-50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-medical-800">Current Inventory</h4>
                        <p className="text-sm text-medical-500">{inventory.length} items will be exported</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-medical-500">Export includes:</p>
                        <p className="text-xs text-medical-400">All item details, stock levels, pricing</p>
                      </div>
                    </div>

                    <button
                      onClick={handleExport}
                      className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <SafeIcon icon={FiDownload} />
                      <span>Download CSV File</span>
                    </button>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">Export Notes:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• File will be named with current date</li>
                      <li>• All sensitive data is included - handle securely</li>
                      <li>• Compatible with Excel and Google Sheets</li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-medical-100">
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-medical-600 border border-medical-200 rounded-lg hover:bg-medical-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ImportExportModal;