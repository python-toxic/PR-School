import {
  Building2,
  DollarSign,
  AlertTriangle,
  ShieldCheck,
  Plus,
  RefreshCw,
  Lock,
  FileText,
  Settings,
} from "lucide-react";

import { Card, CardContent } from "../../components/ui/card.jsx";
import { StatsCard } from "../../components/ui/StatsCard.jsx";
import {QuickAction} from "../../components/ui/QuickAction.jsx";

export default function SuperAdminDashboard() {
  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Super Admin Dashboard</h1>
          <p className="text-sm text-gray-500">
            Platform-wide overview and system health
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FileText className="w-4 h-4" />
          {today}
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Schools"
          value="128"
          change="+6 this month"
          changeType="increase"
          icon={Building2}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatsCard
          title="Active Subscriptions"
          value="112"
          change="+4 renewed"
          changeType="increase"
          icon={DollarSign}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />

        <StatsCard
          title="Expiring Soon"
          value="9"
          change="Action required"
          changeType="decrease"
          icon={AlertTriangle}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
        />

        <StatsCard
          title="Platform Revenue"
          value="₹18,42,000"
          change="+12% MoM"
          changeType="increase"
          icon={ShieldCheck}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>

      {/* QUICK ACTIONS */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="font-semibold">Quick Actions</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <QuickAction
              icon={Plus}
              title="Add New School"
              description="Onboard a new institution"
            />

            <QuickAction
              icon={RefreshCw}
              title="Renew Subscription"
              description="Extend or change plans"
            />

            <QuickAction
              icon={Lock}
              title="Reset Admin Access"
              description="Reset school admin password"
            />

            <QuickAction
              icon={FileText}
              title="View Audit Logs"
              description="Track platform activity"
            />

            <QuickAction
              icon={Settings}
              title="Platform Settings"
              description="Global configuration"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


