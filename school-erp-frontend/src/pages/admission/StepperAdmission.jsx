import { useState, useEffect } from 'react';
import { 
  CheckCircle2, Circle, ChevronRight, ChevronLeft, Upload, 
  X, Download, Printer, User, Users, MapPin, FileText, 
  CheckSquare, CreditCard, Eye, Edit2, Trash2
} from 'lucide-react';
import { useUser } from '../../context/UserContext.jsx';
import { ROLES } from '../../constants/roles.js';

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:4000';

const STAGES = [
  { id: 1, name: 'Student Details', icon: User, progress: 20 },
  { id: 2, name: 'Parent/Guardian', icon: Users, progress: 40 },
  { id: 3, name: 'Address Details', icon: MapPin, progress: 60 },
  { id: 4, name: 'Documents Upload', icon: FileText, progress: 80 },
  { id: 5, name: 'Review & Submit', icon: CheckSquare, progress: 100 }
];

const genderOptions = ['Male', 'Female', 'Other'];
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const religions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist', 'Other'];
const categories = ['General', 'OBC', 'SC', 'ST', 'Other'];
const relationTypes = ['Uncle', 'Aunt', 'Grandfather', 'Grandmother', 'Sibling', 'Other'];

const documentTypes = [
  'Birth Certificate',
  'Aadhaar Card',
  'Previous School TC',
  'Report Card',
  'Parent ID Proof',
  'Student Photo',
  'Medical Certificate',
  'Caste Certificate'
];

const inputCls = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

