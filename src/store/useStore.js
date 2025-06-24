import { create } from 'zustand';

const useStore = create((set, get) => ({
  // Auth state
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null, currentPatient: null }),

  // Current patient
  currentPatient: null,
  setCurrentPatient: (patient) => set({ currentPatient: patient }),

  // Patients with HN
  patients: [
    {
      id: '1',
      hn: 'HN000001',
      nationalId: '1234567890123',
      firstName: 'สมชาย',
      lastName: 'ใจดี',
      firstNameEn: 'Somchai',
      lastNameEn: 'Jaidee',
      dateOfBirth: '1985-06-15',
      gender: 'male',
      phone: '081-234-5678',
      email: 'somchai@email.com',
      address: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
      bloodType: 'O+',
      allergies: ['Penicillin', 'Seafood'],
      emergencyContact: {
        name: 'สมหญิง ใจดี',
        relationship: 'spouse',
        phone: '081-234-5679'
      },
      createdAt: '2024-01-15T10:30:00Z',
      lastVisit: '2024-12-15T14:30:00Z'
    },
    {
      id: '2',
      hn: 'HN000002',
      nationalId: '2345678901234',
      firstName: 'สมหญิง',
      lastName: 'สวยงาม',
      firstNameEn: 'Somying',
      lastNameEn: 'Suayngam',
      dateOfBirth: '1990-03-22',
      gender: 'female',
      phone: '082-345-6789',
      email: 'somying@email.com',
      address: '456 ถนนรัชดาภิเษก แขวงห้วยขวาง เขตห้วยขวาง กรุงเทพฯ 10310',
      bloodType: 'A+',
      allergies: ['Aspirin'],
      emergencyContact: {
        name: 'สมศักดิ์ สวยงาม',
        relationship: 'father',
        phone: '081-345-6789'
      },
      createdAt: '2024-02-20T09:15:00Z',
      lastVisit: '2024-12-10T11:45:00Z'
    }
  ],
  
  addPatient: (patient) => set((state) => ({
    patients: [...state.patients, { ...patient, id: Date.now().toString() }]
  })),
  
  updatePatient: (id, updatedPatient) => set((state) => ({
    patients: state.patients.map(p => p.id === id ? { ...p, ...updatedPatient } : p)
  })),

  // Medication Templates
  medicationTemplates: [
    {
      id: '1',
      name: 'Common Cold Treatment',
      description: 'Standard treatment for common cold symptoms',
      medications: [
        { medication: 'Paracetamol 500mg', dosage: '1 tab PO q6h PRN fever', instructions: 'รับประทานเมื่อมีไข้' },
        { medication: 'Chlorpheniramine 4mg', dosage: '1 tab PO BID', instructions: 'รับประทานหลังอาหาร' }
      ]
    },
    {
      id: '2',
      name: 'Hypertension Management',
      description: 'Basic hypertension medication set',
      medications: [
        { medication: 'Amlodipine 5mg', dosage: '1 tab PO daily', instructions: 'รับประทานตอนเช้า' },
        { medication: 'Losartan 50mg', dosage: '1 tab PO daily', instructions: 'รับประทานตอนเช้า' }
      ]
    }
  ],
  
  addMedicationTemplate: (template) => set((state) => ({
    medicationTemplates: [...state.medicationTemplates, { ...template, id: Date.now().toString() }]
  })),
  
  deleteMedicationTemplate: (id) => set((state) => ({
    medicationTemplates: state.medicationTemplates.filter(t => t.id !== id)
  })),

  // Appointments
  appointments: [
    {
      id: '1',
      patientId: '1',
      patientName: 'สมชาย ใจดี',
      date: '2024-12-20',
      time: '09:00',
      type: 'consultation',
      status: 'scheduled',
      doctor: 'นพ.สมหมาย รักษาคน',
      notes: 'ตรวจสุขภาพประจำปี'
    },
    {
      id: '2',
      patientId: '2',
      patientName: 'สมหญิง สวยงาม',
      date: '2024-12-20',
      time: '10:30',
      type: 'follow-up',
      status: 'scheduled',
      doctor: 'นพ.สมหมาย รักษาคน',
      notes: 'ติดตามผลการรักษา'
    },
    {
      id: '3',
      patientId: '1',
      patientName: 'สมชาย ใจดี',
      date: '2024-12-19',
      time: '14:00',
      type: 'consultation',
      status: 'completed',
      doctor: 'นพ.สมหมาย รักษาคน',
      notes: 'ปวดท้อง'
    }
  ],
  
  addAppointment: (appointment) => set((state) => ({
    appointments: [...state.appointments, { ...appointment, id: Date.now().toString() }]
  })),
  
  updateAppointment: (id, updatedAppointment) => set((state) => ({
    appointments: state.appointments.map(a => a.id === id ? { ...a, ...updatedAppointment } : a)
  })),

  // Medical Records
  medicalRecords: [
    {
      id: '1',
      patientId: '1',
      date: '2024-12-19',
      doctor: 'นพ.สมหมาย รักษาคน',
      chiefComplaint: 'ปวดท้องมา 2 วัน',
      soap: {
        subjective: 'ผู้ป่วยมาด้วยอาการปวดท้องบริเวณขวาล่าง เริ่มปวดเมื่อ 2 วันที่แล้ว ปวดแบบจุกเสียดแล้วค่อยๆ รุนแรงขึ้น ไม่มีไข้ ไม่มีคลื่นไส้อาเจียน',
        objective: 'T 36.8°C, P 78/min, R 18/min, BP 120/80 mmHg\nAbdomen: soft, tenderness at RLQ, no rebound tenderness\nBowel sound: normal',
        assessment: 'Suspected appendicitis',
        plan: 'CBC, Urinalysis\nRefer to surgeon for further evaluation\nAdvise NPO\nFollow up in 24 hours if symptoms worsen'
      },
      vitals: {
        temperature: 36.8,
        pulse: 78,
        respiratoryRate: 18,
        bloodPressure: '120/80',
        weight: 68,
        height: 170
      },
      prescriptions: [
        {
          medication: 'Paracetamol 500mg',
          dosage: '1 tab PO q6h PRN pain',
          quantity: 20,
          instructions: 'รับประทานเมื่อปวด'
        }
      ],
      labResults: [],
      imaging: []
    }
  ],
  
  addMedicalRecord: (record) => set((state) => ({
    medicalRecords: [...state.medicalRecords, { ...record, id: Date.now().toString() }]
  })),

  // Inventory
  inventory: [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      category: 'medication',
      currentStock: 500,
      minStock: 100,
      maxStock: 1000,
      unitPrice: 2.50,
      supplier: 'Thai Pharma Co.',
      expiryDate: '2025-12-31',
      batchNumber: 'PAR2024001'
    },
    {
      id: '2',
      name: 'Amoxicillin 250mg',
      category: 'medication',
      currentStock: 200,
      minStock: 50,
      maxStock: 500,
      unitPrice: 8.75,
      supplier: 'Thai Pharma Co.',
      expiryDate: '2025-06-30',
      batchNumber: 'AMX2024001'
    },
    {
      id: '3',
      name: 'Digital Thermometer',
      category: 'equipment',
      currentStock: 10,
      minStock: 5,
      maxStock: 20,
      unitPrice: 150.00,
      supplier: 'Medical Equipment Ltd.',
      expiryDate: null,
      batchNumber: 'THERM2024001'
    }
  ],
  
  addInventoryItem: (item) => set((state) => ({
    inventory: [...state.inventory, { ...item, id: Date.now().toString() }]
  })),
  
  updateInventoryItem: (id, updatedItem) => set((state) => ({
    inventory: state.inventory.map(i => i.id === id ? { ...i, ...updatedItem } : i)
  })),

  // Vouchers
  vouchers: [
    {
      id: '1',
      code: 'CHECKUP20',
      type: 'percentage',
      value: 20,
      description: 'ส่วนลด 20% สำหรับการตรวจสุขภาพ',
      validFrom: '2024-12-01',
      validTo: '2024-12-31',
      usageLimit: 100,
      usedCount: 15,
      isActive: true
    },
    {
      id: '2',
      code: 'NEWPATIENT',
      type: 'fixed',
      value: 100,
      description: 'ส่วนลด 100 บาท สำหรับผู้ป่วยใหม่',
      validFrom: '2024-12-01',
      validTo: '2025-03-31',
      usageLimit: 50,
      usedCount: 8,
      isActive: true
    }
  ],
  
  addVoucher: (voucher) => set((state) => ({
    vouchers: [...state.vouchers, { ...voucher, id: Date.now().toString() }]
  })),
  
  updateVoucher: (id, updatedVoucher) => set((state) => ({
    vouchers: state.vouchers.map(v => v.id === id ? { ...v, ...updatedVoucher } : v)
  })),

  // Navigation
  currentPage: 'dashboard',
  setCurrentPage: (page) => set({ currentPage: page })
}));

export default useStore;