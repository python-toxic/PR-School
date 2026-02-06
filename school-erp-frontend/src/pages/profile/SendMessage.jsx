import { useState, useMemo } from "react";
import { Send, Users, FileText, Plus, X, ChevronDown, Copy, Eye, Trash2, MessageSquare, Users2, Shield, BookOpen } from "lucide-react";

// Sample classes data
const classes = [
  "Class 1 - A", "Class 2 - A", "Class 2 - B", "Class 3 - A", "Class 4 - A",
  "Class 5 - A", "Class 6 - A", "Class 7 - A", "Class 8 - A", "Class 9 - A",
  "Class 10 - A", "Nursery - A", "Nursery - B", "KG - A", "UKG - A"
];

// Sample recipient lists
const teachers = [
  { id: "t1", name: "Ms. Priya Sharma", subject: "Mathematics" },
  { id: "t2", name: "Mr. Vikram Singh", subject: "Science" },
  { id: "t3", name: "Ms. Anjali Patel", subject: "English" },
];

const parents = [
  { id: "p1", name: "Gourav92 (Father)", child: "Gourav Sharma" },
  { id: "p2", name: "Priya Mother (Mother)", child: "Priya Sharma" },
];

const admins = [
  { id: "a1", name: "Principal Office" },
  { id: "a2", name: "Finance Department" },
  { id: "a3", name: "Admin Staff" },
];

const students = [
  { id: "s1", name: "Aarav Kumar", class: "Class 2 - A" },
  { id: "s2", name: "Priya Sharma", class: "Class 2 - A" },
  { id: "s3", name: "Rohan Singh", class: "Class 3 - A" },
];

// Sample sent messages
const sampleSentMessages = [
  {
    id: 1,
    date: "Dec 28, 2025",
    time: "3:34:58 AM",
    to: "Gourav92",
    category: "Parent/Guardian",
    title: "Hi",
    message: "heelo",
  },
  {
    id: 2,
    date: "Dec 26, 2025",
    time: "9:04:33 PM",
    to: "Gourav92",
    category: "Parent/Guardian",
    title: "Test",
    message: "Please Come In The Principal Office Before 5 Day With Your Guardian",
  },
  {
    id: 3,
    date: "Dec 5, 2025",
    time: "11:44:11 PM",
    to: "Parent/Guardian, Student ( of Class 2nd - A )",
    category: "Parent/Guardian",
    title: "Fees Complite",
    message: "asdfghkl;lkjhgfdxz",
  },
];

const inputCls = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm";

