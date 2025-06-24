import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import useStore from '../../store/useStore';

const { 
  FiArrowLeft, FiUser, FiPhone, FiMail, FiMapPin, FiCalendar, 
  FiFileText, FiActivity, FiAlertCircle, FiEdit, FiCamera 
} = FiIcons;

const PatientProfile = () => {
  const { id } = useParams();
  const { patients, medicalRecords, appointments } = useStore();
  const [activeTab, setActiveTab] = useState('overview');

  const patient = patients.find(p => p.id === id);
  const patientRecords = medicalRecords.filter(r => r.patientId === id);
  const patientAppointments = appointments.filter(a => a.patientId === id);

  if (!patient) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-medical-500">Patient not found</p>
        <Link to="/patients" className="text-primary-600 hover:text-primary-700">
          Back to patients list
        </Link>
      </div>
    );
  }

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

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FiUser },
    { id: 'records', name: 'Medical Records', icon: FiFileText },
    { id: 'appointments', name: 'Appointments', icon: FiCalendar },
    { id: 'imaging', name: 'Imaging', icon: FiCamera },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-4"
      >
        <Link
          to="/patients"
          className="p-2 text-medical-600 hover:bg-medical-50 rounded-lg transition-colors"
        >
          <SafeIcon icon={FiArrowLeft} className="text-xl" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-medical-800">
            {patient.firstName} {patient.lastName}
          </h1>
          <p className="text-medical-500">Patient Profile</p>
        </div>
      </motion.div>

      {/* Patient Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-medical-100 p-6"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiUser} className="text-3xl text-primary-600" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-medical-800">
                {patient.firstName} {patient.lastName}
              </h2>
              {patient.firstNameEn && (
                <p className="text-lg text-medical-600">
                  {patient.firstNameEn} {patient.lastNameEn}
                </p>
              )}
              <div className="flex items-center space-x-4 text-sm text-medical-500">
                <span>ID: {patient.nationalId}</span>
                <span>•</span>
                <span>{calculateAge(patient.dateOfBirth)} years old</span>
                <span>•</span>
                <span className="capitalize">{patient.gender}</span>
                {patient.bloodType && (
                  <>
                    <span>•</span>
                    <span>Blood type: {patient.bloodType}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button className="flex items-center space-x-2 text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-lg transition-colors">
            <SafeIcon icon={FiEdit} />
            <span>Edit</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-medical-100">
          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiPhone} className="text-medical-400" />
            <div>
              <p className="text-sm text-medical-500">Phone</p>
              <p className="font-medium text-medical-800">{patient.phone}</p>
            </div>
          </div>
          
          {patient.email && (
            <div className="flex items-center space-x-3">
              <SafeIcon icon={FiMail} className="text-medical-400" />
              <div>
                <p className="text-sm text-medical-500">Email</p>
                <p className="font-medium text-medical-800">{patient.email}</p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3">
            <SafeIcon icon={FiCalendar} className="text-medical-400" />
            <div>
              <p className="text-sm text-medical-500">Last Visit</p>
              <p className="font-medium text-medical-800">
                {patient.lastVisit 
                  ? new Date(patient.lastVisit).toLocaleDateString('th-TH')
                  : 'Never'
                }
              </p>
            </div>
          </div>
        </div>

        {patient.allergies && patient.allergies.length > 0 && (
          <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center space-x-2 mb-2">
              <SafeIcon icon={FiAlertCircle} className="text-red-600" />
              <h3 className="font-medium text-red-800">Allergies</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {patient.allergies.map((allergy, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"
                >
                  {allergy}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-medical-100"
      >
        <div className="border-b border-medical-100">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-medical-500 hover:text-medical-700'
                }`}
              >
                <SafeIcon icon={tab.icon} />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-medical-800 mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-medical-500">Date of Birth</p>
                      <p className="font-medium text-medical-800">
                        {new Date(patient.dateOfBirth).toLocaleDateString('th-TH')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-medical-500">Address</p>
                      <p className="font-medium text-medical-800">{patient.address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-medical-800 mb-4">Emergency Contact</h3>
                  {patient.emergencyContact ? (
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-medical-500">Name</p>
                        <p className="font-medium text-medical-800">{patient.emergencyContact.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-medical-500">Relationship</p>
                        <p className="font-medium text-medical-800 capitalize">{patient.emergencyContact.relationship}</p>
                      </div>
                      <div>
                        <p className="text-sm text-medical-500">Phone</p>
                        <p className="font-medium text-medical-800">{patient.emergencyContact.phone}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-medical-500">No emergency contact information</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'records' && (
            <div className="space-y-4">
              {patientRecords.length === 0 ? (
                <div className="text-center py-8 text-medical-500">
                  <SafeIcon icon={FiFileText} className="text-3xl mx-auto mb-2" />
                  <p>No medical records found</p>
                </div>
              ) : (
                patientRecords.map((record) => (
                  <div key={record.id} className="border border-medical-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-medical-800">
                          {new Date(record.date).toLocaleDateString('th-TH')}
                        </p>
                        <p className="text-sm text-medical-500">Dr. {record.doctor}</p>
                      </div>
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                        {record.chiefComplaint}
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="font-medium text-medical-700">Assessment:</p>
                        <p className="text-medical-600">{record.soap.assessment}</p>
                      </div>
                      <div>
                        <p className="font-medium text-medical-700">Plan:</p>
                        <p className="text-medical-600">{record.soap.plan}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="space-y-4">
              {patientAppointments.length === 0 ? (
                <div className="text-center py-8 text-medical-500">
                  <SafeIcon icon={FiCalendar} className="text-3xl mx-auto mb-2" />
                  <p>No appointments found</p>
                </div>
              ) : (
                patientAppointments.map((appointment) => (
                  <div key={appointment.id} className="border border-medical-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-medical-800">
                          {new Date(appointment.date).toLocaleDateString('th-TH')} at {appointment.time}
                        </p>
                        <p className="text-sm text-medical-500">{appointment.type} - {appointment.doctor}</p>
                        {appointment.notes && (
                          <p className="text-sm text-medical-600 mt-1">{appointment.notes}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        appointment.status === 'completed' 
                          ? 'bg-green-100 text-green-700'
                          : appointment.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'imaging' && (
            <div className="text-center py-8 text-medical-500">
              <SafeIcon icon={FiCamera} className="text-3xl mx-auto mb-2" />
              <p>No imaging records found</p>
              <p className="text-sm">Imaging history will appear here</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PatientProfile;