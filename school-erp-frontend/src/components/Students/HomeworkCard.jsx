import { Card, CardContent } from "../ui/card.jsx";
import { Badge } from "../ui/badge.jsx";
import { useNavigate } from "react-router-dom";

export default function HomeworkCard({ homework, role }) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {homework.subject} — {homework.title}
          </h3>
          <Badge variant={homework.submitted ? "success" : "secondary"}>
            {homework.submitted ? "Submitted" : "Pending"}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          {homework.description}
        </p>

        <p className="text-sm">
          <span className="font-medium">Due:</span> {homework.dueDate}
        </p>

        <button
          onClick={() => navigate(`/homework/${homework.id}`)}
          className="text-blue-600 text-sm underline"
        >
          Open Details
        </button>
      </CardContent>
    </Card>
  );
}
