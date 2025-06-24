import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import useStore from '../../store/useStore';
import AddPatientModal from './AddPatientModal';
import PatientImportModal from './PatientImportModal';
import RoleBasedAccess from '../Auth/RoleBasedAccess';

const { FiPlus, FiSearch, FiUser, FiPhone, FiCalendar, FiEye, FiEdit, FiUpload, FiDownload } = FiIcons;

const PatientList = () => {
  const { patients } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const filteredPatients = patients.filter(patient =>
    patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.hn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.nationalId.includes(searchTerm) ||
    patient.phone.includes(searchTerm)
  );

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const exportPatients = () => {
    const csvData = [
      ['HN', 'First Name', 'Last Name', 'National ID', 'Date of Birth', 'Gender', 'Phone', 'Email', 'Address'],
      ...patients.map(patient => [
        patient.hn,
        patient.firstName,
        patient.lastName,
        patient.nationalId,
        patient.dateOfBirth,
        patient.gender,
        patient.phone,
        patient.email || '',
        patient.address || ''
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patients-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-medical-800 mb-2">Patients</h1>
          <p className="text-medical-500">Manage patient records and information</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <RoleBasedAccess allowedRoles={['admin', 'receptionist']}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowImportModal(true)}
              className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              <SafeIcon icon={FiUpload} />
              <span>Import</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportPatients}
              className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <SafeIcon icon={FiDownload} />
              <span>Export</span>
            </motion.button>
          </RoleBasedAccess>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            <SafeIcon icon={FiPlus} />
            <span>Add Patient</span>
          </motion.button>
        </div>
      </motion.div>

      <div className="bg-white rounded-xl shadow-sm border border-medical-100">
        <div className="p-6 border-b border-medical-100">
          <div className="relative">
            <SafeIcon 
              icon={FiSearch} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medical-400" 
            />
            <input
              type="text"
              placeholder="Search patients by name, HN, ID, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-medical-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-medical-700">HN</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-medical-700">Patient</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-medical-700">National ID</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-medical-700">Age</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-medical-700">Contact</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-medical-700">Last Visit</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-medical-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-medical-100">
              {filteredPatients.map((patient, index) => (
                <motion.tr
                  key={patient.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-medical-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-primary-600">{patient.hn}</div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <SafeIcon icon={FiUser} className="text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-medical-800">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-sm text-medical-500 capitalize">{patient.gender}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-medical-600 font-mono">{patient.nationalId}</div>
                  </td>
                  
                  <td className="px-6 py-4 text-medical-600">
                    {calculateAge(patient.dateOfBirth)} years
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="text-medical-600">
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiPhone} className="text-xs" />
                        <span className="text-sm">{patient.phone}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-medical-600">
                    {patient.lastVisit 
                      ? new Date(patient.lastVisit).toLocaleDateString('th-TH')
                      : 'Never'
                    }
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/patients/${patient.id}`}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <SafeIcon icon={FiEye} className="text-sm" />
                      </Link>
                      <RoleBasedAccess allowedRoles={['admin', 'doctor', 'receptionist']}>
                        <button className="p-2 text-medical-600 hover:bg-medical-50 rounded-lg transition-colors">
                          <SafeIcon icon={FiEdit} className="text-sm" />
                        </button>
                      </RoleBasedAccess>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPatients.length === 0 && (
          <div className="text-center py-12 text-medical-500">
            <SafeIcon icon={FiUser} className="text-4xl mx-auto mb-4" />
            <p className="text-lg">No patients found</p>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddPatientModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {showImportModal && (
        <PatientImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
        />
      )}
    </div>
  );
};

export default PatientList;