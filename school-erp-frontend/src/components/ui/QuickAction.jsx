export function QuickAction({ icon: Icon, title, description }) {
  return (
    <button className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-700" />
        </div>
        <div className="text-left">
          <p className="font-medium">{title}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <span className="text-gray-400">→</span>
    </button>
  );
}