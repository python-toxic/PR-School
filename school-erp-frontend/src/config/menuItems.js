import {
  LayoutDashboard,
  Users,
  DollarSign,
  Calendar,
  BookOpen,
  ClipboardList,
  FileText,
  UserCog,
  Bell,
  Settings,
  Bus,
  Home,
  Library,
  Package,
  ShieldCheck,
  GraduationCap,
  UserCircle,
  Clock,
  Briefcase,
  Receipt,
  CheckSquare,
  UserPlus,
  MessageSquare,
  BarChart3,
  Tag,
  Truck,
  Wallet,
  MessageCircle,
  Image,
  Video,
  School,
  FileQuestion
} from "lucide-react";

import { ROLES } from "../constants/roles";

export const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.TEACHER,
      ROLES.STUDENT,
      ROLES.PARENT
    ]
  },

  {
    id: "profile",
    label: "My Profile",
    icon: UserCircle,
    roles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.TEACHER,
      ROLES.STUDENT,
      ROLES.PARENT
    ]
  },

  {
    id: "calendar-attendance",
    label: "Calendar & Attendance",
    icon: Calendar,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT],
    children: [
      {
        id: "holiday-calendar",
        label: "Holiday Calendar",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT]
      },
      {
        id: "student-attendance",
        label: "Student Attendance",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT]
      },
      {
        id: "employee-attendance",
        label: "Employee Attendance",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN]
      }
    ]
  },

  {
    id: "time-table",
    label: "Time Table",
    icon: Clock,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT]
  },

  {
    id: "expense-management",
    label: "Expense Management",
    icon: Receipt,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    children: [
      {
        id: "all-expenses",
        label: "All Expenses",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN]
      },
      {
        id: "add-expense",
        label: "+ Add Expense",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN]
      },
      {
        id: "reimbursements",
        label: "Reimbursements",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN]
      },
      {
        id: "pending-approval",
        label: "Pending Approval",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN]
      }
    ]
  },

  {
    id: "admins",
    label: "Admins",
    icon: ShieldCheck,
    roles: [ROLES.SUPER_ADMIN]
  },

  {
    id: "employees",
    label: "Employees",
    icon: Briefcase,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN]
  },

  {
    id: "students",
    label: "Students",
    icon: Users,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER]
  },

  {
    id: "classes",
    label: "Classes",
    icon: GraduationCap,
    roles: [ROLES.ADMIN, ROLES.TEACHER]
  },

  {
    id: "admission-management",
    label: "Admission Management",
    icon: UserPlus,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN]
  },

  {
    id: "parent-guardian",
    label: "Parent/Guardian",
    icon: UserCog,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER]
  },

  {
    id: "user-requests",
    label: "User Requests",
    icon: CheckSquare,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN]
  },

  {
    id: "messages",
    label: "Messages",
    icon: MessageSquare,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT]
  },

  {
    id: "reports",
    label: "Reports",
    icon: BarChart3,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    children: [
      {
        id: "categories",
        label: "Categories",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN]
      },
      {
        id: "vendors",
        label: "Vendors",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN]
      },
      {
        id: "budgets",
        label: "Budgets",
        roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN]
      }
    ]
  },

  {
    id: "notice-board",
    label: "Notice Board",
    icon: Bell,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT]
  },

  {
    id: "homework",
    label: "Student Homework",
    icon: FileText,
    roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT]
  },

  {
    id: "materials",
    label: "Materials Library",
    icon: Library,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT]
  },

  {
    id: "online-classes",
    label: "Online Classes",
    icon: Video,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT]
  },

  {
    id: "examination",
    label: "Exams & Results",
    icon: ClipboardList,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT]
  },

  {
    id: "fees",
    label: "Fees Management",
    icon: DollarSign,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STUDENT, ROLES.PARENT]
  },

  {
    id: "transport",
    label: "Transport Management",
    icon: Bus,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.STUDENT, ROLES.PARENT]
  },

  {
    id: "gallery",
    label: "Gallery Management",
    icon: Image,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT]
  },

  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN]
  },

  {
    id: "other-schools",
    label: "Other Schools",
    icon: School,
    roles: [ROLES.SUPER_ADMIN]
  },

  {
    id: "feedback",
    label: "Feedback Or Query",
    icon: FileQuestion,
    roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT]
  }
];
