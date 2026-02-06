import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";

export default function CardShell({ title, icon: Icon, children }) {
  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition bg-white">
      <CardHeader className="flex flex-row items-center gap-3 pb-2">
        <Icon className="h-5 w-5 text-blue-600" />
        <CardTitle className="text-base font-semibold text-gray-800">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-gray-700">
        {children}
      </CardContent>
    </Card>
  );
}