export default function SendMessage() {
  const [activeTab, setActiveTab] = useState("compose");
  const [selectedCategory, setSelectedCategory] = useState("teachers");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
  });
  const [sentMessages, setSentMessages] = useState(sampleSentMessages);
  const [successMessage, setSuccessMessage] = useState("");

  // Get recipients based on category
  const getRecipients = (category) => {
    switch (category) {
      case "teachers":
        return teachers;
      case "parents":
        return parents;
      case "admins":
        return admins;
      case "students":
        return selectedClass
          ? students.filter((s) => s.class === selectedClass)
          : students;
      default:
        return [];
    }
  };

  const recipients = getRecipients(selectedCategory);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedRecipients([]);
    setSelectedClass("");
  };

  const toggleRecipient = (recipientId) => {
    setSelectedRecipients((prev) =>
      prev.includes(recipientId)
        ? prev.filter((id) => id !== recipientId)
        : [...prev, recipientId]
    );
  };

  const handleSendMessage = () => {
    if (!formData.title || !formData.message || selectedRecipients.length === 0) {
      alert("Please fill all fields and select at least one recipient");
      return;
    }

    const now = new Date();
    const date = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    // Get selected recipient names
    const recipientNames = recipients
      .filter((r) => selectedRecipients.includes(r.id))
      .map((r) => r.name)
      .join(", ");

    const categoryLabel =
      selectedCategory.charAt(0).toUpperCase() +
      selectedCategory.slice(1).replace(/s$/, "");

    const newMessage = {
      id: sentMessages.length + 1,
      date,
      time,
      to: recipientNames,
      category: categoryLabel,
      title: formData.title,
      message: formData.message,
    };

    setSentMessages([newMessage, ...sentMessages]);
    setFormData({ title: "", message: "" });
    setSelectedRecipients([]);
    setSuccessMessage("Message sent successfully!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleDeleteMessage = (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      setSentMessages(sentMessages.filter((m) => m.id !== messageId));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Send Message</h1>
          <p className="text-gray-600 mt-1">
            Send messages to teachers, parents, admins, and students
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("compose")}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === "compose"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
            }`}
          >
            Compose Message
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === "sent"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300"
            }`}
          >
            Sent Box
          </button>
        </div>

        {/* Compose Tab */}
        {activeTab === "compose" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {successMessage && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 font-medium">
                ✓ {successMessage}
              </div>
            )}

            {/* Category Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Send Message To
              </label>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <button
                  onClick={() => handleCategoryChange("teachers")}
                  className={`p-4 rounded-lg border-2 transition text-left flex flex-col items-start gap-2 ${
                    selectedCategory === "teachers"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <BookOpen
                    size={20}
                    className={
                      selectedCategory === "teachers"
                        ? "text-blue-600"
                        : "text-gray-600"
                    }
                  />
                  <span
                    className={`font-medium ${
                      selectedCategory === "teachers"
                        ? "text-blue-600"
                        : "text-gray-900"
                    }`}
                  >
                    To Teachers
                  </span>
                </button>

                <button
                  onClick={() => handleCategoryChange("parents")}
                  className={`p-4 rounded-lg border-2 transition text-left flex flex-col items-start gap-2 ${
                    selectedCategory === "parents"
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Users
                    size={20}
                    className={
                      selectedCategory === "parents"
                        ? "text-green-600"
                        : "text-gray-600"
                    }
                  />
                  <span
                    className={`font-medium ${
                      selectedCategory === "parents"
                        ? "text-green-600"
                        : "text-gray-900"
                    }`}
                  >
                    To Parent/Guardian
                  </span>
                </button>

                <button
                  onClick={() => handleCategoryChange("admins")}
                  className={`p-4 rounded-lg border-2 transition text-left flex flex-col items-start gap-2 ${
                    selectedCategory === "admins"
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Shield
                    size={20}
                    className={
                      selectedCategory === "admins"
                        ? "text-purple-600"
                        : "text-gray-600"
                    }
                  />
                  <span
                    className={`font-medium ${
                      selectedCategory === "admins"
                        ? "text-purple-600"
                        : "text-gray-900"
                    }`}
                  >
                    To Admins
                  </span>
                </button>

                <button
                  onClick={() => handleCategoryChange("students")}
                  className={`p-4 rounded-lg border-2 transition text-left flex flex-col items-start gap-2 ${
                    selectedCategory === "students"
                      ? "border-orange-600 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Users2
                    size={20}
                    className={
                      selectedCategory === "students"
                        ? "text-orange-600"
                        : "text-gray-600"
                    }
                  />
                  <span
                    className={`font-medium ${
                      selectedCategory === "students"
                        ? "text-orange-600"
                        : "text-gray-900"
                    }`}
                  >
                    To Students
                  </span>
                </button>
              </div>
            </div>

            {/* Class Selection (for students) */}
            {selectedCategory === "students" && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setSelectedRecipients([]);
                  }}
                  className={inputCls}
                >
                  <option value="">All Classes</option>
                  {classes.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Recipient Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Recipients ({selectedRecipients.length} selected)
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-48 overflow-y-auto">
                <div className="space-y-2">
                  {recipients.map((recipient) => (
                    <label
                      key={recipient.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRecipients.includes(recipient.id)}
                        onChange={() => toggleRecipient(recipient.id)}
                        className="rounded border-gray-300"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{recipient.name}</p>
                        {recipient.subject && (
                          <p className="text-xs text-gray-600">
                            Subject: {recipient.subject}
                          </p>
                        )}
                        {recipient.child && (
                          <p className="text-xs text-gray-600">
                            Child: {recipient.child}
                          </p>
                        )}
                        {recipient.class && (
                          <p className="text-xs text-gray-600">
                            Class: {recipient.class}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Title/Subject */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter a title or subject *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Subject or title of your message"
                className={inputCls}
              />
            </div>

            {/* Message Body */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Type your message here..."
                className={`${inputCls} resize-none`}
                rows={6}
              />
              <p className="text-xs text-gray-500 mt-2">
                {formData.message.length} characters
              </p>
            </div>

            {/* Send Button */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setFormData({ title: "", message: "" });
                  setSelectedRecipients([]);
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Clear
              </button>
              <button
                onClick={handleSendMessage}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <Send size={18} />
                Send Message
              </button>
            </div>
          </div>
        )}

        {/* Sent Box Tab */}
        {activeTab === "sent" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              IN APP MESSAGE - Sent Box
            </h2>

            {sentMessages.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">No sent messages</p>
              </div>
            ) : (
              sentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
                >
                  {/* Message Header */}
                  <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-transparent">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-xs text-gray-600 font-medium">
                          {msg.date}
                        </p>
                        <p className="text-xs text-gray-500">{msg.time}</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                        {msg.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 font-semibold">
                      TO: <span className="text-blue-600">{msg.to}</span>
                    </p>
                  </div>

                  {/* Message Content */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {msg.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                      {msg.message}
                    </p>
                  </div>

                  {/* Message Footer */}
                  <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                    <button
                      onClick={() => {
                        const text = `${msg.title}\n\n${msg.message}`;
                        navigator.clipboard.writeText(text);
                        alert("Message copied to clipboard!");
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 transition text-sm font-medium"
                    >
                      <Copy size={16} />
                      Copy
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 transition text-sm font-medium"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
