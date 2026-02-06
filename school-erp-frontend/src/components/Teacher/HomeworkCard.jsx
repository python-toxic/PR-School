export default function HomeworkCard({ homework }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex justify-between">
        <h3 className="font-semibold text-lg">
          {homework.title}
        </h3>
        <span className="text-sm text-red-500">
          Due: {homework.dueDate}
        </span>
      </div>

      <p className="text-sm text-gray-600 mt-1">
        {homework.className} • {homework.subject}
      </p>

      <p className="mt-3 text-gray-700">
        {homework.description}
      </p>
    </div>
  );
}
