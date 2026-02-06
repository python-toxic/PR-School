import { useMemo, useState, useEffect } from "react";
import { 
  QrCode as QRCode, Clipboard, Copy, CheckCircle2, UserPlus, Shield, Mail, UploadCloud, 
  Download, Printer, X, ChevronRight, ChevronLeft, Upload, User, Users, MapPin, 
  FileText, CheckSquare, CreditCard, Edit2, Trash2, Circle
} from "lucide-react";
import { useUser } from "../../context/UserContext.jsx";
import { ROLES } from "../../constants/roles.js";
import StudentIDCard from "../../components/StudentIDCard.jsx";

const initialApplications = [
  { id: 1, applicationNumber: "APP/12/26/0001", studentName: "", applyingForClass: "PlayGroup A", applicationType: "Parent Online", status: "Pending", payment: "Payment Pending", createdAt: "10-01-2026 | 01:56 PM" },
  { id: 2, applicationNumber: "APP/12/25/0011", studentName: "Ravi Sharma", applyingForClass: "Nursery - B", applicationType: "OCR Scan", status: "Pending", payment: "Payment Pending", createdAt: "19-12-2025 | 07:08 PM" },
  { id: 3, applicationNumber: "APP/12/25/0010", studentName: "Tanzila Ali", applyingForClass: "UKG - A", applicationType: "Admin Manual", status: "Approved", payment: "Payment Pending", createdAt: "19-12-2025 | 06:36 PM" },
  { id: 4, applicationNumber: "APP/12/25/0009", studentName: "Shayan Ali", applyingForClass: "Class 1 - A", applicationType: "Admin Manual", status: "Approved", payment: "Payment Pending", createdAt: "19-12-2025 | 05:05 PM" },
  { id: 5, applicationNumber: "APP/12/25/0008", studentName: "", applyingForClass: "PlayGroup A", applicationType: "Parent Online", status: "Pending", payment: "Payment Pending", createdAt: "16-12-2025 | 04:49 PM" },
  { id: 6, applicationNumber: "APP/12/25/0007", studentName: "", applyingForClass: "PlayGroup A", applicationType: "Parent Online", status: "Pending", payment: "Payment Pending", createdAt: "07-12-2025 | 03:31 PM" },
  { id: 7, applicationNumber: "APP/12/25/0006", studentName: "Ravi Sharma", applyingForClass: "Class 6 - A", applicationType: "OCR Scan", status: "Approved", payment: "Payment Pending", createdAt: "04-12-2025 | 09:56 PM" },
  { id: 8, applicationNumber: "APP/25/0005", studentName: "Arjun Singh", applyingForClass: "Nursery - C", applicationType: "OCR Scan", status: "Pending", payment: "Payment Pending", createdAt: "03-12-2025 | 11:50 PM" },
  { id: 9, applicationNumber: "APP/25/0004", studentName: "Ravi Sharma", applyingForClass: "Class 6 - A", applicationType: "OCR Scan", status: "Approved", payment: "Payment Pending", createdAt: "03-12-2025 | 10:49 PM" },
  { id: 10, applicationNumber: "APP/25/0003", studentName: "Ravi Sharma", applyingForClass: "Class 6 - A", applicationType: "OCR Scan", status: "Approved", payment: "Payment Pending", createdAt: "03-12-2025 | 08:49 PM" },
  { id: 11, applicationNumber: "APP/25/0002", studentName: "", applyingForClass: "Class 3 - A", applicationType: "Parent Online", status: "Pending", payment: "Payment Pending", createdAt: "03-12-2025 | 08:47 PM" },
  { id: 12, applicationNumber: "APP/25/0001", studentName: "nkjnkj knkjnk", applyingForClass: "Class 10 - A", applicationType: "Admin Manual", status: "Submitted", payment: "Payment Pending", createdAt: "30-11-2025 | 04:10 PM" }
];

const genderOptions = ["Male", "Female", "Other"];
const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const religions = ["Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist", "Other"];
const socialCategories = ["General", "OBC", "SC", "ST", "EWS", "Other"];
const studentCategories = ["Day Scholar", "Hostler", "Special Needs", "Scholarship", "RTE"];
const motherTongues = ["Hindi", "English", "Bengali", "Tamil", "Telugu", "Marathi", "Gujarati", "Punjabi", "Kannada", "Malayalam", "Odia", "Other"];
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


