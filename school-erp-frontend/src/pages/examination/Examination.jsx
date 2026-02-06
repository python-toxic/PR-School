import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext.jsx";
import {
  CalendarCheck2,
  FileText,
  Award,
  IdCard,
  Cog,
  Layers,
} from "lucide-react";

const cardBase =
  "aspect-square bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-col justify-between hover:shadow-xl transition-all duration-200 hover:-translate-y-1";

const cards = [
  {
    title: "Datesheets",
    description: "Create and manage exam schedules.",
    actions: [
      { label: "View", path: "/datesheets", variant: "primary" },
      { label: "Add", path: "/datesheets", variant: "ghost" },
    ],
    icon: CalendarCheck2,
  },
  {
    title: "Results",
    description: "Upload subject-wise student results.",
    actions: [{ label: "View", path: "/results" }, { label: "Add", path: "/results" }],
    icon: FileText,
  },
  {
    title: "Final Result",
    description: "Generate consolidated final results.",
    actions: [{ label: "Generate", path: "/datesheets" }],
    icon: Award,
  },
  {
    title: "Admit Cards",
    description: "Generate printable admit cards.",
    actions: [{ label: "Generate", path: "/datesheets" }],
    icon: IdCard,
  },
  {
    title: "Mark Categories",
    description: "Configure Theory / Practical / Internal.",
    actions: [{ label: "Configure", path: "/datesheets" }],
    icon: Layers,
  },
  {
    title: "Grade Configuration",
    description: "Define grading rules and scales.",
    actions: [{ label: "Configure", path: "/datesheets" }],
    icon: Cog,
  },
];

export default function Examination() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [removedStudents, setRemovedStudents] = useState([]);

  useEffect(() => {
    const removed = JSON.parse(localStorage.getItem("removedStudents") || "[]");
    setRemovedStudents(removed);
  }, []);

  const isFormerStudent = removedStudents.some((s) => s.id === user.id);

  if (isFormerStudent) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-2xl mx-auto bg-white rounded-lg border border-red-200 p-8 text-center">
          <p className="text-red-600 font-semibold mb-2">Access Restricted</p>
          <p className="text-gray-600">
            This account has been removed from the school and cannot access examination records.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Exams & Results</h1>
        <p className="text-gray-600">Quick access to exam operations.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className={`${cardBase} group`}>
              <div className="flex flex-col gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm group-hover:bg-blue-100">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{card.description}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {card.actions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className={`flex-1 min-w-[48%] px-3 py-2 rounded-lg text-sm font-semibold transition ${
                      action.variant === "primary"
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
