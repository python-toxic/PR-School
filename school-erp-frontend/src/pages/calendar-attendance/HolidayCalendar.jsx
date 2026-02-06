import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X, Calendar as CalendarIcon, AlertCircle } from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const initialDraggableEvents = [
  { id: "evt-1", title: "Republic Day", color: "bg-red-500" },
  { id: "evt-2", title: "Independence Day", color: "bg-orange-500" },
  { id: "evt-3", title: "Gandhi Jayanti", color: "bg-green-500" },
  { id: "evt-4", title: "Diwali", color: "bg-purple-500" },
  { id: "evt-5", title: "Holi", color: "bg-pink-500" },
  { id: "evt-6", title: "Christmas", color: "bg-blue-500" },
  { id: "evt-7", title: "Rainy Day", color: "bg-cyan-500" }
];

export default function HolidayCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [draggableEvents, setDraggableEvents] = useState(initialDraggableEvents);
  const [calendarEvents, setCalendarEvents] = useState({
    "2026-01-26": { title: "Republic Day", color: "bg-red-500" }
  });
  const [newEventTitle, setNewEventTitle] = useState("");
  const [draggedEvent, setDraggedEvent] = useState(null);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleAddEvent = () => {
    if (!newEventTitle.trim()) return;
    
    const newEvent = {
      id: `evt-${Date.now()}`,
      title: newEventTitle,
      color: "bg-indigo-500"
    };
    
    setDraggableEvents([...draggableEvents, newEvent]);
    setNewEventTitle("");
  };

  const handleDragStart = (e, event) => {
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, date) => {
    e.preventDefault();
    if (draggedEvent) {
      setCalendarEvents({
        ...calendarEvents,
        [date]: { title: draggedEvent.title, color: draggedEvent.color }
      });
      setDraggedEvent(null);
    }
  };

  const handleRemoveEvent = (date) => {
    const newEvents = { ...calendarEvents };
    delete newEvents[date];
    setCalendarEvents(newEvents);
  };

  const isWeekend = (dayOfWeek) => {
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Previous month days
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 text-center text-gray-300"></div>);
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();
      const event = calendarEvents[date];
      const weekend = isWeekend(dayOfWeek);

      days.push(
        <div
          key={day}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, date)}
          className={`min-h-[100px] p-2 border border-gray-200 rounded-lg transition-all hover:shadow-md ${
            weekend ? 'bg-gray-50' : 'bg-white'
          }`}
        >
          <div className="flex justify-between items-start mb-1">
            <span className={`text-sm font-semibold ${weekend ? 'text-gray-500' : 'text-gray-900'}`}>
              {day}
            </span>
            {event && (
              <button
                onClick={() => handleRemoveEvent(date)}
                className="text-red-500 hover:text-red-700 p-0.5"
              >
                <X size={14} />
              </button>
            )}
          </div>
          
          {weekend && !event && (
            <div className="text-xs text-gray-400 mt-1">
              <span className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-600">Weekend</span>
            </div>
          )}
          
          {event && (
            <div className={`${event.color} text-white text-xs px-2 py-1 rounded mt-1`}>
              {event.title}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <CalendarIcon size={28} className="text-blue-600" />
          Holiday Calendar
        </h1>
        <p className="text-sm text-gray-500 mt-1">Drag events to calendar dates to create holidays</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Draggable Events */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Draggable Events</h3>
            
            <div className="space-y-2 mb-4">
              {draggableEvents.map((event) => (
                <div
                  key={event.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, event)}
                  className={`${event.color} text-white px-3 py-2 rounded-lg cursor-move hover:opacity-80 transition`}
                >
                  {event.title}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Create New Holiday</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Event Title"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddEvent()}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddEvent}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-2 mb-2">
              <AlertCircle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <h4 className="text-sm font-bold text-amber-900">Note:</h4>
            </div>
            <ul className="text-xs text-amber-800 space-y-1 ml-6 list-disc">
              <li>When you add event to a date, all attendance will be disabled for that date.</li>
              <li>You can delete events at any time but you have to add attendance for that date.</li>
              <li>Weekend days are marked automatically.</li>
            </ul>
          </div>
        </div>

        {/* Calendar */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {MONTHS[currentMonth]} {currentYear}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-semibold text-gray-700 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {renderCalendar()}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                <span className="text-gray-600">Weekend</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-gray-600">Holiday</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
