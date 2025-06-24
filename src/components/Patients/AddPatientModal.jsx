import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import useStore from '../../store/useStore';
import DuplicateNameModal from './DuplicateNameModal';
import { HNGenerator } from '../../utils/hnGenerator';
import { DuplicateDetector } from '../../utils/duplicateDetection';

const { FiX, FiUser, FiCreditCard, FiPhone, FiMail, FiMapPin } = FiIcons;

const AddPatientModal = ({ isOpen, onClose }) => {
  const { addPatient, patients } = useStore();
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [similarPatients, setSimilarPatients] = useState([]);
  const [formData, setFormData] = useState({
    nationalId: '',
    firstName: '',
    lastName: '',
    firstNameEn: '',
    lastNameEn: '',
    dateOfBirth: '',
    gender: 'male',
    phone: '',
    email: '',
    address: '',
    bloodType: '',
    allergies: '',
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check for duplicate names
    const duplicates = DuplicateDetector.findSimilarNames(formData, patients);
    
    if (duplicates.length > 0) {
      setSimilarPatients(duplicates);
      setShowDuplicateModal(true);
      return;
    }
    
    proceedWithRegistration();
  };

  const proceedWithRegistration = () => {
    const newPatient = {
      ...formData,
      hn: HNGenerator.generateUniqueHN(patients),
      allergies: formData.allergies.split(',').map(a => a.trim()).filter(a => a),
      emergencyContact: {
        name: formData.emergencyContactName,
        relationship: formData.emergencyContactRelationship,
        phone: formData.emergencyContactPhone
      },
      createdAt: new Date().toISOString(),
      lastVisit: null
    };

    addPatient(newPatient);
    setShowDuplicateModal(false);
    onClose();
  };

  const handleIDCardRead = () => {
    // Simulate Thai ID card reader
    setFormData({
      ...formData,
      nationalId: '3456789012345',
      firstName: 'สมศรี',
      lastName: 'ดีใจ',
      firstNameEn: 'Somsri',
      lastNameEn: 'Deejai',
      dateOfBirth: '1992-08-10',
      address: '789 ถนนพหลโยธิน แขวงจตุจักร เขตจตุจักร กรุงเทพฯ 10900'
    });
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto"
            >
              <div className="p-6 border-b border-medical-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-medical-800">Add New Patient</h2>
                  <button
                    onClick={onClose}
                    className="p-2 text-medical-400 hover:text-medical-600 transition-colors"
                  >
                    <SafeIcon icon={FiX} className="text-xl" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* ID Card Reader Section */}
                <div className="bg-primary-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiCreditCard} className="text-primary-600 text-xl" />
                      <div>
                        <h3 className="font-medium text-primary-800">Thai National ID Card Reader</h3>
                        <p className="text-sm text-primary-600">Automatically fill patient information</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleIDCardRead}
                      className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      Read ID Card
                    </button>
                  </div>
                </div>

                {/* Auto-generated HN Display */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <SafeIcon icon={FiUser} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800">Hospital Number (HN)</p>
                      <p className="text-lg font-bold text-green-900">
                        {HNGenerator.generateUniqueHN(patients)}
                        <span className="text-sm font-normal text-green-600 ml-2">(Auto-generated)</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-medical-800 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-medical-700 mb-2">
                        National ID *
                      </label>
                      <input
                        type="text"
                        value={formData.nationalId}
                        onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                        className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-medical-700 mb-2">
                        Gender *
                      </label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-medical-700 mb-2">
                        First Name (Thai) *
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-medical-700 mb-2">
                        Last Name (Thai) *
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-medical-700 mb-2">
                        First Name (English)
                      </label>
                      <input
                        type="text"
                        value={formData.firstNameEn}
                        onChange={(e) => setFormData({ ...formData, firstNameEn: e.target.value })}
                        className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-medical-700 mb-2">
                        Last Name (English)
                      </label>
                      <input
                        type="text"
                        value={formData.lastNameEn}
                        onChange={(e) => setFormData({ ...formData, lastNameEn: e.target.value })}
                        className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-medical-700 mb-2">
                        Date of Birth *
                      </label>
                      <input
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
                        required
                        readOnly
                        title="This field is auto-filled from ID card and cannot be edited"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-medical-700 mb-2">
                        Blood Type
                      </label>
                      <select
                        value={formData.bloodType}
                        onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                        className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select blood type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-medical-800 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-medical-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-medical-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-medical-700 mb-2">
                        Address
                      </label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div>
                  <h3 className="text-lg font-semibold text-medical-800 mb-4">Medical Information</h3>
                  <div>
                    <label className="block text-sm font-medium text-medical-700 mb-2">
                      Allergies (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.allergies}
                      onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                      placeholder="e.g., Penicillin, Seafood, Nuts"
                      className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h3 className="text-lg font-semibold text-medical-800 mb-4">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-medical-700 mb-2">
                        Contact Name
                      </label>
                      <input
                        type="text"
                        value={formData.emergencyContactName}
                        onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                        className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-medical-700 mb-2">
                        Relationship
                      </label>
                      <select
                        value={formData.emergencyContactRelationship}
                        onChange={(e) => setFormData({ ...formData, emergencyContactRelationship: e.target.value })}
                        className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select relationship</option>
                        <option value="spouse">Spouse</option>
                        <option value="parent">Parent</option>
                        <option value="child">Child</option>
                        <option value="sibling">Sibling</option>
                        <option value="friend">Friend</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-medical-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.emergencyContactPhone}
                        onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                        className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
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
                    Add Patient
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <DuplicateNameModal
        isOpen={showDuplicateModal}
        onClose={() => setShowDuplicateModal(false)}
        onConfirm={proceedWithRegistration}
        similarPatients={similarPatients}
        newPatient={formData}
      />
    </>
  );
};

export default AddPatientModal;