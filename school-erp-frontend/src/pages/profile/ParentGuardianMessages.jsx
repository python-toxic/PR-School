import { useState, useEffect, useMemo } from "react";
import { Send, Search, Plus, X, User, Phone, Mail, MapPin, Clock, MessageSquare, Star } from "lucide-react";
import { useUser } from "../../context/UserContext.jsx";

// Sample data for parent/guardian contacts and messages
const sampleContacts = [
  { id: "p1", name: "Principal Office", type: "Admin", email: "principal@school.com", phone: "9876543210", avatar: "PO", isVerified: true },
  { id: "t1", name: "Ms. Priya Sharma", type: "Teacher", email: "priya.sharma@school.com", phone: "9876543211", avatar: "PS", subject: "Mathematics" },
  { id: "a1", name: "Mr. Rajesh Kumar", type: "Admin", email: "admin@school.com", phone: "9876543212", avatar: "RK" },
  { id: "t2", name: "Mr. Vikram Singh", type: "Teacher", email: "vikram.singh@school.com", phone: "9876543213", avatar: "VS", subject: "English" },
  { id: "cs1", name: "Counselor Support", type: "Support", email: "counsel@school.com", phone: "9876543214", avatar: "CS" },
];

const sampleMessages = [
  { id: "m1", fromId: "p1", from: "Principal Office", fromType: "Admin", message: "Dear Parent, We are organizing a parents meeting on 15th February. Please attend.", timestamp: "2025-01-24 10:30 AM", read: true, isFromSchool: true },
  { id: "m2", fromId: "t1", from: "Ms. Priya Sharma", fromType: "Teacher", message: "Your child is doing excellent in Mathematics. Keep encouraging.", timestamp: "2025-01-23 03:15 PM", read: true, isFromSchool: true },
  { id: "m3", fromId: "self", from: "You", message: "Thank you for the update. We will definitely attend the meeting.", timestamp: "2025-01-24 11:00 AM", read: true, isFromSchool: false },
  { id: "m4", fromId: "t1", from: "Ms. Priya Sharma", fromType: "Teacher", message: "Great! Looking forward to seeing you.", timestamp: "2025-01-24 11:15 AM", read: false, isFromSchool: true },
  { id: "m5", fromId: "a1", from: "Mr. Rajesh Kumar", fromType: "Admin", message: "Please submit the fee by end of month.", timestamp: "2025-01-22 09:00 AM", read: true, isFromSchool: true },
];

