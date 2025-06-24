import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import useStore from '../../store/useStore';

const { FiX, FiSave, FiPlus, FiTrash2, FiCopy, FiEdit } = FiIcons;

const MedicationTemplateModal = ({ isOpen, onClose, onApplyTemplate }) => {
  const { medicationTemplates, addMedicationTemplate, deleteMedicationTemplate } = useStore();
  const [activeTab, setActiveTab] = useState('browse');
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    medications: [{ medication: '', dosage: '', instructions: '' }]
  });

  const handleSaveTemplate = (e) => {
    e.preventDefault();
    const template = {
      ...newTemplate,
      medications: newTemplate.medications.filter(med => med.medication.trim())
    };
    addMedicationTemplate(template);
    setNewTemplate({
      name: '',
      description: '',
      medications: [{ medication: '', dosage: '', instructions: '' }]
    });
    setActiveTab('browse');
  };

  const addMedication = () => {
    setNewTemplate({
      ...newTemplate,
      medications: [...newTemplate.medications, { medication: '', dosage: '', instructions: '' }]
    });
  };

  const updateMedication = (index, field, value) => {
    const updatedMedications = newTemplate.medications.map((med, idx) =>
      idx === index ? { ...med, [field]: value } : med
    );
    setNewTemplate({ ...newTemplate, medications: updatedMedications });
  };

  const removeMedication = (index) => {
    const updatedMedications = newTemplate.medications.filter((_, idx) => idx !== index);
    setNewTemplate({ ...newTemplate, medications: updatedMedications });
  };

  const handleApplyTemplate = (template) => {
    onApplyTemplate(template.medications);
    onClose();
  };

  return (
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
                <h2 className="text-2xl font-bold text-medical-800">Medication Templates</h2>
                <button
                  onClick={onClose}
                  className="p-2 text-medical-400 hover:text-medical-600 transition-colors"
                >
                  <SafeIcon icon={FiX} className="text-xl" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-medical-100">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('browse')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'browse'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-medical-500 hover:text-medical-700'
                  }`}
                >
                  Browse Templates
                </button>
                <button
                  onClick={() => setActiveTab('create')}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'create'
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-medical-500 hover:text-medical-700'
                  }`}
                >
                  Create Template
                </button>
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'browse' && (
                <div className="space-y-4">
                  {medicationTemplates.length === 0 ? (
                    <div className="text-center py-8 text-medical-500">
                      <SafeIcon icon={FiSave} className="text-4xl mx-auto mb-4" />
                      <p className="text-lg">No medication templates found</p>
                      <p className="text-sm">Create your first template to get started</p>
                    </div>
                  ) : (
                    medicationTemplates.map((template, index) => (
                      <motion.div
                        key={template.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-medical-200 rounded-lg p-4 hover:bg-medical-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-medical-800">{template.name}</h3>
                            <p className="text-sm text-medical-500">{template.description}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApplyTemplate(template)}
                              className="px-3 py-1 bg-primary-500 text-white text-sm rounded hover:bg-primary-600 transition-colors"
                            >
                              Apply
                            </button>
                            <button
                              onClick={() => deleteMedicationTemplate(template.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            >
                              <SafeIcon icon={FiTrash2} className="text-sm" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {template.medications.map((med, idx) => (
                            <div key={idx} className="bg-medical-50 rounded p-3">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                <div>
                                  <span className="font-medium text-medical-700">Medication:</span>
                                  <p className="text-medical-600">{med.medication}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-medical-700">Dosage:</span>
                                  <p className="text-medical-600">{med.dosage}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-medical-700">Instructions:</span>
                                  <p className="text-medical-600">{med.instructions}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'create' && (
                <form onSubmit={handleSaveTemplate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-medical-700 mb-2">
                        Template Name *
                      </label>
                      <input
                        type="text"
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                        className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., Common Cold Treatment"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-medical-700 mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        value={newTemplate.description}
                        onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                        className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Brief description of the template"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-medical-800">Medications</h3>
                      <button
                        type="button"
                        onClick={addMedication}
                        className="flex items-center space-x-2 text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-lg transition-colors"
                      >
                        <SafeIcon icon={FiPlus} />
                        <span>Add Medication</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {newTemplate.medications.map((med, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-medical-200 rounded-lg">
                          <div>
                            <label className="block text-sm font-medium text-medical-700 mb-1">
                              Medication
                            </label>
                            <input
                              type="text"
                              value={med.medication}
                              onChange={(e) => updateMedication(index, 'medication', e.target.value)}
                              className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="Medication name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-medical-700 mb-1">
                              Dosage
                            </label>
                            <input
                              type="text"
                              value={med.dosage}
                              onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                              className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="e.g., 1 tab PO BID"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-medical-700 mb-1">
                              Instructions
                            </label>
                            <input
                              type="text"
                              value={med.instructions}
                              onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                              className="w-full px-3 py-2 border border-medical-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="e.g., รับประทานหลังอาหาร"
                            />
                          </div>
                          <div className="flex items-end">
                            <button
                              type="button"
                              onClick={() => removeMedication(index)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <SafeIcon icon={FiTrash2} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-4 pt-6 border-t border-medical-100">
                    <button
                      type="button"
                      onClick={() => setActiveTab('browse')}
                      className="px-6 py-2 text-medical-600 border border-medical-200 rounded-lg hover:bg-medical-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center space-x-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                      <SafeIcon icon={FiSave} />
                      <span>Save Template</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MedicationTemplateModal;