export default function StepperAdmission() {
  const { user } = useUser();
  const [currentStage, setCurrentStage] = useState(1);
  const [admissionId, setAdmissionId] = useState('');
  const [studentPhotoPreview, setStudentPhotoPreview] = useState(null);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [finalResult, setFinalResult] = useState(null);

  // Form Data States
  const [studentData, setStudentData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    gender: '',
    classApplyingFor: '',
    section: '',
    academicYear: '2026-2027',
    studentPhoto: null,
    previousSchool: '',
    religion: '',
    category: '',
    bloodGroup: '',
    aadhar: '',
    contactNumber: ''
  });

  const [parentData, setParentData] = useState({
    fatherName: '',
    fatherMobile: '',
    fatherEmail: '',
    fatherOccupation: '',
    fatherIncome: '',
    motherName: '',
    motherMobile: '',
    motherOccupation: '',
    guardianName: '',
    guardianRelation: '',
    guardianContact: '',
    sameContact: false
  });

  const [addressData, setAddressData] = useState({
    currentLine1: '',
    currentLine2: '',
    currentCity: '',
    currentDistrict: '',
    currentState: '',
    currentCountry: 'India',
    currentPincode: '',
    sameAsCurrent: true,
    permanentLine1: '',
    permanentLine2: '',
    permanentCity: '',
    permanentDistrict: '',
    permanentState: '',
    permanentCountry: 'India',
    permanentPincode: ''
  });

  const [documents, setDocuments] = useState([]);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const normalizedRole = String(user?.role ?? '').toLowerCase();
  const isAdmin = [ROLES.ADMIN, ROLES.SUPER_ADMIN]
    .map(r => String(r).toLowerCase())
    .includes(normalizedRole);

  // Load classes on mount
  useEffect(() => {
    if (isAdmin) {
      loadClasses();
    }
  }, [isAdmin]);

  // Generate Admission ID on mount
  useEffect(() => {
    if (!admissionId && isAdmin) {
      const timestamp = Date.now();
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const newAdmissionId = `ADM${timestamp.toString().slice(-6)}${randomNum}`;
      setAdmissionId(newAdmissionId);
    }
  }, [isAdmin]);

  // Auto-copy address when checkbox changes
  useEffect(() => {
    if (addressData.sameAsCurrent) {
      setAddressData(prev => ({
        ...prev,
        permanentLine1: prev.currentLine1,
        permanentLine2: prev.currentLine2,
        permanentCity: prev.currentCity,
        permanentDistrict: prev.currentDistrict,
        permanentState: prev.currentState,
        permanentCountry: prev.currentCountry,
        permanentPincode: prev.currentPincode
      }));
    }
  }, [
    addressData.sameAsCurrent,
    addressData.currentLine1,
    addressData.currentLine2,
    addressData.currentCity,
    addressData.currentDistrict,
    addressData.currentState,
    addressData.currentCountry,
    addressData.currentPincode
  ]);

  const loadClasses = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/classes`, {
        headers: {
          Authorization: `Bearer ${user?.token || localStorage.getItem('token')}`
        }
      });
      const json = await res.json();
      if (json.success && json.data) {
        setClasses(json.data);
      }
    } catch (err) {
      console.error('Failed to load classes:', err);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age > 0 ? `${age} years` : '';
  };

  const handleStudentPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      setStudentData(prev => ({ ...prev, studentPhoto: file }));
      const reader = new FileReader();
      reader.onloadend = () => setStudentPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingDoc(true);
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} exceeds 10MB limit`);
        continue;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocuments(prev => [...prev, {
          id: Date.now() + Math.random(),
          type: '',
          name: file.name,
          file: file,
          preview: reader.result
        }]);
      };
      reader.readAsDataURL(file);
    }
    setUploadingDoc(false);
    e.target.value = '';
  };

  const removeDocument = (docId) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
  };

  const updateDocumentType = (docId, type) => {
    setDocuments(prev => prev.map(d => d.id === docId ? { ...d, type } : d));
  };

  const validateStage1 = () => {
    const { firstName, lastName, dob, gender, classApplyingFor, contactNumber } = studentData;
    if (!firstName || !lastName || !dob || !gender || !classApplyingFor || !contactNumber) {
      alert('Please fill all required fields (*)');
      return false;
    }
    return true;
  };

  const validateStage2 = () => {
    const { fatherName, fatherMobile, motherName } = parentData;
    if (!fatherName || !fatherMobile || !motherName) {
      alert('Please fill all required parent fields (*)');
      return false;
    }
    // Basic phone validation
    if (!/^\d{10}$/.test(fatherMobile)) {
      alert('Father mobile must be 10 digits');
      return false;
    }
    return true;
  };

  const validateStage3 = () => {
    const { currentLine1, currentCity, currentDistrict, currentState, currentCountry, currentPincode } = addressData;
    if (!currentLine1 || !currentCity || !currentDistrict || !currentState || !currentCountry || !currentPincode) {
      alert('Please fill all required address fields (*)');
      return false;
    }
    if (!/^\d{6}$/.test(currentPincode)) {
      alert('PIN code must be 6 digits');
      return false;
    }
    return true;
  };

  const validateStage4 = () => {
    const birthCert = documents.find(d => d.type === 'Birth Certificate');
    if (!birthCert) {
      alert('Birth Certificate is mandatory');
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    // Validate current stage
    if (currentStage === 1 && !validateStage1()) return;
    if (currentStage === 2 && !validateStage2()) return;
    if (currentStage === 3 && !validateStage3()) return;
    if (currentStage === 4 && !validateStage4()) return;

    // Save draft (auto-save)
    await saveDraft();

    // Move to next stage
    if (currentStage < 5) {
      setCurrentStage(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStage > 1) {
      setCurrentStage(prev => prev - 1);
    }
  };

  const saveDraft = async () => {
    // Auto-save logic here (could save to localStorage or backend)
    console.log('Draft saved for:', admissionId);
    localStorage.setItem(`admission_draft_${admissionId}`, JSON.stringify({
      studentData,
      parentData,
      addressData,
      documents: documents.map(d => ({ id: d.id, type: d.type, name: d.name }))
    }));
  };

  const generateCredentials = (firstName) => {
    const suffix = Date.now().toString().slice(-4);
    const username = `STU${suffix}`;
    const password = `${(firstName || 'Stu').slice(0, 3).toLowerCase()}@${Math.floor(1000 + Math.random() * 9000)}`;
    return { username, password };
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    try {
      // Generate credentials
      const { username, password } = generateCredentials(studentData.firstName);

      // Prepare student payload
      const studentPayload = {
        admissionId,
        firstName: studentData.firstName,
        middleName: studentData.middleName,
        lastName: studentData.lastName,
        dateOfBirth: studentData.dob,
        gender: studentData.gender,
        class: studentData.classApplyingFor,
        section: studentData.section,
        academicYear: studentData.academicYear,
        previousSchool: studentData.previousSchool,
        religion: studentData.religion,
        category: studentData.category,
        bloodGroup: studentData.bloodGroup,
        aadharNumber: studentData.aadhar,
        mobileNumber: studentData.contactNumber,
        username,
        password,
        role: 'student',
        address: {
          current: {
            line1: addressData.currentLine1,
            line2: addressData.currentLine2,
            city: addressData.currentCity,
            district: addressData.currentDistrict,
            state: addressData.currentState,
            country: addressData.currentCountry,
            pincode: addressData.currentPincode
          },
          permanent: addressData.sameAsCurrent ? null : {
            line1: addressData.permanentLine1,
            line2: addressData.permanentLine2,
            city: addressData.permanentCity,
            district: addressData.permanentDistrict,
            state: addressData.permanentState,
            country: addressData.permanentCountry,
            pincode: addressData.permanentPincode
          }
        },
        parents: {
          father: {
            name: parentData.fatherName,
            mobile: parentData.fatherMobile,
            email: parentData.fatherEmail,
            occupation: parentData.fatherOccupation,
            annualIncome: parentData.fatherIncome
          },
          mother: {
            name: parentData.motherName,
            mobile: parentData.motherMobile,
            occupation: parentData.motherOccupation
          },
          guardian: parentData.guardianName ? {
            name: parentData.guardianName,
            relation: parentData.guardianRelation,
            contact: parentData.guardianContact
          } : null
        }
      };

      // Save to backend (student creation)
      const res = await fetch(`${API_BASE}/api/admission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token || localStorage.getItem('token')}`
        },
        body: JSON.stringify(studentPayload)
      });

      const json = await res.json();
      if (!json.success) {
        throw new Error(json.error || 'Admission failed');
      }

      // Set final result with student data
      setFinalResult({
        success: true,
        admissionId,
        username,
        password,
        studentData,
        parentData,
        addressData,
        documents,
        submittedAt: new Date().toLocaleString('en-IN')
      });

      // Clear draft
      localStorage.removeItem(`admission_draft_${admissionId}`);

    } catch (err) {
      alert(err.message || 'Submission failed');
      setFinalResult({
        success: false,
        error: err.message
      });
    } finally {
      setSubmitting(false);
    }
  };

  const printIDCard = () => {
    if (!finalResult) return;

    const { admissionId, username, password, studentData } = finalResult;
    
    const idCardHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Student ID Card - ${admissionId}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: #f0f0f0; 
            display: flex; 
            justify-content: center; 
            align-items: center; 
            min-height: 100vh;
            padding: 20px;
          }
          .id-card {
            width: 350px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 20px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            color: white;
          }
          .card-header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid rgba(255,255,255,0.3);
          }
          .school-name {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .card-title {
            font-size: 14px;
            opacity: 0.9;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .photo-section {
            text-align: center;
            margin-bottom: 20px;
          }
          .student-photo {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            border: 4px solid white;
            object-fit: cover;
            background: white;
            margin: 0 auto;
          }
          .student-name {
            font-size: 22px;
            font-weight: bold;
            text-align: center;
            margin: 15px 0 5px 0;
            text-transform: uppercase;
          }
          .student-class {
            text-align: center;
            font-size: 14px;
            opacity: 0.95;
            margin-bottom: 20px;
          }
          .info-grid {
            background: rgba(255,255,255,0.15);
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 15px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid rgba(255,255,255,0.2);
          }
          .info-row:last-child {
            border-bottom: none;
          }
          .info-label {
            font-size: 12px;
            opacity: 0.85;
            font-weight: 500;
          }
          .info-value {
            font-size: 13px;
            font-weight: 600;
          }
          .credentials {
            background: rgba(255,255,255,0.2);
            padding: 12px;
            border-radius: 10px;
            font-size: 12px;
          }
          .credential-row {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
          }
          .credential-label {
            opacity: 0.9;
          }
          .credential-value {
            font-weight: bold;
            font-family: monospace;
            font-size: 13px;
          }
          @media print {
            body { background: white; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="id-card">
          <div class="card-header">
            <div class="school-name">🎓 Springfield Academy</div>
            <div class="card-title">Student ID Card</div>
          </div>
          
          <div class="photo-section">
            ${studentPhotoPreview ? 
              `<img src="${studentPhotoPreview}" alt="Student" class="student-photo" />` :
              `<div class="student-photo" style="display: flex; align-items: center; justify-content: center; font-size: 48px; color: #667eea;">👤</div>`
            }
          </div>
          
          <div class="student-name">${studentData.firstName} ${studentData.middleName || ''} ${studentData.lastName}</div>
          <div class="student-class">Class: ${studentData.classApplyingFor}${studentData.section ? ' - ' + studentData.section : ''}</div>
          
          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">Admission ID</span>
              <span class="info-value">${admissionId}</span>
            </div>
            <div class="info-row">
              <span class="info-label">DOB</span>
              <span class="info-value">${new Date(studentData.dob).toLocaleDateString('en-GB')}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Blood Group</span>
              <span class="info-value">${studentData.bloodGroup || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Contact</span>
              <span class="info-value">${studentData.contactNumber}</span>
            </div>
          </div>
          
          <div class="credentials">
            <div class="credential-row">
              <span class="credential-label">Username:</span>
              <span class="credential-value">${username}</span>
            </div>
            <div class="credential-row">
              <span class="credential-label">Password:</span>
              <span class="credential-value">${password}</span>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '', 'width=400,height=700');
    printWindow.document.write(idCardHtml);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
  };

  const printAdmissionForm = () => {
    if (!finalResult) return;

    const { admissionId, username, password, studentData, parentData, addressData, submittedAt } = finalResult;
    
    const formHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Admission Form - ${admissionId}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 40px; background: white; color: #333; }
          .container { max-width: 900px; margin: 0 auto; border: 3px solid #667eea; padding: 30px; }
          .header { text-align: center; border-bottom: 3px solid #667eea; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { color: #667eea; font-size: 32px; margin-bottom: 8px; }
          .header p { color: #666; font-size: 14px; }
          .section { margin-bottom: 30px; page-break-inside: avoid; }
          .section-title { 
            background: linear-gradient(to right, #667eea, #764ba2); 
            color: white; 
            padding: 10px 15px; 
            font-size: 16px; 
            font-weight: bold; 
            margin-bottom: 15px; 
            border-radius: 5px;
          }
          .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
          .info-item { padding: 8px 0; }
          .info-label { font-size: 11px; color: #666; text-transform: uppercase; margin-bottom: 3px; font-weight: 600; }
          .info-value { font-size: 14px; color: #333; font-weight: 500; }
          .credentials { 
            background: #f8f9ff; 
            border: 2px dashed #667eea; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0;
          }
          .credential-item { 
            display: flex; 
            justify-content: space-between; 
            padding: 8px 0; 
            border-bottom: 1px solid #ddd;
          }
          .credential-item:last-child { border-bottom: none; }
          .credential-label { font-weight: 600; color: #667eea; }
          .credential-value { font-family: monospace; font-size: 16px; font-weight: bold; }
          .footer { 
            text-align: center; 
            margin-top: 40px; 
            padding-top: 20px; 
            border-top: 2px solid #e5e7eb; 
            font-size: 12px; 
            color: #999; 
          }
          .photo-box {
            width: 150px;
            height: 150px;
            border: 2px solid #667eea;
            border-radius: 8px;
            overflow: hidden;
            margin: 0 auto 20px auto;
          }
          .photo-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          @media print { 
            body { padding: 0; } 
            .no-print { display: none; } 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 Student Admission Form</h1>
            <p>Admission ID: <strong>${admissionId}</strong></p>
            <p>Submitted: ${submittedAt}</p>
          </div>

          ${studentPhotoPreview ? `
            <div class="photo-box">
              <img src="${studentPhotoPreview}" alt="Student Photo" />
            </div>
          ` : ''}

          <div class="section">
            <div class="section-title">Student Information</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Full Name</div>
                <div class="info-value">${studentData.firstName} ${studentData.middleName || ''} ${studentData.lastName}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Date of Birth</div>
                <div class="info-value">${new Date(studentData.dob).toLocaleDateString('en-GB')} (${calculateAge(studentData.dob)})</div>
              </div>
              <div class="info-item">
                <div class="info-label">Gender</div>
                <div class="info-value">${studentData.gender}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Blood Group</div>
                <div class="info-value">${studentData.bloodGroup || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Class & Section</div>
                <div class="info-value">${studentData.classApplyingFor}${studentData.section ? ' - ' + studentData.section : ''}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Academic Year</div>
                <div class="info-value">${studentData.academicYear}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Religion</div>
                <div class="info-value">${studentData.religion || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Category</div>
                <div class="info-value">${studentData.category || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Aadhaar Number</div>
                <div class="info-value">${studentData.aadhar || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Contact Number</div>
                <div class="info-value">${studentData.contactNumber}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Previous School</div>
                <div class="info-value">${studentData.previousSchool || 'N/A'}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Parent/Guardian Information</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Father's Name</div>
                <div class="info-value">${parentData.fatherName}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Father's Mobile</div>
                <div class="info-value">${parentData.fatherMobile}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Father's Email</div>
                <div class="info-value">${parentData.fatherEmail || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Father's Occupation</div>
                <div class="info-value">${parentData.fatherOccupation || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Annual Income</div>
                <div class="info-value">${parentData.fatherIncome ? '₹ ' + parseFloat(parentData.fatherIncome).toLocaleString() : 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Mother's Name</div>
                <div class="info-value">${parentData.motherName}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Mother's Mobile</div>
                <div class="info-value">${parentData.motherMobile || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Mother's Occupation</div>
                <div class="info-value">${parentData.motherOccupation || 'N/A'}</div>
              </div>
              ${parentData.guardianName ? `
                <div class="info-item">
                  <div class="info-label">Guardian Name</div>
                  <div class="info-value">${parentData.guardianName}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Guardian Relation</div>
                  <div class="info-value">${parentData.guardianRelation}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Guardian Contact</div>
                  <div class="info-value">${parentData.guardianContact}</div>
                </div>
              ` : ''}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Address Information</div>
            <div class="info-item" style="margin-bottom: 15px;">
              <div class="info-label">Current Address</div>
              <div class="info-value">
                ${addressData.currentLine1}, ${addressData.currentLine2 || ''}<br/>
                ${addressData.currentCity}, ${addressData.currentDistrict}, ${addressData.currentState}<br/>
                ${addressData.currentCountry} - ${addressData.currentPincode}
              </div>
            </div>
            ${!addressData.sameAsCurrent ? `
              <div class="info-item">
                <div class="info-label">Permanent Address</div>
                <div class="info-value">
                  ${addressData.permanentLine1}, ${addressData.permanentLine2 || ''}<br/>
                  ${addressData.permanentCity}, ${addressData.permanentDistrict}, ${addressData.permanentState}<br/>
                  ${addressData.permanentCountry} - ${addressData.permanentPincode}
                </div>
              </div>
            ` : `
              <div class="info-item">
                <div class="info-value" style="font-style: italic; color: #666;">Permanent address same as current address</div>
              </div>
            `}
          </div>

          <div class="section">
            <div class="section-title">Documents Uploaded</div>
            <div style="padding-left: 15px;">
              ${documents.length > 0 ? documents.map(doc => `
                <div style="padding: 5px 0;">📄 ${doc.type || 'Document'} - ${doc.name}</div>
              `).join('') : '<div style="font-style: italic; color: #666;">No documents uploaded</div>'}
            </div>
          </div>

          <div class="credentials">
            <div style="text-align: center; margin-bottom: 10px; font-weight: bold; font-size: 14px; color: #667eea;">
              🔐 Login Credentials
            </div>
            <div class="credential-row">
              <span class="credential-label">Username:</span>
              <span class="credential-value">${username}</span>
            </div>
            <div class="credential-row">
              <span class="credential-label">Password:</span>
              <span class="credential-value">${password}</span>
            </div>
          </div>

          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            <p style="margin-top: 5px;">Springfield Academy - Shaping Future Leaders</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '', 'width=900,height=800');
    printWindow.document.write(formHtml);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
  };

  if (!isAdmin) {
    return (
      <div className="p-6 text-center text-red-600">
        Only Admin and Super Admin can access admission forms.
      </div>
    );
  }

  // Render final success screen
  if (finalResult && finalResult.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-green-600" size={40} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admission Successful! 🎉</h1>
            <p className="text-gray-600">Student has been successfully enrolled</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Admission ID</p>
                <p className="text-xl font-bold text-blue-700">{finalResult.admissionId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Student Name</p>
                <p className="text-xl font-bold text-gray-900">
                  {studentData.firstName} {studentData.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Class</p>
                <p className="text-lg font-semibold text-gray-800">
                  {studentData.classApplyingFor} {studentData.section && `- ${studentData.section}`}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Submitted</p>
                <p className="text-sm font-medium text-gray-700">{finalResult.submittedAt}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
              <p className="text-sm font-semibold text-gray-700 mb-2">🔐 Login Credentials</p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Username:</span>
                <span className="font-mono font-bold text-blue-700">{finalResult.username}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Password:</span>
                <span className="font-mono font-bold text-blue-700">{finalResult.password}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={printIDCard}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-semibold shadow-lg"
            >
              <CreditCard size={20} />
              Print ID Card
            </button>
            <button
              onClick={printAdmissionForm}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition font-semibold shadow-lg"
            >
              <Printer size={20} />
              Print Admission Form
            </button>
          </div>

          <button
            onClick={() => {
              setFinalResult(null);
              setCurrentStage(1);
              setStudentData({
                firstName: '', middleName: '', lastName: '', dob: '', gender: '',
                classApplyingFor: '', section: '', academicYear: '2026-2027',
                studentPhoto: null, previousSchool: '', religion: '', category: '',
                bloodGroup: '', aadhar: '', contactNumber: ''
              });
              setParentData({
                fatherName: '', fatherMobile: '', fatherEmail: '', fatherOccupation: '',
                fatherIncome: '', motherName: '', motherMobile: '', motherOccupation: '',
                guardianName: '', guardianRelation: '', guardianContact: '', sameContact: false
              });
              setAddressData({
                currentLine1: '', currentLine2: '', currentCity: '', currentDistrict: '',
                currentState: '', currentCountry: 'India', currentPincode: '',
                sameAsCurrent: true, permanentLine1: '', permanentLine2: '',
                permanentCity: '', permanentDistrict: '', permanentState: '',
                permanentCountry: 'India', permanentPincode: ''
              });
              setDocuments([]);
              setStudentPhotoPreview(null);
              const timestamp = Date.now();
              const randomNum = Math.floor(1000 + Math.random() * 9000);
              setAdmissionId(`ADM${timestamp.toString().slice(-6)}${randomNum}`);
            }}
            className="w-full mt-4 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Create New Admission
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Admission Form</h1>
          <p className="text-gray-600">Complete all stages to enroll the student</p>
          <p className="text-sm text-blue-600 font-semibold mt-2">Admission ID: {admissionId}</p>
        </div>

        {/* Stepper Progress */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            {STAGES.map((stage, idx) => {
              const Icon = stage.icon;
              const isCompleted = currentStage > stage.id;
              const isCurrent = currentStage === stage.id;
              
              return (
                <div key={stage.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center border-2 transition
                      ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 
                        isCurrent ? 'bg-blue-600 border-blue-600 text-white' : 
                        'bg-white border-gray-300 text-gray-400'}
                    `}>
                      {isCompleted ? <CheckCircle2 size={24} /> : <Icon size={24} />}
                    </div>
                    <p className={`text-xs mt-2 font-medium text-center ${isCurrent ? 'text-blue-700' : 'text-gray-600'}`}>
                      {stage.name}
                    </p>
                  </div>
                  {idx < STAGES.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Progress Bar */}
          <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
              style={{ width: `${STAGES[currentStage - 1].progress}%` }}
            />
          </div>
          <p className="text-center text-sm text-gray-600 mt-2 font-medium">
            {STAGES[currentStage - 1].progress}% Complete
          </p>
        </div>

        {/* Stage Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* STAGE 1: Student Details */}
          {currentStage === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b">
                <User className="text-blue-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">Student Information</h2>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Admission ID <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={admissionId} 
                    readOnly 
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm font-mono font-bold text-blue-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={studentData.firstName}
                    onChange={(e) => setStudentData(prev => ({ ...prev, firstName: e.target.value }))}
                    className={inputCls}
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Middle Name</label>
                  <input 
                    type="text" 
                    value={studentData.middleName}
                    onChange={(e) => setStudentData(prev => ({ ...prev, middleName: e.target.value }))}
                    className={inputCls}
                    placeholder="Enter middle name"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={studentData.lastName}
                    onChange={(e) => setStudentData(prev => ({ ...prev, lastName: e.target.value }))}
                    className={inputCls}
                    placeholder="Enter last name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="date" 
                    value={studentData.dob}
                    onChange={(e) => setStudentData(prev => ({ ...prev, dob: e.target.value }))}
                    className={inputCls}
                    required
                  />
                  {studentData.dob && (
                    <p className="text-xs text-gray-500 mt-1">Age: {calculateAge(studentData.dob)}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={studentData.gender}
                    onChange={(e) => setStudentData(prev => ({ ...prev, gender: e.target.value }))}
                    className={inputCls}
                    required
                  >
                    <option value="">Select Gender</option>
                    {genderOptions.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Class Applying For <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={studentData.classApplyingFor}
                    onChange={(e) => setStudentData(prev => ({ ...prev, classApplyingFor: e.target.value }))}
                    className={inputCls}
                    required
                  >
                    <option value="">Select Class</option>
                    {classes.map(c => (
                      <option key={c._id || c.className} value={c.className}>
                        {c.className}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Section</label>
                  <input 
                    type="text" 
                    value={studentData.section}
                    onChange={(e) => setStudentData(prev => ({ ...prev, section: e.target.value }))}
                    className={inputCls}
                    placeholder="e.g., A, B, C"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Academic Year <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={studentData.academicYear}
                    onChange={(e) => setStudentData(prev => ({ ...prev, academicYear: e.target.value }))}
                    className={inputCls}
                    placeholder="2026-2027"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Student Photo</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="file" 
                      accept="image/jpeg,image/png"
                      onChange={handleStudentPhotoUpload}
                      className="hidden"
                      id="student-photo-upload"
                    />
                    <label 
                      htmlFor="student-photo-upload"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer text-sm font-medium"
                    >
                      <Upload size={16} />
                      Upload Photo
                    </label>
                    {studentPhotoPreview && (
                      <div className="relative">
                        <img 
                          src={studentPhotoPreview} 
                          alt="Student" 
                          className="w-16 h-16 rounded-full object-cover border-2 border-blue-300"
                        />
                        <button
                          onClick={() => {
                            setStudentPhotoPreview(null);
                            setStudentData(prev => ({ ...prev, studentPhoto: null }));
                          }}
                          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Max 2MB (JPG, PNG)</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Previous School Name</label>
                  <input 
                    type="text" 
                    value={studentData.previousSchool}
                    onChange={(e) => setStudentData(prev => ({ ...prev, previousSchool: e.target.value }))}
                    className={inputCls}
                    placeholder="Enter previous school"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Religion</label>
                  <select 
                    value={studentData.religion}
                    onChange={(e) => setStudentData(prev => ({ ...prev, religion: e.target.value }))}
                    className={inputCls}
                  >
                    <option value="">Select Religion</option>
                    {religions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category / Caste</label>
                  <select 
                    value={studentData.category}
                    onChange={(e) => setStudentData(prev => ({ ...prev, category: e.target.value }))}
                    className={inputCls}
                  >
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Blood Group</label>
                  <select 
                    value={studentData.bloodGroup}
                    onChange={(e) => setStudentData(prev => ({ ...prev, bloodGroup: e.target.value }))}
                    className={inputCls}
                  >
                    <option value="">Select Blood Group</option>
                    {bloodGroups.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Aadhaar / Student ID</label>
                  <input 
                    type="text" 
                    value={studentData.aadhar}
                    onChange={(e) => setStudentData(prev => ({ ...prev, aadhar: e.target.value }))}
                    className={inputCls}
                    placeholder="Enter Aadhaar number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="tel" 
                    value={studentData.contactNumber}
                    onChange={(e) => setStudentData(prev => ({ ...prev, contactNumber: e.target.value }))}
                    className={inputCls}
                    placeholder="10-digit mobile"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: Parent/Guardian Details */}
          {currentStage === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b">
                <Users className="text-purple-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">Parent/Guardian Information</h2>
              </div>

              {/* Father Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  👨 Father's Details
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={parentData.fatherName}
                      onChange={(e) => setParentData(prev => ({ ...prev, fatherName: e.target.value }))}
                      className={inputCls}
                      placeholder="Father's full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="tel" 
                      value={parentData.fatherMobile}
                      onChange={(e) => setParentData(prev => ({ ...prev, fatherMobile: e.target.value }))}
                      className={inputCls}
                      placeholder="10-digit mobile"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      value={parentData.fatherEmail}
                      onChange={(e) => setParentData(prev => ({ ...prev, fatherEmail: e.target.value }))}
                      className={inputCls}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Occupation</label>
                    <input 
                      type="text" 
                      value={parentData.fatherOccupation}
                      onChange={(e) => setParentData(prev => ({ ...prev, fatherOccupation: e.target.value }))}
                      className={inputCls}
                      placeholder="Occupation"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Annual Income</label>
                    <input 
                      type="number" 
                      value={parentData.fatherIncome}
                      onChange={(e) => setParentData(prev => ({ ...prev, fatherIncome: e.target.value }))}
                      className={inputCls}
                      placeholder="Annual income"
                    />
                  </div>
                </div>
              </div>

              {/* Mother Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  👩 Mother's Details
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={parentData.motherName}
                      onChange={(e) => setParentData(prev => ({ ...prev, motherName: e.target.value }))}
                      className={inputCls}
                      placeholder="Mother's full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
                    <input 
                      type="tel" 
                      value={parentData.motherMobile}
                      onChange={(e) => setParentData(prev => ({ ...prev, motherMobile: e.target.value }))}
                      className={inputCls}
                      placeholder="10-digit mobile"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Occupation</label>
                    <input 
                      type="text" 
                      value={parentData.motherOccupation}
                      onChange={(e) => setParentData(prev => ({ ...prev, motherOccupation: e.target.value }))}
                      className={inputCls}
                      placeholder="Occupation"
                    />
                  </div>
                </div>
              </div>

              {/* Guardian Details (Optional) */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  👤 Guardian Details (Optional)
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Guardian Name</label>
                    <input 
                      type="text" 
                      value={parentData.guardianName}
                      onChange={(e) => setParentData(prev => ({ ...prev, guardianName: e.target.value }))}
                      className={inputCls}
                      placeholder="Guardian's name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Relation</label>
                    <select 
                      value={parentData.guardianRelation}
                      onChange={(e) => setParentData(prev => ({ ...prev, guardianRelation: e.target.value }))}
                      className={inputCls}
                    >
                      <option value="">Select Relation</option>
                      {relationTypes.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Number</label>
                    <input 
                      type="tel" 
                      value={parentData.guardianContact}
                      onChange={(e) => setParentData(prev => ({ ...prev, guardianContact: e.target.value }))}
                      className={inputCls}
                      placeholder="10-digit mobile"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3: Address Details */}
          {currentStage === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b">
                <MapPin className="text-green-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">Residential Address</h2>
              </div>

              {/* Current Address */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Current Address</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Address Line 1 <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={addressData.currentLine1}
                      onChange={(e) => setAddressData(prev => ({ ...prev, currentLine1: e.target.value }))}
                      className={inputCls}
                      placeholder="House/Flat No., Street"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Address Line 2</label>
                    <input 
                      type="text" 
                      value={addressData.currentLine2}
                      onChange={(e) => setAddressData(prev => ({ ...prev, currentLine2: e.target.value }))}
                      className={inputCls}
                      placeholder="Area, Landmark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={addressData.currentCity}
                      onChange={(e) => setAddressData(prev => ({ ...prev, currentCity: e.target.value }))}
                      className={inputCls}
                      placeholder="City"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      District <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={addressData.currentDistrict}
                      onChange={(e) => setAddressData(prev => ({ ...prev, currentDistrict: e.target.value }))}
                      className={inputCls}
                      placeholder="District"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={addressData.currentState}
                      onChange={(e) => setAddressData(prev => ({ ...prev, currentState: e.target.value }))}
                      className={inputCls}
                      placeholder="State"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={addressData.currentCountry}
                      onChange={(e) => setAddressData(prev => ({ ...prev, currentCountry: e.target.value }))}
                      className={inputCls}
                      placeholder="Country"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      PIN Code <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      value={addressData.currentPincode}
                      onChange={(e) => setAddressData(prev => ({ ...prev, currentPincode: e.target.value }))}
                      className={inputCls}
                      placeholder="6-digit PIN"
                      maxLength={6}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Permanent Address */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <input 
                    type="checkbox" 
                    id="same-address"
                    checked={addressData.sameAsCurrent}
                    onChange={(e) => setAddressData(prev => ({ ...prev, sameAsCurrent: e.target.checked }))}
                    className="w-4 h-4 text-blue-600"
                  />
                  <label htmlFor="same-address" className="text-sm font-semibold text-gray-700">
                    Permanent Address same as Current Address
                  </label>
                </div>

                {!addressData.sameAsCurrent && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Permanent Address</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Address Line 1</label>
                        <input 
                          type="text" 
                          value={addressData.permanentLine1}
                          onChange={(e) => setAddressData(prev => ({ ...prev, permanentLine1: e.target.value }))}
                          className={inputCls}
                          placeholder="House/Flat No., Street"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Address Line 2</label>
                        <input 
                          type="text" 
                          value={addressData.permanentLine2}
                          onChange={(e) => setAddressData(prev => ({ ...prev, permanentLine2: e.target.value }))}
                          className={inputCls}
                          placeholder="Area, Landmark"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                        <input 
                          type="text" 
                          value={addressData.permanentCity}
                          onChange={(e) => setAddressData(prev => ({ ...prev, permanentCity: e.target.value }))}
                          className={inputCls}
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">District</label>
                        <input 
                          type="text" 
                          value={addressData.permanentDistrict}
                          onChange={(e) => setAddressData(prev => ({ ...prev, permanentDistrict: e.target.value }))}
                          className={inputCls}
                          placeholder="District"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
                        <input 
                          type="text" 
                          value={addressData.permanentState}
                          onChange={(e) => setAddressData(prev => ({ ...prev, permanentState: e.target.value }))}
                          className={inputCls}
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
                        <input 
                          type="text" 
                          value={addressData.permanentCountry}
                          onChange={(e) => setAddressData(prev => ({ ...prev, permanentCountry: e.target.value }))}
                          className={inputCls}
                          placeholder="Country"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">PIN Code</label>
                        <input 
                          type="text" 
                          value={addressData.permanentPincode}
                          onChange={(e) => setAddressData(prev => ({ ...prev, permanentPincode: e.target.value }))}
                          className={inputCls}
                          placeholder="6-digit PIN"
                          maxLength={6}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STAGE 4: Document Upload */}
          {currentStage === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b">
                <FileText className="text-amber-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">Document Upload</h2>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Required:</strong> Birth Certificate is mandatory. Other documents are optional but recommended.
                </p>
              </div>

              <div>
                <label htmlFor="doc-upload" className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer w-fit font-semibold">
                  <Upload size={20} />
                  Add Documents
                </label>
                <input 
                  type="file" 
                  id="doc-upload"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleDocumentUpload}
                  className="hidden"
                />
                <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG - Max 10MB per file</p>
              </div>

              {/* Documents List */}
              <div className="space-y-3">
                {documents.map((doc, idx) => (
                  <div key={doc.id} className="bg-gray-50 border rounded-lg p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                      <FileText size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm mb-2">{doc.name}</p>
                      <select
                        value={doc.type}
                        onChange={(e) => updateDocumentType(doc.id, e.target.value)}
                        className="text-xs px-2 py-1 border border-gray-300 rounded"
                      >
                        <option value="">Select Document Type</option>
                        {documentTypes.map(dt => (
                          <option key={dt} value={dt}>{dt}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => removeDocument(doc.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                {documents.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <FileText size={48} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No documents uploaded yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STAGE 5: Review & Submit */}
          {currentStage === 5 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b">
                <CheckSquare className="text-green-600" size={28} />
                <h2 className="text-2xl font-bold text-gray-900">Review & Confirmation</h2>
              </div>

              {/* Student Details Review */}
              <div className="bg-blue-50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <User size={20} className="text-blue-600" />
                    Student Details
                  </h3>
                  <button
                    onClick={() => setCurrentStage(1)}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-600">Name:</span> <span className="font-semibold">{studentData.firstName} {studentData.middleName} {studentData.lastName}</span></div>
                  <div><span className="text-gray-600">DOB:</span> <span className="font-semibold">{studentData.dob}</span></div>
                  <div><span className="text-gray-600">Gender:</span> <span className="font-semibold">{studentData.gender}</span></div>
                  <div><span className="text-gray-600">Class:</span> <span className="font-semibold">{studentData.classApplyingFor}</span></div>
                  <div><span className="text-gray-600">Contact:</span> <span className="font-semibold">{studentData.contactNumber}</span></div>
                  <div><span className="text-gray-600">Blood Group:</span> <span className="font-semibold">{studentData.bloodGroup || 'N/A'}</span></div>
                </div>
              </div>

              {/* Parent Details Review */}
              <div className="bg-purple-50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Users size={20} className="text-purple-600" />
                    Parent/Guardian Details
                  </h3>
                  <button
                    onClick={() => setCurrentStage(2)}
                    className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-600">Father:</span> <span className="font-semibold">{parentData.fatherName}</span></div>
                  <div><span className="text-gray-600">Father Mobile:</span> <span className="font-semibold">{parentData.fatherMobile}</span></div>
                  <div><span className="text-gray-600">Mother:</span> <span className="font-semibold">{parentData.motherName}</span></div>
                  <div><span className="text-gray-600">Mother Mobile:</span> <span className="font-semibold">{parentData.motherMobile || 'N/A'}</span></div>
                </div>
              </div>

              {/* Address Review */}
              <div className="bg-green-50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <MapPin size={20} className="text-green-600" />
                    Address Details
                  </h3>
                  <button
                    onClick={() => setCurrentStage(3)}
                    className="text-sm text-green-600 hover:text-green-800 flex items-center gap-1"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900 mb-1">Current Address:</p>
                  <p className="text-gray-700">
                    {addressData.currentLine1}, {addressData.currentLine2}<br />
                    {addressData.currentCity}, {addressData.currentDistrict}, {addressData.currentState}<br />
                    {addressData.currentCountry} - {addressData.currentPincode}
                  </p>
                  {addressData.sameAsCurrent && (
                    <p className="text-xs text-gray-500 italic mt-2">Permanent address is same as current</p>
                  )}
                </div>
              </div>

              {/* Documents Review */}
              <div className="bg-amber-50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FileText size={20} className="text-amber-600" />
                    Uploaded Documents ({documents.length})
                  </h3>
                  <button
                    onClick={() => setCurrentStage(4)}
                    className="text-sm text-amber-600 hover:text-amber-800 flex items-center gap-1"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                </div>
                <div className="space-y-2">
                  {documents.map(doc => (
                    <div key={doc.id} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 size={16} className="text-green-600" />
                      <span className="font-medium">{doc.type || 'Document'}</span>
                      <span className="text-gray-500">- {doc.name}</span>
                    </div>
                  ))}
                  {documents.length === 0 && (
                    <p className="text-sm text-gray-500">No documents uploaded</p>
                  )}
                </div>
              </div>

              {/* Terms & Submit */}
              <div className="border-t pt-6">
                <div className="flex items-start gap-3 mb-6">
                  <input 
                    type="checkbox" 
                    id="terms"
                    className="w-5 h-5 text-blue-600 mt-0.5"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    I hereby declare that all the information provided is true and accurate. I agree to the terms and conditions of the institution.
                  </label>
                </div>

                <button
                  onClick={handleFinalSubmit}
                  disabled={submitting || !document.getElementById('terms')?.checked}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <CheckCircle2 size={24} />
                      Submit Admission
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <button
              onClick={handleBack}
              disabled={currentStage === 1}
              className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed font-semibold transition"
            >
              <ChevronLeft size={20} />
              Back
            </button>

            {currentStage < 5 && (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-md transition"
              >
                Save & Next
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