export default function ParentGuardianMessages() {
  const { user } = useUser();
  const [contacts, setContacts] = useState(sampleContacts);
  const [messages, setMessages] = useState(sampleMessages);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [showNewContactModal, setShowNewContactModal] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", type: "Teacher", email: "", phone: "" });
  const [starred, setStarred] = useState(new Set());

  useEffect(() => {
    // Load from localStorage
    const savedMessages = localStorage.getItem("parent-messages");
    const savedContacts = localStorage.getItem("parent-contacts");
    if (savedMessages) setMessages(JSON.parse(savedMessages));
    if (savedContacts) setContacts(JSON.parse(savedContacts));
  }, []);

  useEffect(() => {
    localStorage.setItem("parent-messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("parent-contacts", JSON.stringify(contacts));
  }, [contacts]);

  const filteredContacts = useMemo(() => {
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contacts, searchQuery]);

  const conversationMessages = useMemo(() => {
    if (!selectedContact) return [];
    return messages.filter(
      (m) => m.fromId === selectedContact.id || (m.fromId === "self" && selectedContact === conversations[0])
    );
  }, [selectedContact, messages]);

  const conversations = useMemo(() => {
    const unique = new Map();
    messages.forEach((m) => {
      if (!unique.has(m.fromId)) {
        const contact = contacts.find((c) => c.id === m.fromId);
        if (contact) unique.set(m.fromId, contact);
      }
    });
    return Array.from(unique.values());
  }, [messages, contacts]);

  const unreadCount = useMemo(() => {
    return messages.filter((m) => !m.read && m.isFromSchool).length;
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return;

    const message = {
      id: `m${Date.now()}`,
      fromId: "self",
      from: "You",
      message: newMessage,
      timestamp: new Date().toLocaleString(),
      read: true,
      isFromSchool: false,
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.phone) {
      alert("Please fill all fields");
      return;
    }

    const newContact = {
      id: `c${Date.now()}`,
      ...contactForm,
      avatar: contactForm.name.split(" ").map((n) => n[0]).join(""),
    };

    setContacts([...contacts, newContact]);
    setContactForm({ name: "", type: "Teacher", email: "", phone: "" });
    setShowNewContactModal(false);
  };

  const handleDeleteContact = (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      setContacts(contacts.filter((c) => c.id !== id));
      if (selectedContact?.id === id) {
        setSelectedContact(null);
        setShowContactDetails(false);
      }
    }
  };

  const handleToggleStar = (contactId) => {
    const newStarred = new Set(starred);
    if (newStarred.has(contactId)) {
      newStarred.delete(contactId);
    } else {
      newStarred.add(contactId);
    }
    setStarred(newStarred);
  };

  const markAsRead = (contactId) => {
    setMessages(
      messages.map((m) =>
        m.fromId === contactId && !m.read ? { ...m, read: true } : m
      )
    );
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Contacts Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Messages</h2>
          <div className="relative flex items-center gap-2">
            <Search size={18} className="absolute left-2 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <button
            onClick={() => setShowNewContactModal(true)}
            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
          >
            <Plus size={16} /> Add Contact
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => {
            const lastMessage = messages
              .filter((m) => m.fromId === contact.id)
              .pop();
            const unread = messages.filter(
              (m) => m.fromId === contact.id && !m.read
            ).length;

            return (
              <button
                key={contact.id}
                onClick={() => {
                  setSelectedContact(contact);
                  markAsRead(contact.id);
                }}
                className={`w-full px-4 py-3 border-b border-gray-100 text-left hover:bg-gray-50 transition ${
                  selectedContact?.id === contact.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                      {contact.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {contact.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {lastMessage?.message || "No messages yet"}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                    {unread > 0 && (
                      <span className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {unread}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStar(contact.id);
                      }}
                      className="p-1 hover:bg-yellow-100 rounded transition"
                    >
                      <Star
                        size={14}
                        className={
                          starred.has(contact.id)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-600">
          <p>
            <strong>{unreadCount}</strong> unread message
            {unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold">
                  {selectedContact.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {selectedContact.name}
                  </h3>
                  <p className="text-xs text-gray-500">{selectedContact.type}</p>
                </div>
              </div>
              <button
                onClick={() => setShowContactDetails(!showContactDetails)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <User size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversationMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.isFromSchool ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.isFromSchool
                        ? "bg-gray-100 text-gray-900"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.isFromSchool ? "text-gray-500" : "text-blue-100"
                      }`}
                    >
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">Select a contact to start messaging</p>
            </div>
          </div>
        )}

        {/* Contact Details Sidebar */}
        {showContactDetails && selectedContact && (
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white border-l border-gray-200 shadow-lg overflow-y-auto">
            <div className="p-6">
              <button
                onClick={() => setShowContactDetails(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} className="text-gray-600" />
              </button>

              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-2xl mx-auto mb-3">
                  {selectedContact.avatar}
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  {selectedContact.name}
                </h3>
                <p className="text-sm text-gray-500">{selectedContact.type}</p>
                {selectedContact.subject && (
                  <p className="text-xs text-blue-600 mt-1">
                    Subject: {selectedContact.subject}
                  </p>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail size={18} className="text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedContact.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Phone size={18} className="text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedContact.phone}
                    </p>
                  </div>
                </div>

                {selectedContact.isVerified && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-700 font-medium">
                      ✓ Verified Contact
                    </p>
                  </div>
                )}
              </div>

              {!["p1", "t1", "a1", "t2", "cs1"].includes(selectedContact.id) && (
                <button
                  onClick={() => handleDeleteContact(selectedContact.id)}
                  className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                >
                  Delete Contact
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add New Contact Modal */}
      {showNewContactModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Add New Contact</h3>
              <button
                onClick={() => setShowNewContactModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleAddContact} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, name: e.target.value })
                  }
                  placeholder="Contact name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={contactForm.type}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option>Teacher</option>
                  <option>Admin</option>
                  <option>Support</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, email: e.target.value })
                  }
                  placeholder="email@school.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, phone: e.target.value })
                  }
                  placeholder="9876543210"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewContactModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Add Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
