import { Card, CardContent, CardHeader, CardTitle } from './card.jsx';
import { 
  UserPlus, 
  DollarSign, 
  FileText, 
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'admission',
    icon: UserPlus,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
    title: 'New Student Admission',
    description: 'Sarah Johnson enrolled in Grade 10-A',
    time: '2 minutes ago'
  },
  {
    id: 2,
    type: 'payment',
    icon: DollarSign,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-100',
    title: 'Fee Payment Received',
    description: 'Michael Brown paid ₹25,000 for Q1',
    time: '15 minutes ago'
  },
  {
    id: 3,
    type: 'exam',
    icon: FileText,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-100',
    title: 'Exam Results Published',
    description: 'Mid-term results for Grade 9 published',
    time: '1 hour ago'
  },
  {
    id: 4,
    type: 'attendance',
    icon: CheckCircle,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-100',
    title: 'Attendance Marked',
    description: 'Grade 8-B attendance marked by Mrs. Wilson',
    time: '2 hours ago'
  },
  {
    id: 5,
    type: 'leave',
    icon: AlertCircle,
    iconColor: 'text-orange-600',
    iconBg: 'bg-orange-100',
    title: 'Leave Request',
    description: 'John Doe requested leave for Jan 5-7',
    time: '3 hours ago'
  },
  {
    id: 6,
    type: 'event',
    icon: Calendar,
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-100',
    title: 'Event Scheduled',
    description: 'Annual Sports Day scheduled for Jan 20',
    time: '4 hours ago'
  }
];

export function RecentActivities() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex gap-4">
                <div className={`w-10 h-10 rounded-lg ${activity.iconBg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${activity.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600 truncate">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
