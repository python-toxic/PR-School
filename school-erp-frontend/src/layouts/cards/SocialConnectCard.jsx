// components/dashboard/cards/SocialConnectCard.jsx
import { Users } from "lucide-react";
import CardShell from "./CardShell.jsx";
import { Avatar, AvatarFallback } from "../../components/ui/avatar.jsx";

export default function SocialConnectCard({ people = [] }) {
  return (
    <CardShell title="Social Connect" icon={Users}>
      {people.length === 0 ? (
        <p className="text-gray-500">No updates</p>
      ) : (
        people.slice(0, 3).map((p, i) => (
          <div key={i} className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {p.name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-green-600">
                🎉 Birthday {p.date}
              </p>
            </div>
          </div>
        ))
      )}
    </CardShell>
  );
}
