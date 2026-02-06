import { useSearchParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  UserCog, 
  School, 
  ShieldCheck, 
  FileText, 
  Key, 
  UserCircle, 
  Briefcase, 
  UserX 
} from "lucide-react";

const employeeDirectory = [
  {
    id: "fa",
    name: "Farhana",
    username: "greenField_farhana",
    role: "Vice Principal",
    joined: "2025-10-04",
    accessType: "Employee",
    phone: "+91 98765 43210",
    email: "farhana@greenfield.edu"
  },
  { id: "sd", name: "Sukhdev Driver", username: "greenField_sukhdev", role: "Driver", joined: "2025-11-18", accessType: "Transport", phone: "+91 90000 00001", email: "sukhdev@greenfield.edu" },
  { id: "am", name: "Atul Manager", username: "greenField_atul", role: "Finance Manager", joined: "2025-08-12", accessType: "Employee", phone: "+91 90000 00002", email: "atul@greenfield.edu" },
  { id: "kd", name: "Kanchan Das", username: "greenField_kanchan", role: "Teacher", joined: "2025-06-02", accessType: "Academic", phone: "+91 90000 00003", email: "kanchan@greenfield.edu" },
  { id: "fl", name: "Flintoff", username: "greenField_flintoff", role: "Teacher", joined: "2025-06-02", accessType: "Academic", phone: "+91 90000 00004", email: "flintoff@greenfield.edu" },
  { id: "vk", name: "Vinod Kumar", username: "greenField_vinod", role: "Teacher", joined: "2025-06-02", accessType: "Academic", phone: "+91 90000 00005", email: "vinod@greenfield.edu" },
  { id: "kp", name: "Kamlesh Pawar", username: "greenField_kamlesh", role: "Teacher", joined: "2025-06-02", accessType: "Academic", phone: "+91 90000 00006", email: "kamlesh@greenfield.edu" }
];

function FeatureCard({ icon: Icon, title, description, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        danger 
          ? 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
          : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
      }`}
    >
      <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white opacity-10 group-hover:scale-150 transition-transform duration-300"></div>
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-4 rounded-full bg-white bg-opacity-20 p-4 backdrop-blur-sm">
          <Icon size={40} className="text-white" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-blue-100">{description}</p>
        )}
      </div>
    </button>
  );
}

export default function EmployeeEdit() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const employeeId = searchParams.get("employeeId");

  const employee = employeeDirectory.find((e) => e.id === employeeId);

  // Check if employee is removed/former
  const removedEmployees = JSON.parse(localStorage.getItem('removedEmployees') || '[]');
  const isFormerEmployee = removedEmployees.some(emp => emp.id === employeeId);

  if (isFormerEmployee) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="text-red-600 text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-red-900 mb-2">Access Denied</h2>
          <p className="text-red-700 mb-4">
            This employee has been removed from the school and cannot be edited.
          </p>
          <p className="text-sm text-red-600 mb-4">
            Former employees are read-only and cannot perform any actions or be modified.
          </p>
          <button
            onClick={() => navigate("/employees")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Employees
          </button>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <p className="text-red-600">Employee not found</p>
          <button
            onClick={() => navigate("/employees")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Employees
          </button>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: UserCog,
      title: "Change Details",
      description: `Update ${employee.username} information`,
      onClick: () => navigate(`/employees/change-details?employeeId=${employeeId}`)
    },
    {
      icon: School,
      title: "Accessible Class",
      description: "Manage class access permissions",
      onClick: () => navigate(`/employees/accessible-class?employeeId=${employeeId}`)
    },
    {
      icon: ShieldCheck,
      title: "Change Permissions",
      description: "Modify role-based permissions",
      onClick: () => navigate(`/employees/change-permissions?employeeId=${employeeId}`)
    },
    {
      icon: FileText,
      title: "Experience Letter",
      description: "Generate or view experience letter",
      onClick: () => navigate(`/employees/experience-letter?employeeId=${employeeId}`)
    },
    {
      icon: Key,
      title: "Change Password",
      description: "Reset employee password",
      onClick: () => navigate(`/employees/change-password?employeeId=${employeeId}`)
    },
    {
      icon: UserCircle,
      title: "Change User Role",
      description: "Update employee designation",
      onClick: () => navigate(`/employees/change-role?employeeId=${employeeId}`)
    },
    {
      icon: Briefcase,
      title: "Bank Details",
      description: "Update banking information",
      onClick: () => navigate(`/employees/bank-details?employeeId=${employeeId}`)
    },
    {
      icon: UserX,
      title: "Remove From School",
      description: "Deactivate employee account",
      onClick: () => navigate(`/employees/remove?employeeId=${employeeId}`),
      danger: true
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/employees")}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-4 transition"
        >
          <ArrowLeft size={20} />
          Back to Employees
        </button>
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center text-2xl shadow-lg overflow-hidden">
              {employee.profileImage ? (
                <img src={employee.profileImage} alt={employee.name} className="h-full w-full object-cover" />
              ) : (
                employee.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Change details for {employee.username}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="font-medium">{employee.name}</span>
                <span>•</span>
                <span>{employee.role}</span>
                <span>•</span>
                <span>Joined {employee.joined}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {features.map((feature, idx) => (
          <FeatureCard key={idx} {...feature} />
        ))}
      </div>
    </div>
  );
}
