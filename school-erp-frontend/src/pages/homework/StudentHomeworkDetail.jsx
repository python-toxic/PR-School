import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useUser } from "../../context/UserContext.jsx";
import { Card, CardContent } from "../../components/ui/card.jsx";
import { Badge } from "../../components/ui/badge.jsx";
import HomeworkUpload from "../../components/Students/HomeworkUpload.jsx";
import { fakeHomework } from "../../data/Student/homework.data.js";

export default function StudentHomeworkDetail() {
  const { id } = useParams();
  const { user } = useUser();
  const role = (user?.role || "").toLowerCase();
  const studentClass = (user?.class || user?.className || "").trim();

  const assignment = useMemo(() => {
    // try class-homeworks
    const raw = localStorage.getItem("class-homeworks");
    if (raw) {
      try {
        const map = JSON.parse(raw);
        // search across all classes to be robust
        for (const cls of Object.keys(map)) {
          const found = (map[cls] || []).find((hw) => String(hw.id) === String(id));
          if (found) {
            return {
              id: found.id,
              subject: found.subject || "",
              title: found.title,
              description: found.description,
              startDate: found.startDate,
              endDate: found.endDate,
              dueDate: found.endDate,
              fileUrl: found.fileUrl || "",
              className: cls,
              submitted: false,
            };
          }
        }
      } catch {}
    }

    // fallback to sample data
    const fake = fakeHomework.find((hw) => String(hw.id) === String(id));
    if (fake) {
      return {
        id: fake.id,
        subject: fake.subject,
        title: fake.title,
        description: fake.description,
        dueDate: fake.dueDate,
        fileUrl: fake.fileUrl,
        className: studentClass,
        submitted: fake.submitted,
      };
    }
    return null;
  }, [id, studentClass]);

  if (!assignment) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Homework not found.</p>
        <Link to="/homework" className="text-blue-600 underline">Back to Homework</Link>
      </div>
    );
  }

  const handleSubmission = (file) => {
    // Demo submission
    alert("Homework submitted (demo)");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Homework Details</h1>
        <Link to="/homework" className="text-sm text-blue-600 underline">Back to Homework</Link>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {assignment.subject ? `${assignment.subject} — ` : ""}{assignment.title}
            </h2>
            <Badge variant={assignment.submitted ? "success" : "secondary"}>
              {assignment.submitted ? "Submitted" : "Pending"}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Class:</span> {assignment.className || "—"}
            </div>
            <div>
              <span className="font-medium">Start Date:</span> {assignment.startDate || "—"}
            </div>
            <div>
              <span className="font-medium">End/Due Date:</span> {assignment.dueDate || assignment.endDate || "—"}
            </div>
          </div>

          <p className="text-sm text-gray-700 whitespace-pre-wrap">
            {assignment.description}
          </p>

          {assignment.fileUrl ? (
            <a href={assignment.fileUrl} target="_blank" rel="noreferrer" className="text-blue-600 text-sm underline">
              Download Homework File
            </a>
          ) : (
            <p className="text-xs text-gray-500">No file attached</p>
          )}

          {role === "student" && !assignment.submitted && (
            <div className="pt-2">
              <HomeworkUpload onSubmit={handleSubmission} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
