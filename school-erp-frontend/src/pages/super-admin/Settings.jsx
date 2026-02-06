import React, { useState, useEffect } from "react";
import {
  Building2,
  BookOpen,
  Settings as SettingsIcon,
  CreditCard,
  Palette,
  Smartphone,
  Grid3x3,
  Fingerprint,
  FileText,
  ChevronRight,
  X,
  Plus,
  Trash2,
  Edit2,
  Save,
  Upload,
  Tag,
  Zap,
} from "lucide-react";
import SchoolProfileForm from "./SchoolProfileForm";

export default function Settings() {
  const [activeTab, setActiveTab] = useState(null);
  const [settings, setSettings] = useState({
    schoolProfile: {
      schoolName: "",
      principalName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      established: "",
      affiliation: "",
      registrationNumber: "",
      logo: null,
    },
    registers: [],
    selectedClasses: [],
    selectedSubjects: [],
    paymentGateways: [],
    feesTypes: [],
    genieSettings: {
      apiKey: "",
      enabled: false,
      features: [],
    },
    mobileTheme: {
      primaryColor: "#8B5CF6",
      secondaryColor: "#EC4899",
      fontFamily: "Inter",
      darkMode: false,
    },
    dashboard: {
      layout: "grid",
      defaultModule: "dashboard",
      enableWidgets: true,
    },
    biometricDevices: [],
    documentThemes: {
      tc: "default",
      invoice: "default",
      result: "default",
    },
  });

  // Local state for form inputs to avoid re-renders on every keystroke
  const [formData, setFormData] = useState({
    schoolName: "",
    principalName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    established: "",
    affiliation: "",
    registrationNumber: "",
  });

  // Load from localStorage and stay in sync when other components update it
  useEffect(() => {
    const loadSettings = () => {
      const saved = localStorage.getItem("school-settings");
      if (!saved) return;
      try {
        const parsedSettings = JSON.parse(saved);
        setSettings(parsedSettings);
        setFormData({
          schoolName: parsedSettings.schoolProfile.schoolName || "",
          principalName: parsedSettings.schoolProfile.principalName || "",
          email: parsedSettings.schoolProfile.email || "",
          phone: parsedSettings.schoolProfile.phone || "",
          address: parsedSettings.schoolProfile.address || "",
          city: parsedSettings.schoolProfile.city || "",
          state: parsedSettings.schoolProfile.state || "",
          pincode: parsedSettings.schoolProfile.pincode || "",
          established: parsedSettings.schoolProfile.established || "",
          affiliation: parsedSettings.schoolProfile.affiliation || "",
          registrationNumber: parsedSettings.schoolProfile.registrationNumber || "",
        });
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };

    loadSettings();

    const handleExternalUpdate = (event) => {
      if (!event || event.key === "school-settings" || event.type === "school-settings-updated") {
        loadSettings();
      }
    };

    window.addEventListener("storage", handleExternalUpdate);
    window.addEventListener("school-settings-updated", handleExternalUpdate);

    return () => {
      window.removeEventListener("storage", handleExternalUpdate);
      window.removeEventListener("school-settings-updated", handleExternalUpdate);
    };
  }, []);

  // Save to localStorage while preserving latest fields from other sources (like SchoolProfileForm logo)
  const saveSettings = (updatedSettings) => {
    let mergedSettings = updatedSettings;

    const existing = localStorage.getItem("school-settings");
    if (existing) {
      try {
        const parsed = JSON.parse(existing);
        mergedSettings = {
          ...parsed,
          ...updatedSettings,
          schoolProfile: {
            ...(parsed.schoolProfile || {}),
            ...(updatedSettings.schoolProfile || {}),
          },
        };
      } catch (error) {
        console.error("Error merging settings:", error);
      }
    }

    localStorage.setItem("school-settings", JSON.stringify(mergedSettings));
    setSettings(mergedSettings);
    window.dispatchEvent(new Event("school-settings-updated"));
  };

  // Handle form input changes (local state only)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save school profile form when explicitly submitted
  const handleSaveProfile = () => {
    const updatedSettings = {
      ...settings,
      schoolProfile: {
        ...settings.schoolProfile,
        schoolName: formData.schoolName,
        principalName: formData.principalName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        established: formData.established,
        affiliation: formData.affiliation,
        registrationNumber: formData.registrationNumber,
      },
    };
    saveSettings(updatedSettings);
    alert("School profile saved successfully!");
  };

  // Reset form to last saved values
  const handleResetProfile = () => {
    setFormData({
      schoolName: settings.schoolProfile.schoolName || "",
      principalName: settings.schoolProfile.principalName || "",
      email: settings.schoolProfile.email || "",
      phone: settings.schoolProfile.phone || "",
      address: settings.schoolProfile.address || "",
      city: settings.schoolProfile.city || "",
      state: settings.schoolProfile.state || "",
      pincode: settings.schoolProfile.pincode || "",
      established: settings.schoolProfile.established || "",
      affiliation: settings.schoolProfile.affiliation || "",
      registrationNumber: settings.schoolProfile.registrationNumber || "",
    });
  };

  const settingCards = [
    {
      id: "schoolProfile",
      title: "School Profile",
      description: "Update school information",
      icon: Building2,
      gradient: "from-blue-500 to-cyan-500",
      color: "text-blue-600",
    },
    {
      id: "registers",
      title: "Start New Register",
      description: "Create new academic registers",
      icon: BookOpen,
      gradient: "from-green-500 to-emerald-500",
      color: "text-green-600",
    },
    {
      id: "classes",
      title: "Select Classes",
      description: "Manage available classes",
      icon: SettingsIcon,
      gradient: "from-purple-500 to-violet-500",
      color: "text-purple-600",
    },
    {
      id: "subjects",
      title: "Select Subjects",
      description: "Manage available subjects",
      icon: BookOpen,
      gradient: "from-pink-500 to-rose-500",
      color: "text-pink-600",
    },
    {
      id: "paymentGateways",
      title: "Payment Gateways",
      description: "Configure payment options",
      icon: CreditCard,
      gradient: "from-orange-500 to-amber-500",
      color: "text-orange-600",
    },
    {
      id: "feesTypes",
      title: "Fees Types",
      description: "Define fee categories",
      icon: Tag,
      gradient: "from-red-500 to-pink-500",
      color: "text-red-600",
    },
    {
      id: "genie",
      title: "Schoolites Genie",
      description: "AI-powered settings",
      icon: Zap,
      gradient: "from-yellow-500 to-orange-500",
      color: "text-yellow-600",
    },
    {
      id: "mobileTheme",
      title: "Mobile App Theme",
      description: "Customize appearance",
      icon: Smartphone,
      gradient: "from-indigo-500 to-purple-500",
      color: "text-indigo-600",
    },
    {
      id: "dashboard",
      title: "Dashboard Selection",
      description: "Choose layout",
      icon: Grid3x3,
      gradient: "from-teal-500 to-cyan-500",
      color: "text-teal-600",
    },
    {
      id: "biometric",
      title: "Biometric Devices",
      description: "Manage attendance devices",
      icon: Fingerprint,
      gradient: "from-slate-600 to-gray-700",
      color: "text-gray-600",
    },
    {
      id: "documents",
      title: "Document Themes",
      description: "Customize documents",
      icon: FileText,
      gradient: "from-cyan-500 to-blue-500",
      color: "text-cyan-600",
    },
  ];

  // School Profile
  const SchoolProfileSettings = () => <SchoolProfileForm />;

  // Classes Manager
  const ClassesManager = () => {
    const [newClass, setNewClass] = useState("");
    const allClasses = [
      "Toddler B",
      "Toddler C",
      "Toddler D",
      "PlayGroup A",
      "PlayGroup B",
      "PlayGroup C",
      "PlayGroup D",
      "Pre Nursery - A",
      "Pre Nursery - B",
      "Pre Nursery - C",
      "Pre Nursery - D",
      "Nursery - A",
      "Nursery - B",
      "Nursery - C",
      "Nursery - D",
      "Pre Primary (K.G.) - A",
      "Pre Primary (K.G.) - B",
      "Pre Primary (K.G.) - C",
      "Pre Primary (K.G.) - D",
      "LKG - A",
      "LKG - B",
      "LKG - C",
      "LKG - D",
      "UKG - A",
      "UKG - B",
      "UKG - C",
      "UKG - D",
      "Class 1 - A",
      "Class 1 - B",
      "Class 1 - C",
      "Class 1 - D",
      "Class 2 - A",
      "Class 2 - B",
      "Class 2 - C",
      "Class 2 - D",
      "Class 3 - A",
      "Class 3 - B",
      "Class 3 - C",
      "Class 3 - D",
      "Class 4 - A",
      "Class 4 - B",
      "Class 4 - C",
      "Class 4 - D",
      "Class 5 - A",
      "Class 5 - B",
      "Class 5 - C",
      "Class 5 - D",
      "Class 6 - A",
      "Class 6 - B",
      "Class 6 - C",
      "Class 6 - D",
      "Class 7 - A",
      "Class 7 - B",
      "Class 7 - C",
      "Class 7 - D",
      "Class 8 - A",
      "Class 8 - B",
      "Class 8 - C",
      "Class 8 - D",
      "Class 9 - A",
      "Class 9 - B",
      "Class 9 - C",
      "Class 9 - D",
      "Class 10 - A",
      "Class 10 - B",
      "Class 10 - C",
      "Class 10 - D",
      "Class 11 - PCM - A",
      "Class 11 - PCM - B",
      "Class 11 - PCM - C",
      "Class 11 - PCM - D",
      "Class 11 - PCB - A",
      "Class 11 - PCB - B",
      "Class 11 - PCB - C",
      "Class 11 - PCB - D",
      "Class 11 - Commerce - A",
      "Class 11 - Commerce - B",
      "Class 11 - Commerce - C",
      "Class 11 - Commerce - D",
      "Class 11 - Arts - A",
      "Class 11 - Arts - B",
      "Class 11 - Arts - C",
      "Class 11 - Arts - D",
      "Class 12 - PCM - A",
      "Class 12 - PCM - B",
      "Class 12 - PCM - C",
      "Class 12 - PCM - D",
      "Class 12 - PCB - A",
      "Class 12 - PCB - B",
      "Class 12 - PCB - C",
      "Class 12 - PCB - D",
      "Class 12 - Commerce - A",
      "Class 12 - Commerce - B",
      "Class 12 - Commerce - C",
      "Class 12 - Commerce - D",
      "Class 12 - Arts - A",
      "Class 12 - Arts - B",
      "Class 12 - Arts - C",
      "Class 12 - Arts - D",
    ];

    const handleClassToggle = async (cls, isChecked) => {
      let updated = isChecked
        ? [...settings.selectedClasses, cls]
        : settings.selectedClasses.filter((c) => c !== cls);
      
      // Remove duplicates and ensure all have proper section format
      updated = [...new Set(updated)].filter(c => c.includes(" - ") || c.includes(" "));
      
      // Save to localStorage first
      saveSettings({ ...settings, selectedClasses: updated });
      
      // Auto-save to database
      if (updated.length > 0) {
        try {
          await fetch("http://localhost:4000/api/classes/bulk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              classes: updated,
              schoolId: "school-001",
              academicYear: "2025-26"
            })
          });
          
          // Trigger event for Classes module to refresh
          window.dispatchEvent(new CustomEvent("classes-updated", { detail: { classes: updated } }));
        } catch (error) {
          console.error("Error auto-saving classes:", error);
        }
      }
    };

    return (
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Available Classes (Total: {allClasses.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 max-h-96 overflow-y-auto p-4 border border-gray-200 rounded-lg">
            {allClasses.map((cls) => (
              <label
                key={cls}
                className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-purple-50 cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  checked={settings.selectedClasses.includes(cls)}
                  onChange={(e) => handleClassToggle(cls, e.target.checked)}
                  className="w-4 h-4 text-purple-500 rounded"
                />
                <span className="text-sm font-medium">{cls}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-purple-900 font-semibold">
            Selected Classes: {settings.selectedClasses.length}
          </p>
          <p className="text-purple-700 text-sm mt-2">
            {settings.selectedClasses.join(", ") || "No classes selected"}
          </p>
          <p className="text-purple-600 text-xs mt-2 italic">
            ✓ Classes are automatically saved to database
          </p>
        </div>
      </div>
    );
  };

  // Subjects Manager
  const SubjectsManager = () => {
    const [newSubject, setNewSubject] = useState("");
    const allSubjects = [
      "English",
      "Hindi",
      "Mathematics",
      "Science",
      "Social Studies",
      "Physical Education",
      "Art",
      "Music",
      "Computer Science",
      "Chemistry",
      "Physics",
      "Biology",
      "History",
      "Geography",
      "Economics",
    ];

    return (
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Available Subjects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {allSubjects.map((subject) => (
              <label
                key={subject}
                className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-pink-50 cursor-pointer transition"
              >
                <input
                  type="checkbox"
                  checked={settings.selectedSubjects.includes(subject)}
                  onChange={(e) => {
                    const updated = e.target.checked
                      ? [...settings.selectedSubjects, subject]
                      : settings.selectedSubjects.filter((s) => s !== subject);
                    saveSettings({ ...settings, selectedSubjects: updated });
                  }}
                  className="w-4 h-4 text-pink-500 rounded"
                />
                <span className="text-sm font-medium">{subject}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="bg-pink-50 p-4 rounded-lg">
          <p className="text-pink-900 font-semibold">
            Selected Subjects: {settings.selectedSubjects.length}
          </p>
          <p className="text-pink-700 text-sm mt-2">
            {settings.selectedSubjects.join(", ")}
          </p>
        </div>
      </div>
    );
  };

  // Fees Types Manager
  const FeesTypesManager = () => {
    const [newFeeType, setNewFeeType] = useState("");

    return (
      <div>
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter fee type (e.g., Tuition, Transport, Sports)"
              value={newFeeType}
              onChange={(e) => setNewFeeType(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              onClick={() => {
                if (newFeeType) {
                  saveSettings({
                    ...settings,
                    feesTypes: [...settings.feesTypes, newFeeType],
                  });
                  setNewFeeType("");
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {settings.feesTypes.map((feeType) => (
            <div
              key={feeType}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <span className="font-medium text-gray-800">{feeType}</span>
              <button
                onClick={() => {
                  saveSettings({
                    ...settings,
                    feesTypes: settings.feesTypes.filter((f) => f !== feeType),
                  });
                }}
                className="text-red-500 hover:text-red-700 transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {settings.feesTypes.length === 0 && (
          <p className="text-gray-500 text-center py-8">No fee types added</p>
        )}
      </div>
    );
  };

  // Payment Gateways
  const PaymentGatewaysSettings = () => {
    const gateways = ["Stripe", "PayPal", "Razorpay", "Square", "Paytm"];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gateways.map((gateway) => (
          <div
            key={gateway}
            className="p-4 border border-gray-300 rounded-lg hover:shadow-lg transition"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{gateway}</h3>
              <input type="checkbox" className="w-4 h-4 text-orange-500" />
            </div>
            <input
              type="text"
              placeholder={`${gateway} API Key`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="text"
              placeholder={`${gateway} Secret`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        ))}
      </div>
    );
  };

  // Mobile Theme
  const MobileThemeSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Primary Color
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={settings.mobileTheme.primaryColor}
            onChange={(e) =>
              saveSettings({
                ...settings,
                mobileTheme: { ...settings.mobileTheme, primaryColor: e.target.value },
              })
            }
            className="w-16 h-16 rounded-lg cursor-pointer"
          />
          <input
            type="text"
            value={settings.mobileTheme.primaryColor}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Secondary Color
        </label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={settings.mobileTheme.secondaryColor}
            onChange={(e) =>
              saveSettings({
                ...settings,
                mobileTheme: { ...settings.mobileTheme, secondaryColor: e.target.value },
              })
            }
            className="w-16 h-16 rounded-lg cursor-pointer"
          />
          <input
            type="text"
            value={settings.mobileTheme.secondaryColor}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Font Family
        </label>
        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option>Inter</option>
          <option>Roboto</option>
          <option>Poppins</option>
          <option>Playfair Display</option>
        </select>
      </div>

      <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-indigo-50 transition">
        <input
          type="checkbox"
          checked={settings.mobileTheme.darkMode}
          onChange={(e) =>
            saveSettings({
              ...settings,
              mobileTheme: { ...settings.mobileTheme, darkMode: e.target.checked },
            })
          }
          className="w-4 h-4 text-indigo-500"
        />
        <span className="font-semibold">Enable Dark Mode</span>
      </label>
    </div>
  );

  // Dashboard Selection
  const DashboardSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Dashboard Layout
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {["grid", "list", "cards", "minimal"].map((layout) => (
            <label
              key={layout}
              className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                settings.dashboard.layout === layout
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-300 hover:border-teal-300"
              }`}
            >
              <input
                type="radio"
                name="layout"
                value={layout}
                checked={settings.dashboard.layout === layout}
                onChange={(e) =>
                  saveSettings({
                    ...settings,
                    dashboard: { ...settings.dashboard, layout: e.target.value },
                  })
                }
                className="w-4 h-4 text-teal-500"
              />
              <span className="ml-3 font-semibold capitalize">{layout} View</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Default Module
        </label>
        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
          <option>Dashboard</option>
          <option>Students</option>
          <option>Fees</option>
          <option>Transport</option>
          <option>Academics</option>
        </select>
      </div>

      <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-teal-50 transition">
        <input
          type="checkbox"
          checked={settings.dashboard.enableWidgets}
          onChange={(e) =>
            saveSettings({
              ...settings,
              dashboard: { ...settings.dashboard, enableWidgets: e.target.checked },
            })
          }
          className="w-4 h-4 text-teal-500"
        />
        <span className="font-semibold">Enable Dashboard Widgets</span>
      </label>
    </div>
  );

  // Biometric Devices
  const BiometricDevicesSettings = () => {
    const [newDevice, setNewDevice] = useState("");

    return (
      <div>
        <div className="mb-6">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Device Name (e.g., Main Gate, Office)"
              value={newDevice}
              onChange={(e) => setNewDevice(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            <button
              onClick={() => {
                if (newDevice) {
                  saveSettings({
                    ...settings,
                    biometricDevices: [
                      ...settings.biometricDevices,
                      { id: Date.now(), name: newDevice, status: "Active" },
                    ],
                  });
                  setNewDevice("");
                }
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {settings.biometricDevices.map((device) => (
            <div
              key={device.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div>
                <p className="font-semibold text-gray-800">{device.name}</p>
                <p className="text-sm text-green-600">● {device.status}</p>
              </div>
              <button
                onClick={() => {
                  saveSettings({
                    ...settings,
                    biometricDevices: settings.biometricDevices.filter(
                      (d) => d.id !== device.id
                    ),
                  });
                }}
                className="text-red-500 hover:text-red-700 transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {settings.biometricDevices.length === 0 && (
          <p className="text-gray-500 text-center py-8">No devices added</p>
        )}
      </div>
    );
  };

  // Document Themes
  const DocumentThemesSettings = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {["tc", "invoice", "result"].map((docType) => (
        <div key={docType} className="p-4 border border-gray-300 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3 capitalize">
            {docType === "tc" ? "Transfer Certificate" : docType.charAt(0).toUpperCase() + docType.slice(1)}
          </h3>
          <select
            value={settings.documentThemes[docType]}
            onChange={(e) =>
              saveSettings({
                ...settings,
                documentThemes: { ...settings.documentThemes, [docType]: e.target.value },
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="default">Default</option>
            <option value="modern">Modern</option>
            <option value="classic">Classic</option>
            <option value="elegant">Elegant</option>
            <option value="minimal">Minimal</option>
          </select>
        </div>
      ))}
    </div>
  );

  // Genie Settings
  const GenieSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Genie API Key
        </label>
        <input
          type="password"
          placeholder="Enter your Schoolites Genie API key"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>

      <label className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-yellow-50 transition">
        <input
          type="checkbox"
          checked={settings.genieSettings.enabled}
          onChange={(e) =>
            saveSettings({
              ...settings,
              genieSettings: { ...settings.genieSettings, enabled: e.target.checked },
            })
          }
          className="w-4 h-4 text-yellow-500"
        />
        <span className="font-semibold">Enable Genie AI Assistant</span>
      </label>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Available Features</h3>
        <div className="space-y-2">
          {["Student Analytics", "Attendance Prediction", "Grade Optimization", "Parent Notifications"].map(
            (feature) => (
              <label key={feature} className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-yellow-50 transition">
                <input type="checkbox" className="w-4 h-4 text-yellow-500" />
                <span className="font-medium">{feature}</span>
              </label>
            )
          )}
        </div>
      </div>
    </div>
  );

  // Registers Manager
  const RegistersManager = () => {
    const [newRegister, setNewRegister] = useState("");

    return (
      <div>
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Register Name (e.g., 2025-2026, Session A)"
              value={newRegister}
              onChange={(e) => setNewRegister(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={() => {
                if (newRegister) {
                  saveSettings({
                    ...settings,
                    registers: [
                      ...settings.registers,
                      { id: Date.now(), name: newRegister, status: "Active" },
                    ],
                  });
                  setNewRegister("");
                }
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {settings.registers.map((register) => (
            <div
              key={register.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div>
                <p className="font-semibold text-gray-800">{register.name}</p>
                <p className="text-sm text-green-600">● {register.status}</p>
              </div>
              <button
                onClick={() => {
                  saveSettings({
                    ...settings,
                    registers: settings.registers.filter((r) => r.id !== register.id),
                  });
                }}
                className="text-red-500 hover:text-red-700 transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {settings.registers.length === 0 && (
          <p className="text-gray-500 text-center py-8">No registers created</p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
              <SettingsIcon className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">School Settings</h1>
              <p className="text-gray-600">Manage all school configurations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      {!activeTab && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {settingCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => setActiveTab(card.id)}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 transform hover:scale-105 h-48"
              >
                {/* Card Background Gradient */}
                <div
                  className={`h-24 bg-gradient-to-br ${card.gradient} group-hover:opacity-90 transition`}
                ></div>

                {/* Card Content */}
                <div className="p-4 -mt-12 relative z-10">
                  <div className="bg-white rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-3 shadow-md group-hover:shadow-lg transition">
                    <Icon className={card.color} size={24} />
                  </div>
                  <h3 className="text-gray-900 font-bold text-sm leading-tight mb-1">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 text-xs mb-3">{card.description}</p>
                  <div className="flex items-center gap-1 text-indigo-600 font-semibold text-xs group-hover:translate-x-1 transition">
                    Open <ChevronRight size={14} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Settings Panel */}
      {activeTab && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {settingCards.find((c) => c.id === activeTab)?.title}
            </h2>
            <button
              onClick={() => setActiveTab(null)}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <X size={24} />
            </button>
          </div>

          <div className="border-t pt-6">
            {activeTab === "schoolProfile" && <SchoolProfileSettings />}
            {activeTab === "registers" && <RegistersManager />}
            {activeTab === "classes" && <ClassesManager />}
            {activeTab === "subjects" && <SubjectsManager />}
            {activeTab === "paymentGateways" && <PaymentGatewaysSettings />}
            {activeTab === "feesTypes" && <FeesTypesManager />}
            {activeTab === "genie" && <GenieSettings />}
            {activeTab === "mobileTheme" && <MobileThemeSettings />}
            {activeTab === "dashboard" && <DashboardSettings />}
            {activeTab === "biometric" && <BiometricDevicesSettings />}
            {activeTab === "documents" && <DocumentThemesSettings />}
          </div>
        </div>
      )}
    </div>
  );
}
