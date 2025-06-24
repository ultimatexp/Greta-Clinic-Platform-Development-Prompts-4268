import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiX, FiAlertTriangle, FiUser, FiCalendar, FiCreditCard } = FiIcons;

const DuplicateNameModal = ({ isOpen, onClose, onConfirm, similarPatients, newPatient }) => {
  if (!isOpen || !similarPatients.length) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-auto"
        >
          <div className="p-6 border-b border-red-100 bg-red-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <SafeIcon icon={FiAlertTriangle} className="text-red-600 text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-red-800">Duplicate Name Detection</h2>
                  <p className="text-red-600">Similar patient names found in the system</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-red-400 hover:text-red-600 transition-colors"
              >
                <SafeIcon icon={FiX} className="text-xl" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-medical-800 mb-2">New Patient Information</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-blue-700">Name</p>
                    <p className="text-blue-900">{newPatient.firstName} {newPatient.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700">Date of Birth</p>
                    <p className="text-blue-900">{new Date(newPatient.dateOfBirth).toLocaleDateString('th-TH')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-700">National ID</p>
                    <p className="text-blue-900">{newPatient.nationalId}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-medical-800 mb-4">Similar Patients Found</h3>
              <div className="space-y-3">
                {similarPatients.map((patient, index) => (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border rounded-lg p-4 ${
                      patient.matchType === 'exact' 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-yellow-300 bg-yellow-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <SafeIcon icon={FiUser} className="text-primary-600 text-lg" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm font-medium text-medical-700">HN</p>
                            <p className="font-semibold text-medical-800">{patient.hn}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-medical-700">Name</p>
                            <p className="font-semibold text-medical-800">
                              {patient.firstName} {patient.lastName}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-medical-700">Date of Birth</p>
                            <p className="text-medical-600">
                              {new Date(patient.dateOfBirth).toLocaleDateString('th-TH')}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-medical-700">National ID</p>
                            <p className="text-medical-600">{patient.nationalId}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          patient.matchType === 'exact'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {patient.matchType === 'exact' ? 'EXACT MATCH' : `${patient.similarity}% SIMILAR`}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <SafeIcon icon={FiAlertTriangle} className="text-amber-600 text-lg mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-800 mb-2">Please Verify Before Proceeding</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Check if this is the same person with updated information</li>
                    <li>• Verify National ID and Date of Birth carefully</li>
                    <li>• Consider if this might be a family member with similar name</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-6 py-2 text-medical-600 border border-medical-200 rounded-lg hover:bg-medical-50 transition-colors"
              >
                Cancel Registration
              </button>
              <button
                onClick={onConfirm}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Continue Registration
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DuplicateNameModal;