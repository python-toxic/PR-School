import { useUser } from "../../context/UserContext";
import { Calendar, Mail, User, MapPin, Shield, Lock, Edit2, Save, X, Camera, Upload } from "lucide-react";
import { useState } from "react";

export default function Profile() {
  const { user, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);

  if (!user) return null;

  const userRole = user.role?.toUpperCase() || "USER";
  const isPrivateRole = ["ADMIN", "SUPER_ADMIN"].includes(userRole);

  // Mock data - in production this would come from API
  const initialData = {
    fullName: user.name || "Saurabh",
    username: user.username || "admin_saurabh",
    email: user.email || "Saurabh@schoolites.com",
    role: user.role || "Admin",
    joinedDate: "Nov 25, 2025",
    dateOfBirth: "(not set)",
    gender: "--",
    currentAddress: "--",
    permanentAddress: "--",
    profession: userRole === "ADMIN" || userRole === "SUPER_ADMIN" ? "Admin" : userRole === "TEACHER" ? "Teacher" : userRole === "STUDENT" ? "Student" : "Parent"
  };

  const [profileData, setProfileData] = useState(initialData);
  const [editData, setEditData] = useState(initialData);

  const handleEdit = () => {
    setEditData(profileData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleSave = () => {
    // In production, this would make an API call to update the profile
    setProfileData(editData);

    // Persist to user context/localStorage for header/avatar
    updateUser({
      name: editData.fullName,
      email: editData.email,
      role: editData.role,
      profileImage: profilePicturePreview || user?.profileImage || null,
    });

    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
        // Auto-persist to user context/localStorage so header updates immediately
        updateUser({ profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    setProfilePicturePreview(null);
    updateUser({ profileImage: null });
  };

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-32"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-16">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                {profilePicturePreview || user?.profileImage ? (
                  <img 
                    src={profilePicturePreview || user?.profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-4xl font-bold">
                    {getInitials(profileData.fullName)}
                  </span>
                )}
              </div>
              
              {/* Camera overlay button - Only visible in edit mode */}
              {isEditing && (
                <>
                  <label 
                    htmlFor="profile-picture-upload" 
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera size={32} className="text-white" />
                    <input
                      id="profile-picture-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                  </label>

                  {/* Remove picture button */}
                  {profilePicturePreview && (
                    <button
                      onClick={handleRemoveProfilePicture}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition shadow-lg"
                      title="Remove picture"
                    >
                      <X size={16} />
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Name and Role */}
            <div className="flex-1 md:mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {profileData.fullName}
              </h1>
              <p className="text-gray-600 text-lg">
                Profession: <span className="font-medium">{profileData.profession}</span>
              </p>
            </div>

            {/* Edit/Save Buttons */}
            <div className="md:mb-4 flex gap-2">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                  >
                    <Save size={18} />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </>
              )}
            </div>

            {/* Role Badge */}
            <div className="md:mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                <Shield size={18} />
                <span className="font-semibold">{profileData.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Profile</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Joined Date */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Calendar size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Joined</p>
              <p className="text-base font-semibold text-gray-900">{profileData.joinedDate}</p>
            </div>
          </div>

          {/* Username */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <User size={20} className="text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Username</p>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="mt-1 w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                />
              ) : (
                <p className="text-base font-semibold text-gray-900">{profileData.username}</p>
              )}
            </div>
          </div>

          {/* Real Name */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <User size={20} className="text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Real name</p>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="mt-1 w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
                />
              ) : (
                <p className="text-base font-semibold text-gray-900">{profileData.fullName}</p>
              )}
            </div>
          </div>

          {/* Access Type */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Shield size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Access Type:</p>
              <p className="text-base font-semibold text-gray-900">{profileData.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
          <span className="text-sm text-gray-500">( Private )</span>
        </div>

        <div className="space-y-4">
          {/* Email - NOT EDITABLE */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Email</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-900 font-semibold">{profileData.email}</span>
              <Lock size={14} className="text-gray-400" title="Email cannot be edited" />
            </div>
          </div>

          {/* Username (LoginId) */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <User size={18} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Username ( LoginId )</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
              />
            ) : (
              <span className="text-sm text-gray-900 font-semibold">{profileData.username}</span>
            )}
          </div>

          {/* Full Name */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <User size={18} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Full Name</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold"
              />
            ) : (
              <span className="text-sm text-gray-900 font-semibold">{profileData.fullName}</span>
            )}
          </div>

          {/* Date of Birth */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Date of Birth</span>
            </div>
            {isEditing ? (
              <input
                type="date"
                value={editData.dateOfBirth === "(not set)" ? "" : editData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            ) : (
              <span className="text-sm text-gray-500">{profileData.dateOfBirth}</span>
            )}
          </div>

          {/* Gender */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <User size={18} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Gender</span>
            </div>
            {isEditing ? (
              <select
                value={editData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="--">--</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <span className="text-sm text-gray-500">{profileData.gender}</span>
            )}
          </div>

          {/* Current Address */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Current Address</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editData.currentAddress}
                onChange={(e) => handleInputChange('currentAddress', e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64"
                placeholder="Enter current address"
              />
            ) : (
              <span className="text-sm text-gray-500">{profileData.currentAddress}</span>
            )}
          </div>

          {/* Permanent Address */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Permanent Address</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={editData.permanentAddress}
                onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-64"
                placeholder="Enter permanent address"
              />
            ) : (
              <span className="text-sm text-gray-500">{profileData.permanentAddress}</span>
            )}
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      {isPrivateRole && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <Lock size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-900 text-lg mb-1">
                {profileData.role} Profile is Private
              </h3>
              <p className="text-amber-800 text-sm">
                This profile contains sensitive information
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-6">
        <p className="text-sm text-gray-500">
          Copyright © 2017 - 2026 Schoolites
        </p>
      </div>
    </div>
  );
}
