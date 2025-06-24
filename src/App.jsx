import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import PatientList from './components/Patients/PatientList';
import PatientProfile from './components/Patients/PatientProfile';
import AppointmentList from './components/Appointments/AppointmentList';
import MedicalRecords from './components/MedicalRecords/MedicalRecords';
import Inventory from './components/Inventory/Inventory';
import Vouchers from './components/Vouchers/Vouchers';
import Reports from './components/Reports/Reports';
import useStore from './store/useStore';

function App() {
  const { user } = useStore();

  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      <Layout>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/patients" element={<PatientList />} />
            <Route path="/patients/:id" element={<PatientProfile />} />
            <Route path="/appointments" element={<AppointmentList />} />
            <Route path="/medical-records" element={<MedicalRecords />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/vouchers" element={<Vouchers />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </motion.div>
      </Layout>
    </Router>
  );
}

export default App;