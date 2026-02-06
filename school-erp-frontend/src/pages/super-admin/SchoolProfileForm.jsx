import React, { useState, useEffect, useCallback } from "react";
import { Building2, BookOpen, Upload } from "lucide-react";

export default function SchoolProfileForm() {
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
    logo: "",
  });

  const [saved, setSaved] = useState(false);

  const getExistingSettings = useCallback(() => {
    const settings = localStorage.getItem("school-settings");
    let existingSettings = {
      schoolProfile: {},
      registers: [],
      selectedClasses: [],
      selectedSubjects: [],
      paymentGateways: [],
      feesTypes: [],
      genieSettings: { apiKey: "", enabled: false, features: [] },
      mobileTheme: { primaryColor: "#8B5CF6", secondaryColor: "#EC4899", fontFamily: "Inter", darkMode: false },
      dashboard: { layout: "grid", defaultModule: "dashboard", enableWidgets: true },
      biometricDevices: [],
      documentThemes: { tc: "default", invoice: "default", result: "default" },
    };

    if (settings) {
      try {
        existingSettings = JSON.parse(settings);
      } catch (e) {
        console.error("Error parsing settings:", e);
      }
    }
    return existingSettings;
  }, []);

  const persistSchoolProfile = useCallback(
    (profile) => {
      const existingSettings = getExistingSettings();
      const updatedSettings = {
        ...existingSettings,
        schoolProfile: {
          ...existingSettings.schoolProfile,
          ...profile,
        },
      };
      localStorage.setItem("school-settings", JSON.stringify(updatedSettings));
      
      // Dispatch custom event to notify TopNavbar in same tab
      window.dispatchEvent(new Event("school-settings-updated"));
    },
    [getExistingSettings]
  );

  // Load from localStorage on mount only
  useEffect(() => {
    const saved = localStorage.getItem("school-settings");
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        setFormData({
          schoolName: settings.schoolProfile?.schoolName || "",
          principalName: settings.schoolProfile?.principalName || "",
          email: settings.schoolProfile?.email || "",
          phone: settings.schoolProfile?.phone || "",
          address: settings.schoolProfile?.address || "",
          city: settings.schoolProfile?.city || "",
          state: settings.schoolProfile?.state || "",
          pincode: settings.schoolProfile?.pincode || "",
          established: settings.schoolProfile?.established || "",
          affiliation: settings.schoolProfile?.affiliation || "",
          registrationNumber: settings.schoolProfile?.registrationNumber || "",
          logo: settings.schoolProfile?.logo || "",
        });
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }
  }, []);

  // Use useCallback to prevent function from being recreated on every render
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSaveProfile = useCallback(() => {
    persistSchoolProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [formData, persistSchoolProfile]);

  const handleResetProfile = useCallback(() => {
    const saved = localStorage.getItem("school-settings");
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        setFormData({
          schoolName: settings.schoolProfile?.schoolName || "",
          principalName: settings.schoolProfile?.principalName || "",
          email: settings.schoolProfile?.email || "",
          phone: settings.schoolProfile?.phone || "",
          address: settings.schoolProfile?.address || "",
          city: settings.schoolProfile?.city || "",
          state: settings.schoolProfile?.state || "",
          pincode: settings.schoolProfile?.pincode || "",
          established: settings.schoolProfile?.established || "",
          affiliation: settings.schoolProfile?.affiliation || "",
          registrationNumber: settings.schoolProfile?.registrationNumber || "",
          logo: settings.schoolProfile?.logo || "",
        });
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }
  }, []);

  const handleLogoChange = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (file.size > 10 * 1024 * 1024) {
        // Limit to 10MB to avoid huge localStorage payloads
        alert("Please choose an image under 10MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const logoData = reader.result;
        setFormData((prev) => {
          const updatedProfile = { ...prev, logo: logoData };
          persistSchoolProfile(updatedProfile); // keep header/logo in sync immediately
          return updatedProfile;
        });
      };
      reader.readAsDataURL(file);
    },
    [persistSchoolProfile]
  );

  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 size={20} className="text-blue-600" />
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="schoolName"
              placeholder="Enter school name"
              value={formData.schoolName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Principal Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="principalName"
              placeholder="Enter principal name"
              value={formData.principalName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 size={20} className="text-green-600" />
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              autoComplete="off"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              name="address"
              placeholder="Enter complete address"
              value={formData.address}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      {/* Location Details */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 size={20} className="text-purple-600" />
          Location Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              name="city"
              placeholder="Enter city name"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <input
              type="text"
              name="state"
              placeholder="Enter state name"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pincode
            </label>
            <input
              type="text"
              name="pincode"
              placeholder="Enter pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      {/* School Registration */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen size={20} className="text-orange-600" />
          School Registration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Established Year
            </label>
            <input
              type="text"
              name="established"
              placeholder="e.g., 1995"
              value={formData.established}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Affiliation
            </label>
            <input
              type="text"
              name="affiliation"
              placeholder="e.g., CBSE, ICSE"
              value={formData.affiliation}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              autoComplete="off"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration Number
            </label>
            <input
              type="text"
              name="registrationNumber"
              placeholder="Enter registration number"
              value={formData.registrationNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      {/* Logo Upload */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Upload size={20} className="text-pink-600" />
          School Logo
        </h3>
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:bg-blue-50 transition group">
          <label className="flex flex-col items-center justify-center gap-4 cursor-pointer w-full">
            {formData.logo ? (
              <img
                src={formData.logo}
                alt="School logo preview"
                className="h-20 w-20 rounded-full object-cover border border-blue-200 shadow-sm"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-semibold border border-blue-200 shadow-sm">
                {formData.schoolName?.[0]?.toUpperCase() || "S"}
              </div>
            )}
            <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition">
              <Upload size={28} className="text-blue-600" />
            </div>
            <div>
              <p className="text-blue-600 font-semibold">Upload School Logo</p>
              <p className="text-gray-500 text-sm mt-1">PNG, JPG, GIF up to 10MB</p>
              <p className="text-gray-400 text-xs">Updates header instantly after selection</p>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 border-t border-gray-200">
        <button
          onClick={handleSaveProfile}
          className={`flex-1 py-3 rounded-lg font-semibold transition shadow-md ${
            saved
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg"
          }`}
        >
          {saved ? "✓ Saved Successfully!" : "Save Profile Changes"}
        </button>
        <button
          onClick={handleResetProfile}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition"
        >
          Clear Form
        </button>
      </div>
    </div>
  );
}