// Pincode to District/Region Mapping
const pincodeMapping = {
  "110001": { district: "South Delhi", region: "Delhi" },
  "110002": { district: "Central Delhi", region: "Delhi" },
  "110003": { district: "East Delhi", region: "Delhi" },
  "110004": { district: "South Delhi", region: "Delhi" },
  "110005": { district: "South Delhi", region: "Delhi" },
  "110006": { district: "East Delhi", region: "Delhi" },
  "110007": { district: "New Delhi", region: "Delhi" },
  "110008": { district: "New Delhi", region: "Delhi" },
  "110009": { district: "South Delhi", region: "Delhi" },
  "110010": { district: "South Delhi", region: "Delhi" },
  "110011": { district: "South Delhi", region: "Delhi" },
  "110012": { district: "South Delhi", region: "Delhi" },
  "110013": { district: "East Delhi", region: "Delhi" },
  "110014": { district: "East Delhi", region: "Delhi" },
  "110015": { district: "East Delhi", region: "Delhi" },
  "110016": { district: "East Delhi", region: "Delhi" },
  "110017": { district: "North Delhi", region: "Delhi" },
  "110018": { district: "North Delhi", region: "Delhi" },
  "110019": { district: "North East Delhi", region: "Delhi" },
  "110020": { district: "North East Delhi", region: "Delhi" },
  "110021": { district: "North East Delhi", region: "Delhi" },
  "110022": { district: "North East Delhi", region: "Delhi" },
  "110023": { district: "North East Delhi", region: "Delhi" },
  "110024": { district: "West Delhi", region: "Delhi" },
  "110025": { district: "West Delhi", region: "Delhi" },
  "110026": { district: "North West Delhi", region: "Delhi" },
  "110027": { district: "North West Delhi", region: "Delhi" },
  "110028": { district: "North West Delhi", region: "Delhi" },
  "110029": { district: "West Delhi", region: "Delhi" },
  "110030": { district: "South West Delhi", region: "Delhi" },
  "110031": { district: "South West Delhi", region: "Delhi" },
  "110032": { district: "South West Delhi", region: "Delhi" },
  "110033": { district: "South West Delhi", region: "Delhi" },
  "110034": { district: "Central Delhi", region: "Delhi" },
  "110035": { district: "Central Delhi", region: "Delhi" },
  "110036": { district: "North Delhi", region: "Delhi" },
  "110037": { district: "North Delhi", region: "Delhi" },
  "110038": { district: "North Delhi", region: "Delhi" },
  "110039": { district: "North West Delhi", region: "Delhi" },
  "110040": { district: "North West Delhi", region: "Delhi" },
  "110041": { district: "North West Delhi", region: "Delhi" },
  "110042": { district: "North West Delhi", region: "Delhi" },
  "110043": { district: "North West Delhi", region: "Delhi" },
  "110044": { district: "North West Delhi", region: "Delhi" },
  "110045": { district: "West Delhi", region: "Delhi" },
  "110046": { district: "West Delhi", region: "Delhi" },
  "110047": { district: "West Delhi", region: "Delhi" },
  "110048": { district: "West Delhi", region: "Delhi" },
  "110049": { district: "South Delhi", region: "Delhi" },
  "110050": { district: "South Delhi", region: "Delhi" },
  "110051": { district: "South Delhi", region: "Delhi" },
  "110052": { district: "South Delhi", region: "Delhi" },
  "110053": { district: "South Delhi", region: "Delhi" },
  "110054": { district: "South Delhi", region: "Delhi" },
  "110055": { district: "South Delhi", region: "Delhi" },
  "110056": { district: "South Delhi", region: "Delhi" },
  "110057": { district: "South Delhi", region: "Delhi" },
  "110058": { district: "South Delhi", region: "Delhi" },
  "110059": { district: "East Delhi", region: "Delhi" },
  "110060": { district: "East Delhi", region: "Delhi" },
  "110061": { district: "East Delhi", region: "Delhi" },
  "110062": { district: "East Delhi", region: "Delhi" },
  "110063": { district: "East Delhi", region: "Delhi" },
  "110064": { district: "East Delhi", region: "Delhi" },
  "110065": { district: "East Delhi", region: "Delhi" },
  "110066": { district: "North East Delhi", region: "Delhi" },
  "110067": { district: "North East Delhi", region: "Delhi" },
  "110068": { district: "North East Delhi", region: "Delhi" },
  "110070": { district: "North East Delhi", region: "Delhi" },
  "110071": { district: "North East Delhi", region: "Delhi" },
  "110072": { district: "North East Delhi", region: "Delhi" },
  "110073": { district: "North East Delhi", region: "Delhi" },
  "110074": { district: "North East Delhi", region: "Delhi" },
  "110075": { district: "North East Delhi", region: "Delhi" },
  "110076": { district: "North East Delhi", region: "Delhi" },
  "110077": { district: "North East Delhi", region: "Delhi" },
  "110078": { district: "North East Delhi", region: "Delhi" },
  "110079": { district: "North East Delhi", region: "Delhi" },
  "110080": { district: "North East Delhi", region: "Delhi" },
  "110081": { district: "North East Delhi", region: "Delhi" },
  "110082": { district: "North East Delhi", region: "Delhi" },
  "110083": { district: "North East Delhi", region: "Delhi" },
  "110084": { district: "East Delhi", region: "Delhi" },
  "110085": { district: "East Delhi", region: "Delhi" },
  "110086": { district: "East Delhi", region: "Delhi" },
  "110087": { district: "East Delhi", region: "Delhi" },
  "110088": { district: "East Delhi", region: "Delhi" },
  "110089": { district: "East Delhi", region: "Delhi" },
  "110090": { district: "East Delhi", region: "Delhi" },
  "110091": { district: "North East Delhi", region: "Delhi" },
  "110092": { district: "East Delhi", region: "Delhi" },
  "110093": { district: "North East Delhi", region: "Delhi" },
  "110094": { district: "South West Delhi", region: "Delhi" },
  "110095": { district: "South West Delhi", region: "Delhi" },
  "110096": { district: "South West Delhi", region: "Delhi" },
};

const classes = [
  "PlayGroup A", "Nursery - A", "Nursery - B", "Nursery - C",
  "LKG - A", "LKG - B", "UKG - A", "UKG - B",
  "Class 1 - A", "Class 2 - A", "Class 3 - A", "Class 4 - A",
  "Class 5 - A", "Class 6 - A", "Class 7 - A", "Class 8 - A",
  "Class 9 - A", "Class 10 - A"
];

const inputCls = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm";

const emptyForm = {
  student: {
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    aadhar: "",
    nationality: "",
    religion: "",
    socialCategory: "",
    studentCategory: "",
    motherTongue: "",
    applyingForClass: "",
    admissionDate: "",
    previousSchool: "",
    previousClass: "",
    tcNumber: "",
    photoFile: null
  },
  father: {
    name: "",
    occupation: "",
    phone: "",
    email: ""
  },
  mother: {
    name: "",
    occupation: "",
    phone: "",
    email: ""
  },
  address: {
    line1: "",
    line2: "",
    city: "",
    state: "",
    district: "",
    region: "",
    pincode: ""
  },
  other: {
    transportRequired: false,
    transportRouteId: "",
    transportStopId: "",
    transportTripType: "Both",
    hostler: false,
    documents: "",
    documentFiles: [],
    notes: ""
  },
  fees: {
    admissionFee: "",
    tuitionFee: "",
    annualFee: "",
    transportFee: "",
    hostelFee: "",
    activityFee: "",
    examFee: "",
    otherFees: "",
    totalFees: "",
    discount: "",
    netAmount: "",
    paymentMode: "Cash",
    paymentStatus: "Pending",
    remarks: ""
  }
};

function InfoField({ label, children }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-semibold text-gray-700">
      {label}
      {children}
    </label>
  );
}

