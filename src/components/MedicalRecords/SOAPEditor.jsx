import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import useStore from '../../store/useStore';
import MedicationTemplateModal from './MedicationTemplateModal';

const { FiX, FiUser, FiActivity, FiZap, FiSave, FiPlus, FiTrash2, FiBookOpen } = FiIcons;

const SOAPEditor = ({ isOpen, onClose, record }) => {
  const { patients, addMedicalRecord, medicationTemplates } = useStore();
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    date: new Date().toISOString().split('T')[0],
    doctor: 'นพ.สมหมาย รักษาคน',
    chiefComplaint: '',
    soap: {
      subjective: '',
      objective: '',
      assessment: '',
      plan: ''
    },
    vitals: {
      temperature: '',
      pulse: '',
      respiratoryRate: '',
      bloodPressure: '',
      weight: '',
      height: ''
    },
    prescriptions: [],
    saveAsTemplate: false,
    templateName: ''
  });

  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  useEffect(() => {
    if (record) {
      setFormData(record);
    }
  }, [record]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save medical record
    addMedicalRecord(formData);
    
    // Save as template if requested
    if (formData.saveAsTemplate && formData.templateName && formData.prescriptions.length > 0) {
      const template = {
        name: formData.templateName,
        description: `Template for ${formData.chiefComplaint}`,
        medications: formData.prescriptions
      };
      // This would be handled by the store
    }
    
    onClose();
  };

  const generateAISuggestion = async (section) => {
    setIsGeneratingAI(true);
    
    // Simulate AI generation with more realistic medical content
    setTimeout(() => {
      const suggestions = {
        subjective: `ผู้ป่วยมาด้วยอาการ${formData.chiefComplaint} เริ่มมีอาการเมื่อ 2-3 วันที่แล้ว อาการค่อยๆ รุนแรงขึ้น ไม่มีไข้ ไม่มีคลื่นไส้อาเจียน รับประทานอาหารได้ปกติ ไม่มีประวัติแพ้ยา`,
        
        objective: `General appearance: Alert, cooperative, no acute distress
Vital signs: T ${formData.vitals.temperature || '36.5'}°C, P ${formData.vitals.pulse || '80'}/min, R ${formData.vitals.respiratoryRate || '18'}/min, BP ${formData.vitals.bloodPressure || '120/80'} mmHg
Physical examination: Within normal limits for chief complaint
No obvious abnormalities noted`,

        assessment: `${formData.chiefComplaint} - likely functional disorder
No red flag signs present
Stable vital signs
Patient appears comfortable
Consider symptomatic treatment`,

        plan: `1. Symptomatic treatment as indicated
2. Patient education regarding condition
3. Follow up in 1 week if symptoms persist
4. Return immediately if symptoms worsen
5. Consider further investigation if no improvement`
      };
      
      setAiSuggestion(suggestions[section] || '');
      setIsGeneratingAI(false);
    }, 1500);
  };

  const addPrescription = () => {
    setFormData({
      ...formData,
      prescriptions: [
        ...formData.prescriptions,
        { medication: '', dosage: '', quantity: '', instructions: '' }
      ]
    });
  };

  const updatePrescription = (index, field, value) => {
    const updatedPrescriptions = formData.prescriptions.map((prescription, idx) =>
      idx === index ? { ...prescription, [field]: value } : prescription
    );
    setFormData({ ...formData, prescriptions: updatedPrescriptions });
  };

  const removePrescription = (index) => {
    const updatedPrescriptions = formData.prescriptions.filter((_, idx) => idx !== index);
    setFormData({ ...formData, prescriptions: updatedPrescriptions });
  };

  const applyMedicationTemplate = (medications) => {
    setFormData({ ...formData, prescriptions: medications });
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
              className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-auto"
            >
              <div className="p-6 border-b border-medical-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-medical-800">
                    {record ? 'Edit Medical Record' : 'New Medical Record'}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 text-medical-400 hover:text-medical-600 transition-colors"
                  >
                    <SafeIcon icon={FiX} className="text-xl" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Patient and Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-medical-700 mb-2">
                      Patient *
                    </label>
                    <select
                      value={formData.patientId}
                      onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                      className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a patient</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.hn} - {patient.firstName} {patient.lastName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-medical-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
                      required
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-medical-700 mb-2">
                      Doctor *
                    </label>
                    <select
                      value={formData.doctor}
                      onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                      className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="นพ.สมหมาย รักษาคน">นพ.สมหมาย รักษาคน</option>
                      <option value="พญ.สมหญิง ใจดี">พญ.สมหญิง ใจดี</option>
                      <option value="นพ.สมศักดิ์ หัวใจดี">นพ.สมศักดิ์ หัวใจดี</option>
                    </select>
                  </div>
                </div>

                {/* Chief Complaint */}
                <div>
                  <label className="block text-sm font-medium text-medical-700 mb-2">
                    Chief Complaint *
                  </label>
                  <input
                    type="text"
                    value={formData.chiefComplaint}
                    onChange={(e) => setFormData({ ...formData, chiefComplaint: e.target.value })}
                    placeholder="e.g., ปวดท้อง, ไข้, ปวดหัว"
                    className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Vitals */}
                <div>
                  <h3 className="text-lg font-semibold text-medical-800 mb-4">Vital Signs</h3>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-medical-700 mb-2">
                        Temperature (°C)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.vitals.temperature}
                        onChange={(e) => setFormData({
                          ...formData,
                          vitals: { ...formData.vitals, temperature: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-medical-700 mb-2">
                        Pulse (/min)
                      </label>
                      <input
                        type="number"
                        value={formData.vitals.pulse}
                        onChange={(e) => setFormData({
                          ...formData,
                          vitals: { ...formData.vitals, pulse: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-medical-700 mb-2">
                        Respiratory Rate
                      </label>
                      <input
                        type="number"
                        value={formData.vitals.respiratoryRate}
                        onChange={(e) => setFormData({
                          ...formData,
                          vitals: { ...formData.vitals, respiratoryRate: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-medical-700 mb-2">
                        Blood Pressure
                      </label>
                      <input
                        type="text"
                        value={formData.vitals.bloodPressure}
                        onChange={(e) => setFormData({
                          ...formData,
                          vitals: { ...formData.vitals, bloodPressure: e.target.value }
                        })}
                        placeholder="120/80"
                        className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-medical-700 mb-2">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.vitals.weight}
                        onChange={(e) => setFormData({
                          ...formData,
                          vitals: { ...formData.vitals, weight: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-medical-700 mb-2">
                        Height (cm)
                      </label>
                      <input
                        type="number"
                        value={formData.vitals.height}
                        onChange={(e) => setFormData({
                          ...formData,
                          vitals: { ...formData.vitals, height: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* SOAP Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {['subjective', 'objective', 'assessment', 'plan'].map((section) => (
                    <div key={section} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-medical-700">
                          {section.charAt(0).toUpperCase() + section.slice(1)} *
                        </label>
                        <button
                          type="button"
                          onClick={() => generateAISuggestion(section)}
                          disabled={isGeneratingAI}
                          className="flex items-center space-x-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
                        >
                          <SafeIcon icon={FiZap} className="text-xs" />
                          <span>AI Assist</span>
                        </button>
                      </div>
                      
                      <textarea
                        value={formData.soap[section]}
                        onChange={(e) => setFormData({
                          ...formData,
                          soap: { ...formData.soap, [section]: e.target.value }
                        })}
                        rows={4}
                        className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                      
                      {aiSuggestion && (
                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <p className="text-sm text-purple-700 mb-2">AI Suggestion:</p>
                          <p className="text-sm text-purple-600 whitespace-pre-wrap">{aiSuggestion}</p>
                          <div className="flex space-x-2 mt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setFormData({
                                  ...formData,
                                  soap: { ...formData.soap, [section]: aiSuggestion }
                                });
                                setAiSuggestion('');
                              }}
                              className="text-xs bg-purple-600 text-white px-2 py-1 rounded"
                            >
                              Use Suggestion
                            </button>
                            <button
                              type="button"
                              onClick={() => setAiSuggestion('')}
                              className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Prescriptions */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-medical-800">Prescriptions</h3>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowTemplateModal(true)}
                        className="flex items-center space-x-2 text-green-600 hover:bg-green-50 px-3 py-2 rounded-lg transition-colors"
                      >
                        <SafeIcon icon={FiBookOpen} />
                        <span>Medication Templates</span>
                      </button>
                      <button
                        type="button"
                        onClick={addPrescription}
                        className="flex items-center space-x-2 text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-lg transition-colors"
                      >
                        <SafeIcon icon={FiPlus} />
                        <span>Add Prescription</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {formData.prescriptions.map((prescription, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-medical-200 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-medical-700 mb-1">
                            Medication
                          </label>
                          <input
                            type="text"
                            value={prescription.medication}
                            onChange={(e) => updatePrescription(index, 'medication', e.target.value)}
                            className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-medical-700 mb-1">
                            Dosage
                          </label>
                          <input
                            type="text"
                            value={prescription.dosage}
                            onChange={(e) => updatePrescription(index, 'dosage', e.target.value)}
                            placeholder="e.g., 1 tab PO BID"
                            className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-medical-700 mb-1">
                            Quantity
                          </label>
                          <input
                            type="number"
                            value={prescription.quantity}
                            onChange={(e) => updatePrescription(index, 'quantity', e.target.value)}
                            className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-medical-700 mb-1">
                            Instructions
                          </label>
                          <input
                            type="text"
                            value={prescription.instructions}
                            onChange={(e) => updatePrescription(index, 'instructions', e.target.value)}
                            placeholder="e.g., รับประทานหลังอาหาร"
                            className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>

                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => removePrescription(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <SafeIcon icon={FiTrash2} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {formData.prescriptions.length === 0 && (
                      <div className="text-center py-8 text-medical-500">
                        <p>No prescriptions added</p>
                        <p className="text-sm">Click "Add Prescription" or use templates</p>
                      </div>
                    )}
                  </div>

                  {/* Save as Template Option */}
                  {formData.prescriptions.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <input
                          id="saveAsTemplate"
                          type="checkbox"
                          checked={formData.saveAsTemplate}
                          onChange={(e) => setFormData({ ...formData, saveAsTemplate: e.target.checked })}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-medical-300 rounded"
                        />
                        <label htmlFor="saveAsTemplate" className="text-sm font-medium text-blue-800">
                          Save as Medication Template
                        </label>
                      </div>
                      
                      {formData.saveAsTemplate && (
                        <div className="mt-3">
                          <input
                            type="text"
                            value={formData.templateName}
                            onChange={(e) => setFormData({ ...formData, templateName: e.target.value })}
                            placeholder="Enter template name (e.g., Common Cold Treatment)"
                            className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      )}
                    </div>
                  )}
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
                    className="flex items-center space-x-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    <SafeIcon icon={FiSave} />
                    <span>Save Record</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <MedicationTemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onApplyTemplate={applyMedicationTemplate}
      />
    </>
  );
};

export default SOAPEditor;