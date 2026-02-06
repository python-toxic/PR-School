import { useMemo, useState, useEffect } from "react";
import { 
  QrCode as QRCode, Clipboard, Copy, CheckCircle2, UserPlus, Shield, Mail, 
  UploadCloud, Download, Printer, X, ChevronRight, ChevronLeft, Upload, 
  User, Users, MapPin, FileText, CheckSquare, CreditCard, Edit2, Trash2, Circle
} from "lucide-react";
import { useUser } from "../../context/UserContext.jsx";
import { ROLES } from "../../constants/roles.js";
import StudentIDCard from "../../components/StudentIDCard.jsx";

const genderOptions = ["Male", "Female", "Other"];
const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const religions = ["Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist", "Other"];
const categories = ["General", "OBC", "SC", "ST", "EWS", "Other"];
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

const STAGES = [
  { id: 1, name: 'Student Details', icon: User, progress: 20 },
  { id: 2, name: 'Parent/Guardian', icon: Users, progress: 40 },
  { id: 3, name: 'Address Details', icon: MapPin, progress: 60 },
  { id: 4, name: 'Documents Upload', icon: FileText, progress: 80 },
  { id: 5, name: 'Review & Submit', icon: CheckSquare, progress: 100 }
];

const inputCls = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

export default function AdmissionManagement() {
  const { user } = useUser();
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:4000';
  
  // Stepper state
  const [currentStage, setCurrentStage] = useState(1);
  const [admissionId, setAdmissionId] = useState('');
  const [studentPhotoPreview, setStudentPhotoPreview] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  
  const [submitting, setSubmitting] = useState(false);
  const [dynamicClasses, setDynamicClasses] = useState([]);

  // New stepper form data
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
    guardianContact: ''
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

  const normalizedRole = String(user?.role ?? '').toLowerCase();
  const isAdmin = [ROLES.ADMIN, ROLES.SUPER_ADMIN]
    .map(r => String(r).toLowerCase())
    .includes(normalizedRole);

  const applyUrl = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://school-erp";
    return `${origin}/apply/admission`;
  }, []);

  const qrSrc = useMemo(() => `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(applyUrl)}`, [applyUrl]);

  // Generate Admission ID on component mount
  useEffect(() => {
    if (!admissionId && isAdmin) {
      const timestamp = Date.now();
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const newAdmissionId = `ADM${timestamp.toString().slice(-6)}${randomNum}`;
      setAdmissionId(newAdmissionId);
    }
  }, [isAdmin, admissionId]);

  // Auto-copy permanent address when checkbox changes
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

  // Load dynamic classes
  useEffect(() => {
    const savedClasses = localStorage.getItem("classes-list");
    if (savedClasses) {
      try {
        const classList = JSON.parse(savedClasses);
        const classNames = classList.map(c => c.name).sort();
        setDynamicClasses(classNames);
      } catch (error) {
        console.error("Error parsing classes:", error);
      }
    }
  }, []);

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
    if (currentStage === 1 && !validateStage1()) return;
    if (currentStage === 2 && !validateStage2()) return;
    if (currentStage === 3 && !validateStage3()) return;
    if (currentStage === 4 && !validateStage4()) return;

    // Save draft
    saveDraft();

    if (currentStage < 5) {
      setCurrentStage(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStage > 1) {
      setCurrentStage(prev => prev - 1);
    }
  };

  const saveDraft = () => {
    localStorage.setItem(`admission_draft_${admissionId}`, JSON.stringify({
      studentData,
      parentData,
      addressData,
      documents: documents.map(d => ({ id: d.id, type: d.type, name: d.name })),
      currentStage
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
      const { username, password } = generateCredentials(studentData.firstName);

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
            <div class="credential-item">
              <span class="credential-label">Username:</span>
              <span class="credential-value">${username}</span>
            </div>
            <div class="credential-item">
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

  const resetForm = () => {
    setStudentData({
      firstName: '', middleName: '', lastName: '', dob: '', gender: '',
      classApplyingFor: '', section: '', academicYear: '2026-2027',
      studentPhoto: null, previousSchool: '', religion: '', category: '',
      bloodGroup: '', aadhar: '', contactNumber: ''
    });
    setParentData({
      fatherName: '', fatherMobile: '', fatherEmail: '', fatherOccupation: '',
      fatherIncome: '', motherName: '', motherMobile: '', motherOccupation: '',
      guardianName: '', guardianRelation: '', guardianContact: ''
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
    setCurrentStage(1);
    setFinalResult(null);
    const timestamp = Date.now();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setAdmissionId(`ADM${timestamp.toString().slice(-6)}${randomNum}`);
  };

  const normalizedRole = String(user?.role ?? '').toLowerCase();
  const isAdmin = [ROLES.ADMIN, ROLES.SUPER_ADMIN]
    .map(r => String(r).toLowerCase())
    .includes(normalizedRole);