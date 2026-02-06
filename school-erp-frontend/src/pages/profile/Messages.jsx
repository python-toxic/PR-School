import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { Plus, Send, Inbox, Check, Search, X, Eye, Trash2, Archive, Star, Clock } from "lucide-react";
import ComposeMessageModal from "../../components/ComposeMessageModal";
import { useNotifications } from "../../context/NotificationContext";

// Sample messages data
const sampleInboxMessages = [
  { id: "m1", from: "Principal Office", subject: "Important: Parent Meeting on 15th Feb", message: "Dear Parent, We are organizing a quarterly parents meeting on 15th February at 2:00 PM. Your participation is important.", timestamp: "2025-01-24 10:30 AM", read: false, starred: false },
  { id: "m2", from: "Ms. Priya Sharma (Math Teacher)", subject: "Your child's performance improvement", message: "Your child is doing excellent in Mathematics. Keep encouraging and supporting the learning at home.", timestamp: "2025-01-23 03:15 PM", read: true, starred: true },
  { id: "m3", from: "Finance Department", subject: "Fee payment reminder", message: "This is to remind you that the quarterly fee is due by 31st January. Please make the payment at your earliest convenience.", timestamp: "2025-01-22 09:00 AM", read: true, starred: false },
  { id: "m4", from: "Mr. Vikram Singh (Science Teacher)", subject: "Science project submission", message: "Please ensure your child submits the science project by Friday. Topic: Environmental Conservation", timestamp: "2025-01-21 02:45 PM", read: false, starred: false },
  { id: "m5", from: "Transport Department", subject: "Bus service update", message: "Due to maintenance, bus route 5 will operate from alternate location. Please check the notice board for details.", timestamp: "2025-01-20 11:00 AM", read: true, starred: false },
];

const sampleSentMessages = [
  { id: "s1", to: "Principal Office", subject: "Request for fee installment", message: "Kindly grant me permission to pay the fee in two installments due to financial constraints.", timestamp: "2025-01-23 02:00 PM", status: "Delivered", starred: false },
  { id: "s2", to: "Ms. Priya Sharma (Math Teacher)", subject: "Thank you for the update", message: "Thank you for the positive feedback regarding my child's performance. We will continue to support the learning.", timestamp: "2025-01-23 03:30 PM", status: "Delivered", starred: true },
  { id: "s3", to: "Finance Department", subject: "Fee payment confirmation", message: "Fee payment has been made vide online transfer. Transaction ID: TXN/2025/12345. Please acknowledge.", timestamp: "2025-01-22 10:15 AM", status: "Delivered", starred: false },
];

const inputCls = "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm";

