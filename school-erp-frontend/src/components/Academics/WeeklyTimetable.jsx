const PERIODS = [
  "09:00 - 09:45",
  "09:50 - 10:35",
  "10:40 - 11:25",
];

const getToday = () =>
  new Date().toLocaleDateString("en-US", { weekday: "long" });

export default function WeeklyTimetable({ timetable, mode = "student" }) {
  const today = getToday();

  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-100">
            <th className="p-4 text-left">Day</th>
            {PERIODS.map((p) => (
              <th key={p} className="p-4 text-center">
                {p}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {timetable.map((day) => {
            const isToday = day.day === today;

            return (
              <tr
                key={day.day}
                className={`border-t ${
                  isToday ? "bg-blue-50" : "hover:bg-slate-50"
                }`}
              >
                <td className="p-4 font-semibold">
                  {day.day}
                  {isToday && (
                    <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                      Today
                    </span>
                  )}
                </td>

                {day.periods.map((period, idx) => (
                  <td key={idx} className="p-3 text-center">
                    {period.subject === "Free" ? (
                      <div className="rounded-lg bg-gray-100 text-gray-500 py-2">
                        Free
                      </div>
                    ) : (
                      <div className="rounded-lg bg-green-100 text-green-700 px-3 py-2 shadow-sm">
                        <div className="font-medium">{period.subject}</div>

                        {mode === "teacher" && (
                          <div className="text-xs text-green-800">
                            Class {period.class}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
