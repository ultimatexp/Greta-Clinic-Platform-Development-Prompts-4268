import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import useStore from '../../store/useStore';
import { HNGenerator } from '../../utils/hnGenerator';

const { FiX, FiUpload, FiDownload, FiFile, FiCheck, FiAlertTriangle } = FiIcons;

const PatientImportModal = ({ isOpen, onClose }) => {
  const { patients, addPatient } = useStore();
  const [csvData, setCsvData] = useState([]);
  const [validationResults, setValidationResults] = useState([]);
  const [isValidating, setIsValidating] = useState(false);
  const [step, setStep] = useState('upload'); // upload, preview, import

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target.result;
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        const data = lines.slice(1).filter(line => line.trim()).map((line, index) => {
          const values = line.split(',').map(v => v.trim());
          const patient = {};
          headers.forEach((header, idx) => {
            patient[header] = values[idx] || '';
          });
          patient.rowIndex = index + 2; // +2 for header and 0-based index
          return patient;
        });
        
        setCsvData(data);
        validateData(data);
      };
      reader.readAsText(file);
    }
  };

  const validateData = (data) => {
    setIsValidating(true);
    const results = data.map(patient => {
      const errors = [];
      const warnings = [];
      
      // Required field validation
      if (!patient.firstName) errors.push('First name is required');
      if (!patient.lastName) errors.push('Last name is required');
      if (!patient.nationalId) errors.push('National ID is required');
      if (!patient.dateOfBirth) errors.push('Date of birth is required');
      if (!patient.phone) errors.push('Phone number is required');
      
      // National ID format validation
      if (patient.nationalId && patient.nationalId.length !== 13) {
        errors.push('National ID must be 13 digits');
      }
      
      // Duplicate National ID check
      const existingPatient = patients.find(p => p.nationalId === patient.nationalId);
      if (existingPatient) {
        warnings.push(`Duplicate National ID - existing patient: ${existingPatient.firstName} ${existingPatient.lastName}`);
      }
      
      // Date format validation
      if (patient.dateOfBirth && !Date.parse(patient.dateOfBirth)) {
        errors.push('Invalid date format');
      }
      
      return {
        ...patient,
        isValid: errors.length === 0,
        errors,
        warnings
      };
    });
    
    setValidationResults(results);
    setIsValidating(false);
    setStep('preview');
  };

  const importValidPatients = () => {
    const validPatients = validationResults.filter(p => p.isValid);
    
    validPatients.forEach(patientData => {
      const newPatient = {
        hn: HNGenerator.generateUniqueHN(patients),
        nationalId: patientData.nationalId,
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        firstNameEn: patientData.firstNameEn || '',
        lastNameEn: patientData.lastNameEn || '',
        dateOfBirth: patientData.dateOfBirth,
        gender: patientData.gender || 'male',
        phone: patientData.phone,
        email: patientData.email || '',
        address: patientData.address || '',
        bloodType: patientData.bloodType || '',
        allergies: patientData.allergies ? patientData.allergies.split(';').map(a => a.trim()) : [],
        emergencyContact: {
          name: patientData.emergencyContactName || '',
          relationship: patientData.emergencyContactRelationship || '',
          phone: patientData.emergencyContactPhone || ''
        },
        createdAt: new Date().toISOString(),
        lastVisit: null
      };
      
      addPatient(newPatient);
    });
    
    onClose();
  };

  const downloadTemplate = () => {
    const csvTemplate = [
      'firstName,lastName,firstNameEn,lastNameEn,nationalId,dateOfBirth,gender,phone,email,address,bloodType,allergies,emergencyContactName,emergencyContactRelationship,emergencyContactPhone',
      'สมชาย,ใจดี,Somchai,Jaidee,1234567890123,1985-06-15,male,081-234-5678,somchai@email.com,123 ถนนสุขุมวิท กรุงเทพฯ,O+,Penicillin;Seafood,สมหญิง ใจดี,spouse,081-234-5679'
    ].join('\n');
    
    const blob = new Blob([csvTemplate], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'patient-import-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-auto"
          >
            <div className="p-6 border-b border-medical-100">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-medical-800">Import Patients</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-medical-400 hover:text-medical-600 transition-colors"
                >
                  <SafeIcon icon={FiX} className="text-xl" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {step === 'upload' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <SafeIcon icon={FiUpload} className="text-2xl text-primary-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-medical-800 mb-2">Import Patient Data</h3>
                    <p className="text-medical-500 mb-6">Upload a CSV file to import multiple patients at once</p>
                  </div>

                  <div className="border-2 border-dashed border-medical-200 rounded-lg p-8 text-center">
                    <SafeIcon icon={FiFile} className="text-4xl text-medical-400 mx-auto mb-4" />
                    <p className="text-medical-600 mb-4">Drag and drop your CSV file here, or click to browse</p>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
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
                    <div className="flex items-start space-x-3">
                      <SafeIcon icon={FiDownload} className="text-blue-600 text-lg mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800 mb-2">CSV Format Requirements:</h4>
                        <ul className="text-sm text-blue-700 space-y-1 mb-3">
                          <li>• First row must contain column headers</li>
                          <li>• Required columns: firstName, lastName, nationalId, dateOfBirth, phone</li>
                          <li>• Optional columns: firstNameEn, lastNameEn, gender, email, address, bloodType, allergies</li>
                          <li>• Date format: YYYY-MM-DD</li>
                          <li>• Allergies: separate multiple with semicolon (;)</li>
                        </ul>
                        <button
                          onClick={downloadTemplate}
                          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
                        >
                          <SafeIcon icon={FiDownload} />
                          <span>Download Template</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 'preview' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-medical-800">Import Preview</h3>
                    <div className="flex space-x-4 text-sm">
                      <span className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Valid: {validationResults.filter(p => p.isValid).length}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>Invalid: {validationResults.filter(p => !p.isValid).length}</span>
                      </span>
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto border border-medical-200 rounded-lg">
                    <table className="w-full">
                      <thead className="bg-medical-50 sticky top-0">
                        <tr>
                          <th className="text-left px-4 py-3 text-sm font-medium text-medical-700">Row</th>
                          <th className="text-left px-4 py-3 text-sm font-medium text-medical-700">Status</th>
                          <th className="text-left px-4 py-3 text-sm font-medium text-medical-700">Name</th>
                          <th className="text-left px-4 py-3 text-sm font-medium text-medical-700">National ID</th>
                          <th className="text-left px-4 py-3 text-sm font-medium text-medical-700">Issues</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-medical-100">
                        {validationResults.map((patient, index) => (
                          <tr key={index} className={patient.isValid ? 'bg-green-50' : 'bg-red-50'}>
                            <td className="px-4 py-3 text-sm text-medical-600">{patient.rowIndex}</td>
                            <td className="px-4 py-3">
                              {patient.isValid ? (
                                <SafeIcon icon={FiCheck} className="text-green-600" />
                              ) : (
                                <SafeIcon icon={FiAlertTriangle} className="text-red-600" />
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-medical-800">
                              {patient.firstName} {patient.lastName}
                            </td>
                            <td className="px-4 py-3 text-sm text-medical-600">{patient.nationalId}</td>
                            <td className="px-4 py-3 text-sm">
                              {patient.errors.map((error, idx) => (
                                <div key={idx} className="text-red-600">{error}</div>
                              ))}
                              {patient.warnings.map((warning, idx) => (
                                <div key={idx} className="text-yellow-600">{warning}</div>
                              ))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-end space-x-4">
                    <button
                      onClick={() => setStep('upload')}
                      className="px-6 py-2 text-medical-600 border border-medical-200 rounded-lg hover:bg-medical-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={importValidPatients}
                      disabled={validationResults.filter(p => p.isValid).length === 0}
                      className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Import {validationResults.filter(p => p.isValid).length} Valid Patients
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PatientImportModal;