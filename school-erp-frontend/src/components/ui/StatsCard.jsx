import { Card, CardContent } from './card.jsx';

export function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = 'increase',
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBgColor = 'bg-blue-100'
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <h3 className="text-2xl font-semibold text-gray-900">{value}</h3>

            {change && (
              <p
                className={`text-sm mt-2 ${
                  changeType === 'increase'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {changeType === 'increase' ? '↑' : '↓'} {change}
              </p>
            )}
          </div>

          <div
            className={`w-12 h-12 rounded-lg ${iconBgColor} flex items-center justify-center`}
          >
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
