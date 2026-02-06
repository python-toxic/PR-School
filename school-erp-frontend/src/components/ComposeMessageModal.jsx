import { useState, useEffect, useMemo } from "react";
import { useUser } from "../context/UserContext";
import { useNotifications } from "../context/NotificationContext";
import { X, Send, ChevronDown } from "lucide-react";

// Sample recipient lists
const teachers = [
  { id: "t1", name: "Ms. Priya Sharma", subject: "Mathematics" },
  { id: "t2", name: "Mr. Vikram Singh", subject: "Science" },
  { id: "t3", name: "Ms. Anjali Patel", subject: "English" },
];

const parents = [];

const admins = [
  { id: "a1", name: "Principal Office" },
  { id: "a2", name: "Finance Department" },
  { id: "a3", name: "Admin Staff" },
];

const inputCls = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm";

export default function ComposeMessageModal({ isOpen, onClose, onSendMessage }) {
  const { user } = useUser();
  const { addNotification } = useNotifications();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
  });
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);

  // Load classes and students from localStorage
  useEffect(() => {
    const savedClasses = localStorage.getItem("classes-list");
    if (savedClasses) {
      const parsedClasses = JSON.parse(savedClasses);
      setClasses(parsedClasses);
    }

    const savedStudents = localStorage.getItem("admitted-students");
    if (savedStudents) {
      const parsedStudents = JSON.parse(savedStudents);
      // Transform students to include class info
      const transformedStudents = parsedStudents.map((student) => ({
        id: student.rollNo || student.id,
        name: `${student.firstName} ${student.lastName}`,
        class: student.class,
      }));
      setStudents(transformedStudents);
    }
  }, []);

  // Get class options for dropdown
  const classOptions = useMemo(() => {
    return classes.map(c => `${c.name} - ${c.section}`);
  }, [classes]);

  // Get recipients based on selected categories
  const recipients = useMemo(() => {
    let allRecipients = [];
    
    selectedCategories.forEach((category) => {
      switch (category) {
        case "teachers":
          allRecipients = [...allRecipients, ...teachers.map(t => ({ ...t, category: "teachers" }))];
          break;
        case "parents":
          allRecipients = [...allRecipients, ...parents.map(p => ({ ...p, category: "parents" }))];
          break;
        case "admins":
          allRecipients = [...allRecipients, ...admins.map(a => ({ ...a, category: "admins" }))];
          break;
        case "students":
          const studentList = selectedClass
            ? students.filter((s) => s.class === selectedClass)
            : students;
          allRecipients = [...allRecipients, ...studentList.map(s => ({ ...s, category: "students" }))];
          break;
        default:
          break;
      }
    });
    
    return allRecipients;
  }, [selectedCategories, selectedClass, students]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      const isSelected = prev.includes(category);
      let newCategories;
      
      if (isSelected) {
        // Remove category
        newCategories = prev.filter(c => c !== category);
        // Remove recipients from this category
        const categoryRecipients = getCategoryRecipients(category);
        setSelectedRecipients(curr => 
          curr.filter(id => !categoryRecipients.some(r => r.id === id))
        );
      } else {
        // Add category
        newCategories = [...prev, category];
        // Auto-select recipients from this category
        const categoryRecipients = getCategoryRecipients(category);
        setSelectedRecipients(curr => [
          ...curr,
          ...categoryRecipients.map(r => r.id)
        ]);
      }
      
      return newCategories;
    });
  };
  
  const getCategoryRecipients = (category) => {
    switch (category) {
      case "teachers":
        return teachers;
      case "parents":
        return parents;
      case "admins":
        return admins;
      case "students":
        return selectedClass ? students.filter(s => s.class === selectedClass) : students;
      default:
        return [];
    }
  };

  const handleClassChange = (className) => {
    setSelectedClass(className);
    
    // Update student recipients if students category is selected
    if (selectedCategories.includes("students")) {
      // Remove old student recipients
      setSelectedRecipients(curr => 
        curr.filter(id => !students.some(s => s.id === id))
      );
      
      // Add new student recipients based on class
      const newStudents = className 
        ? students.filter(s => s.class === className)
        : students;
      
      setSelectedRecipients(curr => [
        ...curr,
        ...newStudents.map(s => s.id)
      ]);
    }
  };

  const toggleRecipient = (recipientId) => {
    setSelectedRecipients((prev) =>
      prev.includes(recipientId)
        ? prev.filter((id) => id !== recipientId)
        : [...prev, recipientId]
    );
  };

  const handleSend = () => {
    if (!formData.title || !formData.message || selectedRecipients.length === 0) {
      alert("Please fill all fields and select at least one recipient");
      return;
    }

    const messageId = `msg-${Date.now()}`;

    const selectedRecipientNames = recipients
      .filter((r) => selectedRecipients.includes(r.id))
      .map((r) => r.name)
      .join(", ");

    const categoryLabels = selectedCategories.map(cat => {
      switch(cat) {
        case "teachers": return "Teachers";
        case "parents": return "Parent/Guardian";
        case "admins": return "Admins";
        case "students": return "Students";
        default: return cat;
      }
    }).join(", ");

    const message = {
      id: messageId,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      to: selectedRecipientNames,
      category: categoryLabels,
      title: formData.title,
      message: formData.message,
    };

    // Send notifications based on category
    const getCategoryRole = (category) => {
      switch (category) {
        case "teachers":
          return "teacher";
        case "parents":
          return "parent";
        case "admins":
          return "admin";
        case "students":
          return "student";
        default:
          return "user";
      }
    };

    const senderName = user?.name || "System";

    // Deliver notifications to each selected recipient
    selectedRecipients.forEach((recipientId) => {
      const recipient = recipients.find((r) => r.id === recipientId);
      if (recipient) {
        addNotification({
          type: "message",
          title: formData.title,
          message: formData.message,
          sender: senderName,
          recipientId: recipientId,
          recipientRole: getCategoryRole(recipient.category),
          referenceId: messageId,
          persistent: true,
        });
      }
    });

    if (onSendMessage) {
      onSendMessage(message);
    }

    // Reset form
    setFormData({ title: "", message: "" });
    setSelectedRecipients([]);
    setSelectedClass("");
    setSelectedCategories([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-800">Compose Message</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Category Selection */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Send To (Select multiple)</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => handleCategoryChange("teachers")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  selectedCategories.includes("teachers")
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                📚 Teachers
              </button>
              <button
                onClick={() => handleCategoryChange("parents")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  selectedCategories.includes("parents")
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                👥 Parent/Guardian
              </button>
              <button
                onClick={() => handleCategoryChange("admins")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  selectedCategories.includes("admins")
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                🛡️ Admins
              </button>
              <button
                onClick={() => handleCategoryChange("students")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  selectedCategories.includes("students")
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                👨‍🎓 Students
              </button>
            </div>
          </div>

          {/* Class Selection (only for Students) */}
          {selectedCategories.includes("students") && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Class
              </label>
              <div className="relative">
                <select
                  value={selectedClass}
                  onChange={(e) => handleClassChange(e.target.value)}
                  className={`${inputCls} appearance-none pr-10`}
                >
                  <option value="">All Classes</option>
                  {classOptions.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3 top-3 text-gray-600 pointer-events-none"
                />
              </div>
            </div>
          )}

          {/* Recipients Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Recipients ({selectedRecipients.length} selected)
            </label>
            
            {/* Auto-selection Info */}
            {selectedCategories.length > 0 && (
              <div className="space-y-2 mb-4">
                {selectedCategories.includes("teachers") && teachers.length > 0 && (
                  <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                    <p className="text-sm text-blue-800 font-medium">
                      ✅ All {teachers.length} teachers will be notified
                    </p>
                  </div>
                )}
                {selectedCategories.includes("parents") && parents.length > 0 && (
                  <div className="border border-green-200 rounded-lg p-3 bg-green-50">
                    <p className="text-sm text-green-800 font-medium">
                      ✅ All {parents.length} parents/guardians will be notified
                    </p>
                  </div>
                )}
                {selectedCategories.includes("admins") && admins.length > 0 && (
                  <div className="border border-purple-200 rounded-lg p-3 bg-purple-50">
                    <p className="text-sm text-purple-800 font-medium">
                      ✅ All {admins.length} admins will be notified
                    </p>
                  </div>
                )}
                {selectedCategories.includes("students") && (
                  <div className="border border-orange-200 rounded-lg p-3 bg-orange-50">
                    <p className="text-sm text-orange-800 font-medium">
                      ✅ {selectedClass 
                        ? `All ${students.filter(s => s.class === selectedClass).length} students from ${selectedClass}` 
                        : `All ${students.length} students from all classes`} will be notified
                    </p>
                  </div>
                )}
              </div>
            )}
            
            <div className="border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto space-y-3 bg-gray-50">
              {recipients.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                  Select a category above to view recipients
                </p>
              ) : (
                <>
                  {/* Group recipients by category */}
                  {selectedCategories.map((category) => {
                    const categoryRecipients = recipients.filter(r => r.category === category);
                    if (categoryRecipients.length === 0) return null;
                    
                    const categoryInfo = {
                      teachers: { label: "Teachers", color: "blue", icon: "📚" },
                      parents: { label: "Parents/Guardians", color: "green", icon: "👥" },
                      admins: { label: "Admins", color: "purple", icon: "🛡️" },
                      students: { label: "Students", color: "orange", icon: "👨‍🎓" }
                    };
                    
                    const info = categoryInfo[category];
                    const isReadOnly = category === "parents" || category === "students";
                    
                    return (
                      <div key={category} className="space-y-2">
                        <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                          {info.icon} {info.label} ({categoryRecipients.length})
                        </h4>
                        {categoryRecipients.map((recipient) => (
                          <div
                            key={recipient.id}
                            className={`flex items-center p-2 bg-white rounded border border-${info.color}-200 ${!isReadOnly && 'hover:bg-gray-50'}`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedRecipients.includes(recipient.id)}
                              disabled={isReadOnly}
                              onChange={() => !isReadOnly && toggleRecipient(recipient.id)}
                              className={`w-4 h-4 text-${info.color}-600 rounded ${isReadOnly ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            />
                            <span className="ml-3 text-sm text-gray-700">
                              {recipient.name}
                              {recipient.subject && (
                                <span className="text-xs text-gray-500 ml-2">
                                  ({recipient.subject})
                                </span>
                              )}
                              {recipient.child && (
                                <span className="text-xs text-gray-500 ml-2">
                                  - Child: {recipient.child}
                                </span>
                              )}
                              {recipient.class && (
                                <span className="text-xs text-gray-500 ml-2">
                                  ({recipient.class})
                                </span>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter a title or subject
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Fee Payment Reminder"
              className={inputCls}
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter your message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Type your message here..."
              rows="5"
              className={`${inputCls} resize-none`}
            />
            <p className="text-xs text-gray-500 mt-1">
              Characters: {formData.message.length}
            </p>
          </div>

          {/* Send Button */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Send size={16} />
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