export default function Messages() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { messageId } = useParams();
  const { markByReference } = useNotifications();

  // Check if user is logged in, if not redirect to login
  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  const [activeTab, setActiveTab] = useState("inbox");
  const [inboxMessages, setInboxMessages] = useState(sampleInboxMessages);
  const [sentMessages, setSentMessages] = useState(sampleSentMessages);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageDetail, setShowMessageDetail] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [composeForm, setComposeForm] = useState({
    to: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    if (!messageId) return;
    const target = inboxMessages.find((m) => m.id === messageId) || sentMessages.find((m) => m.id === messageId);
    if (target) {
      setSelectedMessage({ ...target, isSent: target.status ? true : false });
      setShowMessageDetail(true);
      setActiveTab(target.status ? "sent" : "inbox");
      if (!target.status) {
        setInboxMessages((prev) => prev.map((m) => (m.id === target.id ? { ...m, read: true } : m)));
      }
      markByReference(messageId, "message");
    }
  }, [messageId, inboxMessages, sentMessages, markByReference]);

  // Filter messages based on search
  const filteredInboxMessages = useMemo(() => {
    return inboxMessages.filter(
      (m) =>
        m.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [inboxMessages, searchQuery]);

  const filteredSentMessages = useMemo(() => {
    return sentMessages.filter(
      (m) =>
        m.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sentMessages, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    const unread = inboxMessages.filter((m) => !m.read).length;
    const starred = inboxMessages.filter((m) => m.starred).length;
    const sent = sentMessages.length;
    return { unread, starred, sent };
  }, [inboxMessages, sentMessages]);

  const handleCompose = () => {
    if (!composeForm.to || !composeForm.subject || !composeForm.message) {
      alert("Please fill all fields");
      return;
    }

    const newMessage = {
      id: `s${sentMessages.length + 1}`,
      to: composeForm.to,
      subject: composeForm.subject,
      message: composeForm.message,
      timestamp: new Date().toLocaleString(),
      status: "Delivered",
      starred: false,
    };

    setSentMessages([newMessage, ...sentMessages]);
    setComposeForm({ to: "", subject: "", message: "" });
    setShowComposeModal(false);
    alert("Message sent successfully!");
  };

  const handleMarkAsRead = (messageId) => {
    setInboxMessages(
      inboxMessages.map((m) => (m.id === messageId ? { ...m, read: true } : m))
    );
  };

  const handleToggleStar = (messageId, isSent = false) => {
    if (isSent) {
      setSentMessages(
        sentMessages.map((m) =>
          m.id === messageId ? { ...m, starred: !m.starred } : m
        )
      );
    } else {
      setInboxMessages(
        inboxMessages.map((m) =>
          m.id === messageId ? { ...m, starred: !m.starred } : m
        )
      );
    }
  };

  const handleDeleteMessage = (messageId, isSent = false) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      if (isSent) {
        setSentMessages(sentMessages.filter((m) => m.id !== messageId));
      } else {
        setInboxMessages(inboxMessages.filter((m) => m.id !== messageId));
      }
      setShowMessageDetail(false);
    }
  };

  const handleSendMessage = (message) => {
    const newMessage = {
      id: message.id || `s${sentMessages.length + 1}`,
      ...message,
      status: "Delivered",
      starred: false,
    };
    setSentMessages([newMessage, ...sentMessages]);
    alert("Message sent successfully!");
  };

  const handleViewMessage = (message, isSent = false) => {
    setSelectedMessage({ ...message, isSent });
    if (!isSent) {
      handleMarkAsRead(message.id);
    }
    markByReference(message.id, "message");
    setShowMessageDetail(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
            <p className="text-gray-600 mt-1">Manage your school communications</p>
          </div>
          <button
            onClick={() => setShowComposeModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={18} />
            Compose New
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Unread Messages</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.unread}</p>
              </div>
              <Inbox size={32} className="text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Starred Messages</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.starred}</p>
              </div>
              <Star size={32} className="text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Messages Sent</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.sent}</p>
              </div>
              <Send size={32} className="text-green-500" />
            </div>
          </div>
        </div>

        {/* Tabs and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex items-center justify-between px-6 border-b border-gray-200">
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setActiveTab("inbox");
                  setSearchQuery("");
                }}
                className={`px-6 py-4 font-medium transition border-b-2 ${
                  activeTab === "inbox"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Message Inbox
                {stats.unread > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs rounded-full">
                    {stats.unread}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  setActiveTab("sent");
                  setSearchQuery("");
                }}
                className={`px-6 py-4 font-medium transition border-b-2 ${
                  activeTab === "sent"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Sent Box
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={`Search ${activeTab === "inbox" ? "from sender" : "to recipient"}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${inputCls} pl-10`}
              />
            </div>
          </div>

          {/* Messages List */}
          <div className="divide-y divide-gray-200">
            {activeTab === "inbox" ? (
              <>
                {filteredInboxMessages.length === 0 ? (
                  <div className="p-12 text-center">
                    <Inbox size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">No messages in inbox</p>
                  </div>
                ) : (
                  filteredInboxMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 hover:bg-gray-50 transition cursor-pointer ${
                        !message.read ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3
                              className={`font-semibold text-gray-900 truncate ${
                                !message.read ? "font-bold" : ""
                              }`}
                            >
                              {message.from}
                            </h3>
                            {!message.read && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded font-medium">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate mb-1">
                            {message.subject}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {message.message.substring(0, 100)}...
                          </p>
                          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                            <Clock size={12} />
                            {message.timestamp}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleToggleStar(message.id)}
                            className="p-2 hover:bg-yellow-100 rounded transition"
                          >
                            <Star
                              size={18}
                              className={
                                message.starred
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-400"
                              }
                            />
                          </button>
                          <button
                            onClick={() => handleViewMessage(message)}
                            className="p-2 hover:bg-blue-100 rounded transition text-blue-600"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </>
            ) : (
              <>
                {filteredSentMessages.length === 0 ? (
                  <div className="p-12 text-center">
                    <Send size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium">No messages in sent box</p>
                  </div>
                ) : (
                  filteredSentMessages.map((message) => (
                    <div key={message.id} className="p-4 hover:bg-gray-50 transition">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                              To: {message.to}
                            </h3>
                            <span
                              className={`px-2 py-1 text-xs rounded font-medium ${
                                message.status === "Delivered"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {message.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate mb-1">
                            {message.subject}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {message.message.substring(0, 100)}...
                          </p>
                          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                            <Clock size={12} />
                            {message.timestamp}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleToggleStar(message.id, true)}
                            className="p-2 hover:bg-yellow-100 rounded transition"
                          >
                            <Star
                              size={18}
                              className={
                                message.starred
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-400"
                              }
                            />
                          </button>
                          <button
                            onClick={() => handleViewMessage(message, true)}
                            className="p-2 hover:bg-blue-100 rounded transition text-blue-600"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Compose New Message</h3>
              <button
                onClick={() => setShowComposeModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To *
                </label>
                <input
                  type="text"
                  value={composeForm.to}
                  onChange={(e) => setComposeForm({ ...composeForm, to: e.target.value })}
                  placeholder="Enter recipient name or department"
                  className={inputCls}
                />
                <p className="text-xs text-gray-500 mt-1">
                  e.g., Principal Office, Ms. Priya Sharma, Finance Department
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={composeForm.subject}
                  onChange={(e) =>
                    setComposeForm({ ...composeForm, subject: e.target.value })
                  }
                  placeholder="Enter message subject"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  value={composeForm.message}
                  onChange={(e) =>
                    setComposeForm({ ...composeForm, message: e.target.value })
                  }
                  placeholder="Type your message here..."
                  className={`${inputCls} resize-none`}
                  rows={6}
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowComposeModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompose}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  <Send size={18} />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Detail Modal */}
      {showMessageDetail && selectedMessage && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedMessage.isSent ? "To:" : "From:"}{" "}
                  {selectedMessage.isSent ? selectedMessage.to : selectedMessage.from}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{selectedMessage.subject}</p>
              </div>
              <button
                onClick={() => setShowMessageDetail(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                  <Clock size={14} className="inline mr-2" />
                  {selectedMessage.timestamp}
                </p>
                {selectedMessage.isSent && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    {selectedMessage.status}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() =>
                  handleToggleStar(
                    selectedMessage.id,
                    selectedMessage.isSent
                  )
                }
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-yellow-300 rounded-lg hover:bg-yellow-50 transition text-yellow-600 font-medium"
              >
                <Star size={18} />
                {selectedMessage.starred ? "Unstar" : "Star"}
              </button>
              <button
                onClick={() =>
                  handleDeleteMessage(
                    selectedMessage.id,
                    selectedMessage.isSent
                  )
                }
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-300 rounded-lg hover:bg-red-50 transition text-red-600 font-medium"
              >
                <Trash2 size={18} />
                Delete
              </button>
              <button
                onClick={() => setShowMessageDetail(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compose Message Modal */}
      <ComposeMessageModal
        isOpen={showComposeModal}
        onClose={() => setShowComposeModal(false)}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
