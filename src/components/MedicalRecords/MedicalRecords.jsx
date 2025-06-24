import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import useStore from '../../store/useStore';
import SOAPEditor from './SOAPEditor';

const { FiPlus, FiFileText, FiUser, FiCalendar, FiActivity, FiSearch } = FiIcons;

const MedicalRecords = () => {
  const { medicalRecords, patients } = useStore();
  const [showSOAPEditor, setShowSOAPEditor] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = medicalRecords.filter(record => {
    const patient = patients.find(p => p.id === record.patientId);
    const patientName = patient ? `${patient.firstName} ${patient.lastName}` : '';
    
    return patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           record.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
           record.doctor.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleNewRecord = () => {
    setSelectedRecord(null);
    setShowSOAPEditor(true);
  };

  const handleEditRecord = (record) => {
    setSelectedRecord(record);
    setShowSOAPEditor(true);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-medical-800 mb-2">Medical Records</h1>
          <p className="text-medical-500">AI-assisted SOAP notes and patient records</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNewRecord}
          className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          <SafeIcon icon={FiPlus} />
          <span>New Record</span>
        </motion.button>
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
              placeholder="Search medical records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="divide-y divide-medical-100">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12 text-medical-500">
              <SafeIcon icon={FiFileText} className="text-4xl mx-auto mb-4" />
              <p className="text-lg">No medical records found</p>
              <p className="text-sm">Create your first medical record to get started</p>
            </div>
          ) : (
            filteredRecords.map((record, index) => {
              const patient = patients.find(p => p.id === record.patientId);
              const patientName = patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
              
              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-6 hover:bg-medical-50 transition-colors cursor-pointer"
                  onClick={() => handleEditRecord(record)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <SafeIcon icon={FiUser} className="text-primary-600 text-lg" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-medical-800">{patientName}</h3>
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                            {record.chiefComplaint}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-medical-500 mb-3">
                          <div className="flex items-center space-x-1">
                            <SafeIcon icon={FiCalendar} className="text-xs" />
                            <span>{new Date(record.date).toLocaleDateString('th-TH')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <SafeIcon icon={FiActivity} className="text-xs" />
                            <span>{record.doctor}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-medium text-medical-700 mb-1">Assessment:</p>
                            <p className="text-sm text-medical-600 line-clamp-2">{record.soap.assessment}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-medical-700 mb-1">Plan:</p>
                            <p className="text-sm text-medical-600 line-clamp-2">{record.soap.plan}</p>
                          </div>
                        </div>

                        {record.vitals && (
                          <div className="mt-3 p-3 bg-medical-50 rounded-lg">
                            <p className="text-sm font-medium text-medical-700 mb-1">Vitals:</p>
                            <div className="flex items-center space-x-4 text-sm text-medical-600">
                              <span>T: {record.vitals.temperature}°C</span>
                              <span>P: {record.vitals.pulse}/min</span>
                              <span>BP: {record.vitals.bloodPressure} mmHg</span>
                              <span>R: {record.vitals.respiratoryRate}/min</span>
                            </div>
                          </div>
                        )}

                        {record.prescriptions && record.prescriptions.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-medical-700 mb-2">Prescriptions:</p>
                            <div className="flex flex-wrap gap-2">
                              {record.prescriptions.map((prescription, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs"
                                >
                                  {prescription.medication}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {showSOAPEditor && (
        <SOAPEditor
          isOpen={showSOAPEditor}
          onClose={() => setShowSOAPEditor(false)}
          record={selectedRecord}
        />
      )}
    </div>
  );
};

export default MedicalRecords;