export default function AdmissionManagement() {
  const { user } = useUser();
  const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE) || 'http://localhost:4000';
  
  // Stepper state
  const [currentStage, setCurrentStage] = useState(1);
  const [admissionId, setAdmissionId] = useState('');
  const [studentPhotoPreview, setStudentPhotoPreview] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  
  const [applications, setApplications] = useState(initialApplications);
  const [submitting, setSubmitting] = useState(false);
  const [viewingIDCard, setViewingIDCard] = useState(null);
  const [classFees, setClassFees] = useState({});
  const [dynamicClasses, setDynamicClasses] = useState(classes);
  const [transportRoutes, setTransportRoutes] = useState([]);
  const [transportStops, setTransportStops] = useState([]);

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

  console.log('Current user:', user);
  console.log('User role:', user?.role);
  console.log('ROLES constant:', ROLES);
  console.log('normalizedRole:', normalizedRole);
  console.log('isAdmin:', isAdmin);

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

  // Load class fees from localStorage
  useEffect(() => {
    const savedClassFees = localStorage.getItem("class-fees-data");
    if (savedClassFees) {
      try {
        setClassFees(JSON.parse(savedClassFees));
      } catch (error) {
        console.error("Error parsing class fees:", error);
      }
    }
  }, []);

  // Load dynamic classes from Classes Module
  useEffect(() => {
    const savedClasses = localStorage.getItem("classes-list");
    if (savedClasses) {
      try {
        const classList = JSON.parse(savedClasses);
        const classNames = classList.map(c => c.name).sort();
        setDynamicClasses(classNames);
      } catch (error) {
        console.error("Error parsing classes:", error);
        setDynamicClasses(classes);
      }
    }
    
    // Load transport routes and stops
    const savedRoutes = localStorage.getItem("transport-routes");
    const savedStops = localStorage.getItem("transport-stops");
    if (savedRoutes) {
      try {
        setTransportRoutes(JSON.parse(savedRoutes).filter(r => r.status === "Active"));
      } catch (error) {
        console.error("Error parsing routes:", error);
      }
    }
    if (savedStops) {
      try {
        setTransportStops(JSON.parse(savedStops).filter(s => s.status === "Active"));
      } catch (error) {
        console.error("Error parsing stops:", error);
      }
    }
  }, []);

  // Auto-populate fees when class is selected
  useEffect(() => {
    const selectedClass = formData.student.applyingForClass;
    if (selectedClass && classFees[selectedClass]) {
      const fees = classFees[selectedClass];
      setFormData(prev => ({
        ...prev,
        fees: {
          ...prev.fees,
          admissionFee: fees.admission || "",
          tuitionFee: fees.tuition || "",
          annualFee: fees.annual || "",
          transportFee: fees.transport || "",
          activityFee: fees.activity || "",
          examFee: fees.exam || "",
          // Keep other fees as they are
          hostelFee: prev.fees.hostelFee,
          otherFees: prev.fees.otherFees,
          discount: prev.fees.discount,
          paymentMode: prev.fees.paymentMode,
          paymentStatus: prev.fees.paymentStatus,
          remarks: prev.fees.remarks,
          totalFees: prev.fees.totalFees,
          netAmount: prev.fees.netAmount
        }
      }));
    }
  }, [formData.student.applyingForClass, classFees]);

  // Auto-populate district and region from pincode
  useEffect(() => {
    const pincode = formData.address.pincode;
    if (pincode && pincodeMapping[pincode]) {
      const { district, region } = pincodeMapping[pincode];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          district,
          region
        }
      }));
    }
  }, [formData.address.pincode]);

  if (!user) {
    return <div className="p-4 text-sm text-gray-600">Loading user…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="p-4 text-sm text-red-600">
        Only Admin and Super Admin can manage admissions. Please contact an administrator for access.
      </div>
    );
  }

  const applyUrl = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://school-erp";
    return `${origin}/apply/admission`;
  }, []);

  const qrSrc = useMemo(() => {
    const encoded = encodeURIComponent(applyUrl);
    return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encoded}`;
  }, [applyUrl]);

  const handleTextChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleCheckbox = (section, field) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field]
      }
    }));
  };

  const handlePhoto = (file) => {
    setFormData((prev) => ({
      ...prev,
      student: {
        ...prev.student,
        photoFile: file || null
      }
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
  };

  const generateCredentials = (firstName) => {
    const suffix = Date.now().toString().slice(-4);
    const username = `STU${suffix}`;
    const password = `${(firstName || "Stu").slice(0, 3).toLowerCase()}@${Math.floor(1000 + Math.random() * 9000)}`;
    return { username, password };
  };

  const generateAdmissionPDF = (applicationData, studentData, feeData) => {
    const { applicationNumber, username, password, classAssigned } = applicationData;
    const { student, father, mother, address } = studentData;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Admission Receipt - ${applicationNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 40px; background: white; color: #333; }
          .container { max-width: 800px; margin: 0 auto; border: 2px solid #2563eb; padding: 30px; }
          .header { text-align: center; border-bottom: 3px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { color: #2563eb; font-size: 28px; margin-bottom: 5px; }
          .header p { color: #64748b; font-size: 14px; }
          .section { margin-bottom: 25px; }
          .section-title { background: linear-gradient(to right, #2563eb, #3b82f6); color: white; padding: 8px 15px; font-size: 16px; font-weight: bold; margin-bottom: 15px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
          .info-item { padding: 8px; background: #f8fafc; border-left: 3px solid #3b82f6; }
          .info-label { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 600; }
          .info-value { font-size: 14px; color: #1e293b; font-weight: 500; margin-top: 3px; }
          .fee-summary { background: linear-gradient(to bottom right, #dbeafe, #bfdbfe); border: 2px solid #3b82f6; padding: 20px; border-radius: 8px; margin-top: 15px; }
          .fee-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #94a3b8; }
          .fee-total { font-size: 18px; font-weight: bold; color: #1e40af; padding-top: 12px; margin-top: 12px; border-top: 2px solid #3b82f6; }
          .credentials { background: #fef3c7; border: 2px dashed #f59e0b; padding: 15px; margin-top: 20px; text-align: center; }
          .credentials h3 { color: #92400e; margin-bottom: 10px; }
          .credential-item { font-size: 16px; color: #78350f; margin: 5px 0; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; font-size: 12px; color: #64748b; }
          @media print { body { padding: 0; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎓 School Admission Receipt</h1>
            <p>Application Number: <strong>${applicationNumber}</strong></p>
            <p>Date: ${new Date().toLocaleDateString('en-GB')}</p>
          </div>

          <div class="section">
            <div class="section-title">Student Information</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Student Name</div>
                <div class="info-value">${student.firstName} ${student.lastName}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Date of Birth</div>
                <div class="info-value">${student.dob || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Gender</div>
                <div class="info-value">${student.gender || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Blood Group</div>
                <div class="info-value">${student.bloodGroup || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Class Assigned</div>
                <div class="info-value">${classAssigned}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Admission Date</div>
                <div class="info-value">${student.admissionDate || new Date().toLocaleDateString('en-GB')}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Parent/Guardian Details</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Father's Name</div>
                <div class="info-value">${father.name || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Father's Phone</div>
                <div class="info-value">${father.phone || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Mother's Name</div>
                <div class="info-value">${mother.name || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Mother's Phone</div>
                <div class="info-value">${mother.phone || 'N/A'}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Address</div>
            <div class="info-item">
              <div class="info-value">${address.line1 || ''} ${address.line2 || ''}, ${address.city || ''}, ${address.state || ''} - ${address.pincode || ''}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Fee Structure</div>
            <div class="fee-summary">
              ${feeData.admissionFee > 0 ? `<div class="fee-row"><span>Admission Fee</span><span>₹ ${parseFloat(feeData.admissionFee).toLocaleString()}</span></div>` : ''}
              ${feeData.tuitionFee > 0 ? `<div class="fee-row"><span>Tuition Fee</span><span>₹ ${parseFloat(feeData.tuitionFee).toLocaleString()}</span></div>` : ''}
              ${feeData.annualFee > 0 ? `<div class="fee-row"><span>Annual Fee</span><span>₹ ${parseFloat(feeData.annualFee).toLocaleString()}</span></div>` : ''}
              ${feeData.transportFee > 0 ? `<div class="fee-row"><span>Transport Fee</span><span>₹ ${parseFloat(feeData.transportFee).toLocaleString()}</span></div>` : ''}
              ${feeData.hostelFee > 0 ? `<div class="fee-row"><span>Hostel Fee</span><span>₹ ${parseFloat(feeData.hostelFee).toLocaleString()}</span></div>` : ''}
              ${feeData.activityFee > 0 ? `<div class="fee-row"><span>Activity Fee</span><span>₹ ${parseFloat(feeData.activityFee).toLocaleString()}</span></div>` : ''}
              ${feeData.examFee > 0 ? `<div class="fee-row"><span>Exam Fee</span><span>₹ ${parseFloat(feeData.examFee).toLocaleString()}</span></div>` : ''}
              ${feeData.otherFees > 0 ? `<div class="fee-row"><span>Other Fees</span><span>₹ ${parseFloat(feeData.otherFees).toLocaleString()}</span></div>` : ''}
              ${feeData.discount > 0 ? `<div class="fee-row" style="color: #059669;"><span>Discount</span><span>- ₹ ${parseFloat(feeData.discount).toLocaleString()}</span></div>` : ''}
              <div class="fee-total">
                <div class="fee-row" style="border: none;">
                  <span>Net Amount Payable</span>
                  <span>₹ ${feeData.netAmount.toLocaleString()}</span>
                </div>
              </div>
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #94a3b8;">
                <div class="fee-row" style="border: none;">
                  <span>Payment Mode</span>
                  <span>${feeData.paymentMode}</span>
                </div>
                <div class="fee-row" style="border: none;">
                  <span>Payment Status</span>
                  <span style="color: ${feeData.paymentStatus === 'Paid' ? '#059669' : '#dc2626'};">${feeData.paymentStatus}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="credentials">
            <h3>🔐 Student Login Credentials</h3>
            <div class="credential-item"><strong>Username:</strong> ${username}</div>
            <div class="credential-item"><strong>Password:</strong> ${password}</div>
            <p style="font-size: 12px; margin-top: 10px; color: #92400e;">Please keep these credentials safe and change password after first login.</p>
          </div>

          <div class="footer">
            <p><strong>Important:</strong> Please preserve this document for future reference.</p>
            <p style="margin-top: 8px;">For queries, contact the school administration office.</p>
            <p style="margin-top: 15px;">© ${new Date().getFullYear()} School ERP System. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return htmlContent;
  };

  const downloadPDF = (htmlContent, filename) => {
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    try {
      setSubmitting(true);
      const { student, fees } = formData;

      // Upload photo first if present
      let profileImageUrl = '';
      if (student.photoFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', student.photoFile);
        const uploadRes = await fetch(`${API_BASE}/api/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${user?.token || localStorage.getItem('token') || ''}`
          },
          body: formDataUpload
        });
        const uploadJson = await uploadRes.json();
        if (uploadJson?.fileUrl) profileImageUrl = uploadJson.fileUrl;
      }

      // Upload documents if present
      const uploadedDocuments = [];
      if (formData.other.documentFiles && formData.other.documentFiles.length > 0) {
        const formDataDocs = new FormData();
        formData.other.documentFiles.forEach(file => {
          formDataDocs.append('files', file);
        });
        const docsRes = await fetch(`${API_BASE}/api/upload-multiple`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${user?.token || localStorage.getItem('token') || ''}`
          },
          body: formDataDocs
        });
        const docsJson = await docsRes.json();
        if (docsJson?.success && Array.isArray(docsJson.files)) {
          docsJson.files.forEach((file, idx) => {
            uploadedDocuments.push({
              documentType: formData.other.documentFiles[idx].name.includes('birth') ? 'Birth Certificate' : 
                             formData.other.documentFiles[idx].name.includes('tc') ? 'Transfer Certificate' :
                             formData.other.documentFiles[idx].name.includes('aadhar') ? 'Aadhar Card' : 'Other',
              documentName: file.originalName,
              documentUrl: file.fileUrl
            });
          });
        }
      }

      // Calculate fees totals
      const totalFees = 
        parseFloat(fees.admissionFee || 0) +
        parseFloat(fees.tuitionFee || 0) +
        parseFloat(fees.annualFee || 0) +
        parseFloat(fees.transportFee || 0) +
        parseFloat(fees.hostelFee || 0) +
        parseFloat(fees.activityFee || 0) +
        parseFloat(fees.examFee || 0) +
        parseFloat(fees.otherFees || 0);
      const netAmount = totalFees - parseFloat(fees.discount || 0);

      // Build payload for backend admission
      const payload = {
        student: {
          name: `${student.firstName} ${student.lastName}`.trim(),
          mobile: formData.father.phone || formData.mother.phone || '',
          dob: student.dob,
          gender: student.gender,
          bloodGroup: student.bloodGroup,
          address: `${formData.address.line1} ${formData.address.line2}`.trim(),
          city: formData.address.city,
          state: formData.address.state,
          pincode: formData.address.pincode,
          classId: student.applyingForClass,
          section: 'A',
          academicYear: new Date().getFullYear().toString(),
          schoolId: user?.schoolId || 'SCHOOL-001',
          profileImageUrl
        },
        parent: {
          name: formData.father.name || formData.mother.name || 'Parent',
          mobile: formData.father.phone || formData.mother.phone || '',
          email: formData.father.email || formData.mother.email || ''
        },
        fee: {
          amount: netAmount,
          feeType: 'tuition',
          paymentMode: fees.paymentMode,
          status: fees.paymentStatus?.toLowerCase() === 'paid' ? 'paid' : 'pending'
        },
        transport: {
          optIn: !!formData.other.transportRequired,
          routeId: formData.other.transportRouteId || '',
          stopId: formData.other.transportStopId || '',
          feeAmount: parseFloat(fees.transportFee || 0),
          paymentMode: fees.paymentMode,
          feeStatus: fees.paymentStatus?.toLowerCase() === 'paid' ? 'paid' : 'pending'
        },
        documents: uploadedDocuments
      };

      const res = await fetch(`${API_BASE}/api/admission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token || localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!json?.success) {
        throw new Error(json?.error || 'Admission failed');
      }

      const data = json.data;
      const newAppNumber = data?.student?.studentId || `APP/${new Date().toISOString().slice(2, 10).replace(/-/g, "/")}/${String(applications.length + 1).padStart(4, "0")}`;

      // Prepare PDF data
      const feeData = {
        admissionFee: fees.admissionFee || 0,
        tuitionFee: fees.tuitionFee || 0,
        annualFee: fees.annualFee || 0,
        transportFee: fees.transportFee || 0,
        hostelFee: fees.hostelFee || 0,
        activityFee: fees.activityFee || 0,
        examFee: fees.examFee || 0,
        otherFees: fees.otherFees || 0,
        discount: fees.discount || 0,
        netAmount,
        paymentMode: fees.paymentMode,
        paymentStatus: fees.paymentStatus
      };
      const pdfHtml = generateAdmissionPDF({
        applicationNumber: newAppNumber,
        username: data?.student?.credentials?.username,
        password: data?.student?.credentials?.password,
        classAssigned: student.applyingForClass || 'Pending Assignment'
      }, formData, feeData);

      setConfirmation({
        applicationNumber: newAppNumber,
        username: data?.student?.credentials?.username,
        password: data?.student?.credentials?.password,
        classAssigned: student.applyingForClass || 'Pending Assignment',
        netAmount,
        paymentStatus: fees.paymentStatus,
        pdfHtml,
        message: 'Student admission completed. Credentials generated and records synced.',
        studentData: {
          ...data?.student,
          name: `${student.firstName} ${student.lastName}`.trim(),
          fatherName: formData.father.name,
          mobile: formData.father.phone || formData.mother.phone,
          address: `${formData.address.line1}, ${formData.address.city}`.trim(),
          classId: student.applyingForClass,
          studentId: data?.studentId || newAppNumber,
          profileImageUrl
        }
      });

      // Optionally, refresh students list page later
      setSubmitting(false);
      resetForm();
    } catch (err) {
      console.error('Admission submit error:', err);
      setSubmitting(false);
      setConfirmation({
        applicationNumber: 'ERROR',
        username: '',
        password: '',
        classAssigned: '',
        netAmount: 0,
        paymentStatus: 'Error',
        pdfHtml: '',
        message: err.message || 'Admission failed'
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="p-4 text-sm text-red-600">
        Only Admin and Super Admin can manage admissions. Please contact an administrator for access.
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <UserPlus className="text-blue-600" size={28} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admission Management</h1>
            <p className="text-sm text-gray-600">Create new applications, share QR for parents, and auto-provision student accounts.</p>
          </div>
        </div>
      </header>

      {/* Top widgets */}
      <section className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-gray-500">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clipboard size={18} />
            </div>
          </div>
        </div>
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-gray-500">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900">{applications.filter(a => a.payment?.toLowerCase().includes("pending")).length}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Mail size={18} />
            </div>
          </div>
        </div>
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-gray-500">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{applications.filter(a => a.status === "Approved").length}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
          </div>
        </div>
      </section>

      {/* QR share + manual creation */}
      <section className="grid lg:grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <QRCode className="text-blue-600" size={22} />
            <h3 className="font-semibold text-gray-900">Generate QR for Parents</h3>
          </div>
          <p className="text-sm text-gray-600">Parents scan the QR to open the admission form, submit, and the application is auto-created in the system.</p>
          <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4 border">
            <img src={qrSrc} alt="Admission QR" className="w-48 h-48 object-contain" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(applyUrl)}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm flex items-center gap-2 hover:bg-gray-50"
            >
              <Copy size={16} /> Copy Link
            </button>
            <a
              href={qrSrc}
              download="admission-qr.png"
              className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm flex items-center gap-2 hover:bg-blue-700"
            >
              <QRCode size={16} /> Download QR
            </a>
          </div>
          <div className="text-xs text-gray-500">Link: {applyUrl}</div>
        </div>

        <div className="lg:col-span-2 bg-white border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="text-blue-600" size={20} />
            <h3 className="font-semibold text-gray-900">Create New Admission Application</h3>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Student Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <InfoField label="First Name">
                <input value={formData.student.firstName} onChange={(e) => handleTextChange("student", "firstName", e.target.value)} className={inputCls} placeholder="First Name" required />
              </InfoField>
              <InfoField label="Last Name">
                <input value={formData.student.lastName} onChange={(e) => handleTextChange("student", "lastName", e.target.value)} className={inputCls} placeholder="Last Name" />
              </InfoField>
              <InfoField label="Date of Birth">
                <input type="date" value={formData.student.dob} onChange={(e) => handleTextChange("student", "dob", e.target.value)} className={inputCls} required />
              </InfoField>
              <InfoField label="Gender">
                <select value={formData.student.gender} onChange={(e) => handleTextChange("student", "gender", e.target.value)} className={inputCls} required>
                  <option value="">Select Gender</option>
                  {genderOptions.map((g) => <option key={g}>{g}</option>)}
                </select>
              </InfoField>
              <InfoField label="Student Blood Group">
                <select value={formData.student.bloodGroup} onChange={(e) => handleTextChange("student", "bloodGroup", e.target.value)} className={inputCls}>
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map((b) => <option key={b}>{b}</option>)}
                </select>
              </InfoField>
              <InfoField label="Student Aadhar">
                <input value={formData.student.aadhar} onChange={(e) => handleTextChange("student", "aadhar", e.target.value)} className={inputCls} placeholder="Aadhar" />
              </InfoField>
              <InfoField label="Student Nationality">
                <input value={formData.student.nationality} onChange={(e) => handleTextChange("student", "nationality", e.target.value)} className={inputCls} placeholder="Nationality" />
              </InfoField>
              <InfoField label="Student Religion">
                <select value={formData.student.religion} onChange={(e) => handleTextChange("student", "religion", e.target.value)} className={inputCls}>
                  <option value="">Select Religion</option>
                  {religions.map((r) => <option key={r}>{r}</option>)}
                </select>
              </InfoField>
              <InfoField label="Social Category (Caste)">
                <select value={formData.student.socialCategory} onChange={(e) => handleTextChange("student", "socialCategory", e.target.value)} className={inputCls}>
                  <option value="">Select Social Category</option>
                  {socialCategories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </InfoField>
              <InfoField label="Student Category">
                <select value={formData.student.studentCategory} onChange={(e) => handleTextChange("student", "studentCategory", e.target.value)} className={inputCls}>
                  <option value="">Select Category</option>
                  {studentCategories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </InfoField>
              <InfoField label="Student Mother Tongue">
                <select value={formData.student.motherTongue} onChange={(e) => handleTextChange("student", "motherTongue", e.target.value)} className={inputCls}>
                  <option value="">Select Mother Tongue</option>
                  {motherTongues.map((c) => <option key={c}>{c}</option>)}
                </select>
              </InfoField>
              <InfoField label="Applying For Class">
                <select value={formData.student.applyingForClass} onChange={(e) => handleTextChange("student", "applyingForClass", e.target.value)} className={inputCls} required>
                  <option value="">Select Class</option>
                  {dynamicClasses.map((c) => <option key={c}>{c}</option>)}
                </select>
              </InfoField>
              <InfoField label="Admission Date">
                <input type="date" value={formData.student.admissionDate} onChange={(e) => handleTextChange("student", "admissionDate", e.target.value)} className={inputCls} />
              </InfoField>
              <InfoField label="Previous School">
                <input value={formData.student.previousSchool} onChange={(e) => handleTextChange("student", "previousSchool", e.target.value)} className={inputCls} placeholder="Previous School" />
              </InfoField>
              <InfoField label="Previous Class">
                <input value={formData.student.previousClass} onChange={(e) => handleTextChange("student", "previousClass", e.target.value)} className={inputCls} placeholder="Previous Class" />
              </InfoField>
              <InfoField label="TC Number">
                <input value={formData.student.tcNumber} onChange={(e) => handleTextChange("student", "tcNumber", e.target.value)} className={inputCls} placeholder="Transfer Certificate Number" />
              </InfoField>
              <InfoField label="Student Photo">
                <div className="border border-dashed border-gray-300 rounded-lg p-3 flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <UploadCloud className="text-gray-500" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">Upload student photo (JPG, PNG - Max 2MB)</p>
                    <input type="file" accept="image/*" className="text-xs text-gray-500" onChange={(e) => handlePhoto(e.target.files?.[0])} />
                  </div>
                </div>
              </InfoField>
            </div>

            {/* Father Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <InfoField label="Father Name">
                <input value={formData.father.name} onChange={(e) => handleTextChange("father", "name", e.target.value)} className={inputCls} placeholder="Father Name" />
              </InfoField>
              <InfoField label="Father Occupation">
                <input value={formData.father.occupation} onChange={(e) => handleTextChange("father", "occupation", e.target.value)} className={inputCls} placeholder="Occupation" />
              </InfoField>
              <InfoField label="Father Phone">
                <input value={formData.father.phone} onChange={(e) => handleTextChange("father", "phone", e.target.value)} className={inputCls} placeholder="Mobile" />
              </InfoField>
              <InfoField label="Father Email">
                <input type="email" value={formData.father.email} onChange={(e) => handleTextChange("father", "email", e.target.value)} className={inputCls} placeholder="Email" />
              </InfoField>
            </div>

            {/* Mother Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <InfoField label="Mother Name">
                <input value={formData.mother.name} onChange={(e) => handleTextChange("mother", "name", e.target.value)} className={inputCls} placeholder="Mother Name" />
              </InfoField>
              <InfoField label="Mother Occupation">
                <input value={formData.mother.occupation} onChange={(e) => handleTextChange("mother", "occupation", e.target.value)} className={inputCls} placeholder="Occupation" />
              </InfoField>
              <InfoField label="Mother Phone">
                <input value={formData.mother.phone} onChange={(e) => handleTextChange("mother", "phone", e.target.value)} className={inputCls} placeholder="Mobile" />
              </InfoField>
              <InfoField label="Mother Email">
                <input type="email" value={formData.mother.email} onChange={(e) => handleTextChange("mother", "email", e.target.value)} className={inputCls} placeholder="Email" />
              </InfoField>
            </div>

            {/* Address */}
            <div className="grid md:grid-cols-2 gap-4">
              <InfoField label="Address Line 1">
                <input value={formData.address.line1} onChange={(e) => handleTextChange("address", "line1", e.target.value)} className={inputCls} placeholder="House / Street" />
              </InfoField>
              <InfoField label="Address Line 2">
                <input value={formData.address.line2} onChange={(e) => handleTextChange("address", "line2", e.target.value)} className={inputCls} placeholder="Area / Landmark" />
              </InfoField>
              <InfoField label="City">
                <input value={formData.address.city} onChange={(e) => handleTextChange("address", "city", e.target.value)} className={inputCls} placeholder="City" />
              </InfoField>
              <InfoField label="State">
                <input value={formData.address.state} onChange={(e) => handleTextChange("address", "state", e.target.value)} className={inputCls} placeholder="State" />
              </InfoField>
              <InfoField label="Pincode">
                <input value={formData.address.pincode} onChange={(e) => handleTextChange("address", "pincode", e.target.value)} className={inputCls} placeholder="Pincode" />
              </InfoField>
              <InfoField label="District">
                <input value={formData.address.district} onChange={(e) => handleTextChange("address", "district", e.target.value)} className={inputCls} placeholder="District" readOnly />
              </InfoField>
              <InfoField label="Region">
                <input value={formData.address.region} onChange={(e) => handleTextChange("address", "region", e.target.value)} className={inputCls} placeholder="Region" readOnly />
              </InfoField>
            </div>

            {/* Other Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <InfoField label="Transport Required">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={formData.other.transportRequired} onChange={() => handleCheckbox("other", "transportRequired")} /> Yes
                </div>
              </InfoField>
              
              {formData.other.transportRequired && (
                <>
                  <InfoField label="Select Route">
                    <select 
                      value={formData.other.transportRouteId} 
                      onChange={(e) => {
                        handleTextChange("other", "transportRouteId", e.target.value);
                        handleTextChange("other", "transportStopId", "");
                      }}
                      className={inputCls}
                      required={formData.other.transportRequired}
                    >
                      <option value="">Choose Route</option>
                      {transportRoutes.map(route => (
                        <option key={route.id} value={route.id}>{route.routeName}</option>
                      ))}
                    </select>
                  </InfoField>
                  
                  <InfoField label="Select Stop">
                    <select 
                      value={formData.other.transportStopId} 
                      onChange={(e) => handleTextChange("other", "transportStopId", e.target.value)}
                      className={inputCls}
                      disabled={!formData.other.transportRouteId}
                      required={formData.other.transportRequired}
                    >
                      <option value="">Choose Stop</option>
                      {transportStops
                        .filter(stop => {
                          const selectedRoute = transportRoutes.find(r => r.id === formData.other.transportRouteId);
                          return selectedRoute && selectedRoute.stops && selectedRoute.stops.includes(stop.id);
                        })
                        .map(stop => (
                          <option key={stop.id} value={stop.id}>{stop.stopName}</option>
                        ))}
                    </select>
                  </InfoField>
                  
                  <InfoField label="Trip Type">
                    <select 
                      value={formData.other.transportTripType} 
                      onChange={(e) => handleTextChange("other", "transportTripType", e.target.value)}
                      className={inputCls}
                    >
                      <option value="Both">Both (Pickup & Drop)</option>
                      <option value="Pickup Only">Pickup Only</option>
                      <option value="Drop Only">Drop Only</option>
                    </select>
                  </InfoField>
                </>
              )}
              
              <InfoField label="Hostel">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={formData.other.hostler} onChange={() => handleCheckbox("other", "hostler")} /> Required
                </div>
              </InfoField>
              <InfoField label="Upload Documents">
                <div className="border border-dashed border-gray-300 rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <UploadCloud className="text-blue-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">Upload Student Documents</p>
                      <p className="text-xs text-gray-500">Birth Certificate, TC, Aadhar, etc. (PDF, JPG, PNG - Max 10MB each)</p>
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" 
                        multiple
                        className="text-xs text-gray-500 mt-2" 
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          setFormData(prev => ({
                            ...prev,
                            other: { ...prev.other, documentFiles: [...prev.other.documentFiles, ...files] }
                          }));
                        }} 
                      />
                    </div>
                  </div>
                  {formData.other.documentFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-700">{formData.other.documentFiles.length} file(s) selected:</p>
                      <div className="space-y-1">
                        {formData.other.documentFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded text-xs">
                            <span className="text-gray-700">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  other: {
                                    ...prev.other,
                                    documentFiles: prev.other.documentFiles.filter((_, i) => i !== idx)
                                  }
                                }));
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </InfoField>
              <InfoField label="Notes">
                <textarea value={formData.other.notes} onChange={(e) => handleTextChange("other", "notes", e.target.value)} className={inputCls} rows="3" placeholder="Additional instructions"></textarea>
              </InfoField>
            </div>

            {/* Fee Details Section */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center">
                  <span className="text-sm font-bold">₹</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">Fee Details</h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <InfoField label="Admission Fee (₹)">
                  <input 
                    type="number" 
                    value={formData.fees.admissionFee} 
                    onChange={(e) => handleTextChange("fees", "admissionFee", e.target.value)} 
                    className={inputCls} 
                    placeholder="0" 
                  />
                </InfoField>
                <InfoField label="Tuition Fee (₹)">
                  <input 
                    type="number" 
                    value={formData.fees.tuitionFee} 
                    onChange={(e) => handleTextChange("fees", "tuitionFee", e.target.value)} 
                    className={inputCls} 
                    placeholder="0" 
                  />
                </InfoField>
                <InfoField label="Annual Fee (₹)">
                  <input 
                    type="number" 
                    value={formData.fees.annualFee} 
                    onChange={(e) => handleTextChange("fees", "annualFee", e.target.value)} 
                    className={inputCls} 
                    placeholder="0" 
                  />
                </InfoField>
                <InfoField label="Transport Fee (₹)">
                  <input 
                    type="number" 
                    value={formData.fees.transportFee} 
                    onChange={(e) => handleTextChange("fees", "transportFee", e.target.value)} 
                    className={inputCls} 
                    placeholder="0" 
                    disabled={!formData.other.transportRequired}
                  />
                </InfoField>
                <InfoField label="Hostel Fee (₹)">
                  <input 
                    type="number" 
                    value={formData.fees.hostelFee} 
                    onChange={(e) => handleTextChange("fees", "hostelFee", e.target.value)} 
                    className={inputCls} 
                    placeholder="0" 
                    disabled={!formData.other.hostler}
                  />
                </InfoField>
                <InfoField label="Activity Fee (₹)">
                  <input 
                    type="number" 
                    value={formData.fees.activityFee} 
                    onChange={(e) => handleTextChange("fees", "activityFee", e.target.value)} 
                    className={inputCls} 
                    placeholder="0" 
                  />
                </InfoField>
                <InfoField label="Exam Fee (₹)">
                  <input 
                    type="number" 
                    value={formData.fees.examFee} 
                    onChange={(e) => handleTextChange("fees", "examFee", e.target.value)} 
                    className={inputCls} 
                    placeholder="0" 
                  />
                </InfoField>
                <InfoField label="Other Fees (₹)">
                  <input 
                    type="number" 
                    value={formData.fees.otherFees} 
                    onChange={(e) => handleTextChange("fees", "otherFees", e.target.value)} 
                    className={inputCls} 
                    placeholder="0" 
                  />
                </InfoField>
                <InfoField label="Discount (₹)">
                  <input 
                    type="number" 
                    value={formData.fees.discount} 
                    onChange={(e) => handleTextChange("fees", "discount", e.target.value)} 
                    className={inputCls} 
                    placeholder="0" 
                  />
                </InfoField>
              </div>

              {/* Fee Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 font-medium">Total Fees:</span>
                  <span className="font-bold text-gray-900">₹ {(
                    parseFloat(formData.fees.admissionFee || 0) +
                    parseFloat(formData.fees.tuitionFee || 0) +
                    parseFloat(formData.fees.annualFee || 0) +
                    parseFloat(formData.fees.transportFee || 0) +
                    parseFloat(formData.fees.hostelFee || 0) +
                    parseFloat(formData.fees.activityFee || 0) +
                    parseFloat(formData.fees.examFee || 0) +
                    parseFloat(formData.fees.otherFees || 0)
                  ).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 font-medium">Discount:</span>
                  <span className="font-semibold text-emerald-600">- ₹ {parseFloat(formData.fees.discount || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-base border-t border-blue-300 pt-2">
                  <span className="text-gray-900 font-bold">Net Amount Payable:</span>
                  <span className="font-bold text-blue-600 text-lg">₹ {(
                    parseFloat(formData.fees.admissionFee || 0) +
                    parseFloat(formData.fees.tuitionFee || 0) +
                    parseFloat(formData.fees.annualFee || 0) +
                    parseFloat(formData.fees.transportFee || 0) +
                    parseFloat(formData.fees.hostelFee || 0) +
                    parseFloat(formData.fees.activityFee || 0) +
                    parseFloat(formData.fees.examFee || 0) +
                    parseFloat(formData.fees.otherFees || 0) -
                    parseFloat(formData.fees.discount || 0)
                  ).toLocaleString()}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <InfoField label="Payment Mode">
                  <select 
                    value={formData.fees.paymentMode} 
                    onChange={(e) => handleTextChange("fees", "paymentMode", e.target.value)} 
                    className={inputCls}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Debit/Credit Card</option>
                    <option value="UPI">UPI</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Cheque">Cheque</option>
                    <option value="DD">Demand Draft</option>
                  </select>
                </InfoField>
                <InfoField label="Payment Status">
                  <select 
                    value={formData.fees.paymentStatus} 
                    onChange={(e) => handleTextChange("fees", "paymentStatus", e.target.value)} 
                    className={inputCls}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Partial">Partial Payment</option>
                    <option value="Waived">Waived</option>
                  </select>
                </InfoField>
                <InfoField label="Fee Remarks">
                  <textarea 
                    value={formData.fees.remarks} 
                    onChange={(e) => handleTextChange("fees", "remarks", e.target.value)} 
                    className={inputCls} 
                    rows="2" 
                    placeholder="Payment reference, concession details, etc."
                  ></textarea>
                </InfoField>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-sm"
              >
                {submitting ? "Saving..." : "Save & Generate ID"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                Clear Form
              </button>
            </div>
          </form>

          {confirmation && (
            <div className="mt-4 p-4 rounded-lg border bg-emerald-50 text-sm space-y-3">
              <div className="font-semibold text-emerald-800 text-base">✓ Application {confirmation.applicationNumber} created successfully!</div>
              <div className="grid md:grid-cols-2 gap-2 text-emerald-700">
                <div><span className="font-medium">Assigned Class:</span> {confirmation.classAssigned}</div>
                <div><span className="font-medium">Login ID:</span> {confirmation.username}</div>
                <div><span className="font-medium">Password:</span> {confirmation.password}</div>
                <div><span className="font-medium">Payment Status:</span> {confirmation.paymentStatus}</div>
              </div>
              {confirmation.netAmount > 0 && (
                <div className="bg-white rounded-lg p-3 border border-emerald-200">
                  <div className="font-semibold text-emerald-900">Fee Summary:</div>
                  <div className="text-emerald-800 text-lg font-bold">₹ {confirmation.netAmount.toLocaleString()} - {confirmation.paymentStatus}</div>
                </div>
              )}
              <div className="text-emerald-700 text-xs pt-2">{confirmation.message}</div>
              
              {/* PDF Actions */}
              <div className="flex items-center gap-3 pt-3 border-t border-emerald-200">
                <button
                  onClick={() => setViewingIDCard(confirmation.studentData)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium text-sm"
                >
                  <UserPlus size={16} />
                  View ID Card
                </button>
                <button
                  onClick={() => downloadPDF(confirmation.pdfHtml, `Admission-${confirmation.applicationNumber}.pdf`)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                >
                  <Download size={16} />
                  Download PDF
                </button>
                <button
                  onClick={() => {
                    const printWindow = window.open('', '', 'width=800,height=600');
                    printWindow.document.write(confirmation.pdfHtml);
                    printWindow.document.close();
                    printWindow.focus();
                    setTimeout(() => printWindow.print(), 250);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition font-medium text-sm"
                >
                  <Printer size={16} />
                  Print Receipt
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      
      {/* Render ID Card Modal */}
      {viewingIDCard && (
        <StudentIDCard 
          student={viewingIDCard} 
          onClose={() => setViewingIDCard(null)} 
        />
      )}
    </div>
  );
}
