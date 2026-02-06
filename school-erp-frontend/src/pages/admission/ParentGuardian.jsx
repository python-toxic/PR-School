import { useState, useMemo, useEffect } from "react";
import { Search, Download, UserPlus, Trash2, AlertCircle, MessageSquare, Eye, X, Send, Phone, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext.jsx";

const ITEMS_PER_PAGE = 19;

export default function ParentGuardianPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [removedParents, setRemovedParents] = useState([]);
  const [activeTab, setActiveTab] = useState("current");
  const [selectedParent, setSelectedParent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageChannel, setMessageChannel] = useState("system"); // system, sms, whatsapp
  const [parentData, setParentData] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = ["ADMIN", "SUPER-ADMIN"].includes(user?.role?.toUpperCase());

  // Fetch parents from database and localStorage
  useEffect(() => {
    const fetchParents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:4000/api/parents', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          const backendParents = (data && (data.data?.parents || data.parents)) || [];
          
          // Also load parents saved from admissions
          let admissionParents = [];
          try {
            const saved = localStorage.getItem('admissions-parents');
            if (saved) {
              admissionParents = JSON.parse(saved);
            }
          } catch (e) {
            console.error('Error loading admission parents:', e);
          }
          
          // Combine backend and admission parents
          const combined = [...backendParents, ...admissionParents];
          setParentData(combined);
        }
      } catch (error) {
        console.error('Failed to fetch parents:', error);
        // Fallback to localStorage admission parents
        try {
          const saved = localStorage.getItem('admissions-parents');
          if (saved) {
            setParentData(JSON.parse(saved));
          }
        } catch {}
      } finally {
        setLoading(false);
      }
    };

    fetchParents();
  }, []);

  // Load removed parents from localStorage
  useEffect(() => {
    const removed = JSON.parse(localStorage.getItem("removedParents") || "[]");
    setRemovedParents(removed);
  }, []);

  // Update parent data with status
  const allParents = useMemo(() => {
    return parentData.map(parent => ({
      ...parent,
      status: removedParents.some(r => r.id === parent.id) ? 'former' : 'active'
    }));
  }, [parentData, removedParents]);

  // Filter parents based on search and tab
  const filteredParents = useMemo(() => {
    const tabFilter = activeTab === 'current' 
      ? p => p.status === 'active'
      : p => p.status === 'former';

    return allParents.filter(parent => {
      const matchesTab = tabFilter(parent);
      
      if (!searchQuery) return matchesTab;

      const query = searchQuery.toLowerCase();
      let matchesSearch = false;

      const name = (parent.name || '').toLowerCase();
      const username = (parent.username || '').toLowerCase();
      const studentName = (parent.studentName || '').toLowerCase();
      const phone = (parent.phone || parent.mobile || '');

      if (searchType === "all") {
        matchesSearch = 
          name.includes(query) ||
          username.includes(query) ||
          studentName.includes(query) ||
          phone.includes(query);
      } else if (searchType === "fullName") {
        matchesSearch = name.includes(query);
      } else if (searchType === "username") {
        matchesSearch = username.includes(query);
      } else if (searchType === "studentName") {
        matchesSearch = studentName.includes(query);
      }

      return matchesSearch && matchesTab;
    });
  }, [allParents, searchQuery, searchType, activeTab]);

  // Pagination
  const totalPages = Math.ceil(filteredParents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedParents = filteredParents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleViewParent = (parent) => {
    setSelectedParent(parent);
    setShowDetailModal(true);
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedParent) return;

    // Save message to localStorage
    const messages = JSON.parse(localStorage.getItem("parent-messages") || "[]");
    messages.push({
      id: `msg-${Date.now()}`,
      parentId: selectedParent.id,
      parentName: selectedParent.name,
      message: messageText,
      timestamp: new Date().toLocaleString(),
      read: false,
      isFromSchool: true,
    });
    localStorage.setItem("parent-messages", JSON.stringify(messages));

    // Show success message and reset
    alert(`Message sent to ${selectedParent.name}`);
    setMessageText("");
    setShowMessageModal(false);
  };

  const handleOpenMessageModal = (parent) => {
    setSelectedParent(parent);
    setShowMessageModal(true);
    setMessageText("");
    setMessageChannel("system");
  };

  const handleSendSMS = () => {
    if (!messageText.trim() || !selectedParent) return;

    // Format phone number for SMS
    const phoneNumber = selectedParent.phone.replace(/\D/g, "");
    const smsLink = `sms:${phoneNumber}?body=${encodeURIComponent(messageText)}`;
    window.location.href = smsLink;

    // Save record
    const messages = JSON.parse(localStorage.getItem("parent-messages") || "[]");
    messages.push({
      id: `sms-${Date.now()}`,
      parentId: selectedParent.id,
      parentName: selectedParent.name,
      message: messageText,
      channel: "SMS",
      phone: selectedParent.phone,
      timestamp: new Date().toLocaleString(),
      isFromSchool: true,
    });
    localStorage.setItem("parent-messages", JSON.stringify(messages));

    alert(`SMS prepared for ${selectedParent.name}`);
    setMessageText("");
    setShowMessageModal(false);
  };

  const handleSendWhatsApp = () => {
    if (!messageText.trim() || !selectedParent) return;

    // Format phone number for WhatsApp (remove +, keep digits only, add country code if needed)
    let phoneNumber = selectedParent.phone.replace(/\D/g, "");
    if (!phoneNumber.startsWith("91")) {
      phoneNumber = "91" + phoneNumber;
    }

    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(messageText)}`;
    window.open(whatsappLink, "_blank");

    // Save record
    const messages = JSON.parse(localStorage.getItem("parent-messages") || "[]");
    messages.push({
      id: `whatsapp-${Date.now()}`,
      parentId: selectedParent.id,
      parentName: selectedParent.name,
      message: messageText,
      channel: "WhatsApp",
      phone: selectedParent.phone,
      timestamp: new Date().toLocaleString(),
      isFromSchool: true,
    });
    localStorage.setItem("parent-messages", JSON.stringify(messages));

    alert(`WhatsApp message prepared for ${selectedParent.name}`);
    setMessageText("");
    setShowMessageModal(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Parent/Guardian Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filteredParents.length} {activeTab === 'current' ? 'current' : 'past'} parents found
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => { setActiveTab("current"); setCurrentPage(1); }}
            className={`flex-1 px-6 py-4 font-medium transition ${
              activeTab === "current"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Current Parents
            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {allParents.filter(p => p.status === 'active').length}
            </span>
          </button>
          <button
            onClick={() => { setActiveTab("former"); setCurrentPage(1); }}
            className={`flex-1 px-6 py-4 font-medium transition ${
              activeTab === "former"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Past Parents
            <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
              {removedParents.length}
            </span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Type</label>
            <select
              value={searchType}
              onChange={(e) => {
                setSearchType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Fields</option>
              <option value="fullName">Full Name</option>
              <option value="username">Username</option>
              <option value="studentName">Student Name</option>
            </select>
          </div>

          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={`Search by ${
                searchType === "all" ? "name, username, student name, or phone..." :
                searchType === "fullName" ? "parent full name..." :
                searchType === "username" ? "parent username..." :
                "student name..."
              }`}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredParents.length)} Of {filteredParents.length}
      </div>

      {/* Content */}
      {activeTab === 'current' ? (
        // Current Parents List
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {paginatedParents.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">No parents found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avatar</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Relation</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedParents.map((parent) => {
                      const initials = parent.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase();
                      
                      return (
                        <tr key={parent.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
                              {initials}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="font-medium text-gray-900">{parent.name}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{parent.username || 'N/A'}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            <button 
                              onClick={() => {
                                setSelectedParent(parent);
                                setShowDetailModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                            >
                              {parent.studentName || 'View'}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">{parent.relation || 'N/A'}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{parent.phone || parent.mobile}</td>
                          <td className="px-6 py-4 text-sm space-x-2">
                            <button 
                              onClick={() => handleViewParent(parent)}
                              className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1">
                              <Eye size={14} />
                              View
                            </button>
                            <button 
                              onClick={() => handleOpenMessageModal(parent)}
                              className="text-gray-600 hover:text-gray-800 font-medium inline-flex items-center gap-1">
                              <MessageSquare size={14} />
                              Message
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => navigate(`/parent-guardian/remove?parentId=${parent.id}`)}
                                className="ml-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition font-medium inline-flex items-center gap-1"
                              >
                                <Trash2 size={14} />
                                Remove
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages || 1}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-3 py-1 rounded ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        // Past Parents List
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-3">
            <h2 className="text-lg font-semibold text-white">
              Past Parents • {filteredParents.length} Records
            </h2>
          </div>

          {paginatedParents.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600">No past parents found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parent Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Removed Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedParents.map((parent) => {
                      const removedRecord = removedParents.find(r => r.id === parent.id);
                      return (
                        <tr key={parent.id} className="hover:bg-red-50 transition border-l-4 border-l-red-500">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{parent.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{parent.username}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{parent.studentName}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{removedRecord?.removedDate}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{removedRecord?.reason}</td>
                          <td className="px-6 py-4 text-sm">
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">View Only</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination for Past Parents */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages || 1}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-3 py-1 rounded ${
                        currentPage === i + 1
                          ? "bg-blue-600 text-white"
                          : "border border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* View Parent Detail Modal */}
      {showDetailModal && selectedParent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Parent Details</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Header with Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-xl">
                  {selectedParent.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedParent.name}</h2>
                  <p className="text-gray-600">@{selectedParent.username}</p>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-500 font-medium">Full Name</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{selectedParent.name}</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-500 font-medium">Username</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{selectedParent.username}</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-500 font-medium">Relation</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{selectedParent.relation}</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-500 font-medium">Phone</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{selectedParent.phone}</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-500 font-medium">Email</p>
                  <p className="text-lg font-semibold text-gray-900 mt-1">{selectedParent.email}</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-500 font-medium">Status</p>
                  <p className="text-lg font-semibold text-green-600 mt-1">Active</p>
                </div>
              </div>

              {/* Child Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-600 font-medium uppercase">Child Information</p>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-xs text-blue-600">Student Name</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedParent.studentName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-blue-600">Class</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedParent.childClass}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleOpenMessageModal(selectedParent);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <MessageSquare size={18} />
                  Send Message
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && selectedParent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Send Message</h3>
              <button
                onClick={() => setShowMessageModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500">To:</p>
              <p className="font-semibold text-gray-900">{selectedParent.name}</p>
              <p className="text-xs text-gray-600">{selectedParent.email}</p>
              <p className="text-xs text-gray-600">{selectedParent.phone}</p>
            </div>

            {/* Channel Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">Select Channel</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setMessageChannel("system")}
                  className={`p-3 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                    messageChannel === "system"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <MessageSquare size={18} className={messageChannel === "system" ? "text-blue-600" : "text-gray-600"} />
                  <span className="text-xs font-medium">Portal Message</span>
                </button>
                <button
                  onClick={() => setMessageChannel("sms")}
                  className={`p-3 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                    messageChannel === "sms"
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Phone size={18} className={messageChannel === "sms" ? "text-green-600" : "text-gray-600"} />
                  <span className="text-xs font-medium">SMS</span>
                </button>
                <button
                  onClick={() => setMessageChannel("whatsapp")}
                  className={`p-3 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                    messageChannel === "whatsapp"
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <MessageCircle size={18} className={messageChannel === "whatsapp" ? "text-emerald-600" : "text-gray-600"} />
                  <span className="text-xs font-medium">WhatsApp</span>
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={5}
              />
              <p className="text-xs text-gray-500 mt-2">{messageText.length} characters</p>
            </div>

            {/* Channel Info */}
            <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
              {messageChannel === "system" && (
                <p className="text-sm text-blue-700">
                  📧 Message will be saved in the portal and parent can view it in their messages section.
                </p>
              )}
              {messageChannel === "sms" && (
                <p className="text-sm text-green-700">
                  📱 SMS will be sent to {selectedParent.phone}. Make sure your device has SMS capability.
                </p>
              )}
              {messageChannel === "whatsapp" && (
                <p className="text-sm text-emerald-700">
                  💬 WhatsApp message will be sent to {selectedParent.phone}. Parent must have WhatsApp installed.
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowMessageModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              {messageChannel === "system" && (
                <button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium inline-flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  Send
                </button>
              )}
              {messageChannel === "sms" && (
                <button
                  onClick={handleSendSMS}
                  disabled={!messageText.trim()}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium inline-flex items-center justify-center gap-2"
                >
                  <Phone size={16} />
                  Send SMS
                </button>
              )}
              {messageChannel === "whatsapp" && (
                <button
                  onClick={handleSendWhatsApp}
                  disabled={!messageText.trim()}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium inline-flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} />
                  Send via WhatsApp
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
