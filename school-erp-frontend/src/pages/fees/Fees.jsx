import { useNavigate } from "react-router-dom";

const cards = [
  {
    title: "Recent Payments",
    subtitle: "Approve or disapprove fee submissions",
    body: "When students or parents pay, review and validate the payment here before it posts.",
    accent: "from-emerald-500 via-teal-500 to-cyan-500",
    badge: "Live queue",
    route: "/fees/recent-payments",
  },
  {
    title: "Student Fees",
    subtitle: "View & edit student fees",
    body: "Update individual student dues, concessions, and receipts in one place.",
    accent: "from-indigo-500 via-blue-500 to-sky-500",
    badge: "Per student",
    route: "/fees/student-fees",
  },
  {
    title: "Class Fees",
    subtitle: "Edit class fee structure",
    body: "Keep each class fee plan aligned with term schedules and transport or hostel add-ons.",
    accent: "from-purple-500 via-fuchsia-500 to-pink-500",
    badge: "Per class",
    route: "/fees/class-fees",
  },
  {
    title: "Defaulters List",
    subtitle: "Students with pending fees",
    body: "See overdue accounts, send reminders, and prioritize follow-ups.",
    accent: "from-amber-500 via-orange-500 to-rose-500",
    badge: "Action needed",
    route: "/fees/defaulters",
  },
  {
    title: "Fees Reports",
    subtitle: "Analytics, reports & dashboard",
    body: "Track collections, dues, and trends with ready-to-share visuals.",
    accent: "from-cyan-500 via-emerald-500 to-lime-500",
    badge: "Insights",
    route: "/fees/reports",
  },
  {
    title: "Audit & Tax Reports",
    subtitle: "Export for compliance",
    body: "Generate reconciled exports for auditors, tax filings, and finance reviews.",
    accent: "from-slate-600 via-slate-700 to-slate-900",
    badge: "Exports",
    route: "/fees/audit-tax",
  },
];

export default function Fees() {
  const navigate = useNavigate();
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Fees Management</h1>
          <p className="text-sm text-slate-500">Approve payments, manage fee structures, and export audit-ready reports.</p>
        </div>
        <div className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full shadow-inner">Colorful cards with hover animation</div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            onClick={() => card.route && navigate(card.route)}
            className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${card.accent} text-white shadow-lg shadow-slate-900/10 transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-xl ${
              card.route ? "cursor-pointer" : ""
            }`}
          >
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,white,transparent_35%)]" />
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_80%_0%,white,transparent_35%)]" />

            <div className="relative p-4 space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide">
                <span className="h-2 w-2 rounded-full bg-white/90 animate-pulse" />
                {card.badge}
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold leading-tight drop-shadow-sm">{card.title}</h2>
                <p className="text-sm font-medium text-white/90">{card.subtitle}</p>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">{card.body}</p>

              <div className="flex items-center justify-between pt-1 text-xs font-semibold uppercase tracking-wide text-white/80">
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-10 rounded-full bg-white/60 transition-all duration-300 group-hover:w-16" />
                  Quick action
                </span>
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
