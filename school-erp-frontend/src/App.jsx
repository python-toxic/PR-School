import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import DashboardLayout from "./layouts/DahboardLayout.jsx";

import Dashboard from "./pages/Dashboard.jsx";

/* Normal pages */
import Students from "./pages/students/Students.jsx";
import StudentRemove from "./pages/students/StudentRemove.jsx";
import Academics from "./pages/academics/Academics";
import Fees from "./pages/fees/Fees.jsx";
import RecentPayments from "./pages/fees/RecentPayments.jsx";
import StudentFees from "./pages/fees/StudentFees.jsx";
import ClassFees from "./pages/fees/ClassFees.jsx";
import DefaultersList from "./pages/fees/DefaultersList.jsx";
import FeesReports from "./pages/fees/FeesReports.jsx";
import AuditTaxReports from "./pages/fees/AuditTaxReports.jsx";
import Attendance from "./pages/attendance/Attendance.jsx";
import Examination from "./pages/examination/Examination";
import Datesheets from "./pages/examination/Datesheets.jsx";
import Results from "./pages/examination/Results.jsx";

/* Super Admin pages */
import Schools from "./pages/super-admin/Schools.jsx";
import Subscriptions from "./pages/super-admin/Subscriptions.jsx";
import Security from "./pages/super-admin/Security.jsx";

import { UserProvider } from "./context/UserContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import NotificationCenter from "./components/NotificationCenter.jsx";
import Homewrok from "./pages/homework/Homework";
import Inventory from "./pages/inventory/Inventory";
import Library from "./pages/library/Library";
import Transport from "./pages/transport/Transport";
import TransportDashboard from "./pages/transport/TransportDashboard";
import Vehicles from "./pages/transport/Vehicles";
import TransportRoutes from "./pages/transport/Routes";
import Stops from "./pages/transport/Stops";
import Drivers from "./pages/transport/Drivers";
import TransportStudents from "./pages/transport/TransportStudents";
import TripScheduler from "./pages/transport/TripScheduler";
import LiveTracking from "./pages/transport/LiveTracking";
import TransportReports from "./pages/transport/TransportReports";
import AuditLog from "./pages/super-admin/AuditLogs";
import Settings from "./pages/super-admin/Settings";
import Hostel from "./pages/hostel/Hostel";
import Overview from "./pages/super-admin/Overview";
import Admin from "./pages/super-admin/Admin";
import Classes from "./pages/classes/Classes.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Gallery from "./pages/gallery/Gallery.jsx";
import HolidayCalendar from "./pages/calendar-attendance/HolidayCalendar.jsx";
import StudentAttendance from "./pages/calendar-attendance/StudentAttendance.jsx";
import ViewAttendance from "./pages/calendar-attendance/ViewAttendance.jsx";
import EmployeeAttendance from "./pages/calendar-attendance/EmployeeAttendance.jsx";
import TimeTable from "./pages/time-table/TimeTable.jsx";
import AdmissionManagement from "./pages/admission/AdmissionManagement.jsx";
import ParentGuardian from "./pages/admission/ParentGuardian.jsx";
import ParentRemove from "./pages/admission/ParentRemove.jsx";
import Employees from "./pages/employees/Employees.jsx";
import EmployeeEdit from "./pages/employees/EmployeeEdit.jsx";
import EmployeeChangeDetails from "./pages/employees/EmployeeChangeDetails.jsx";
import EmployeeAccessibleClass from "./pages/employees/EmployeeAccessibleClass.jsx";
import EmployeeChangePermissions from "./pages/employees/EmployeeChangePermissions.jsx";
import EmployeeExperienceLetter from "./pages/employees/EmployeeExperienceLetter.jsx";
import EmployeeChangePassword from "./pages/employees/EmployeeChangePassword.jsx";
import EmployeeChangeRole from "./pages/employees/EmployeeChangeRole.jsx";
import EmployeeBankDetails from "./pages/employees/EmployeeBankDetails.jsx";
import EmployeeRemove from "./pages/employees/EmployeeRemove.jsx";
import Messages from "./pages/profile/Messages.jsx";
import NoticeBoard from "./pages/notice-board/NoticeBoard.jsx";
import StudentHomeworkDetail from "./pages/homework/StudentHomeworkDetail.jsx";
import Notifications from "./pages/notifications/Notifications.jsx";
import OnlineClasses from "./pages/online-classes/OnlineClasses.jsx";
import Materials from "./pages/materials/Materials.jsx";

export default function App() {
  return (
    <UserProvider>
      <NotificationProvider>
        <BrowserRouter>
        <NotificationCenter />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* MAIN LAYOUT */}
          <Route element={<DashboardLayout />}>
            {/* ROLE-BASED DASHBOARD */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* SIDEBAR ROUTES */}
            <Route path="/academics" element={<Academics/>}/>
            <Route path="/students" element={<Students />} />
            <Route path="/students/remove" element={<StudentRemove />} />
            <Route path="/examination" element={<Examination/>}/>
            <Route path="/datesheets" element={<Datesheets/>}/>
            <Route path="/results" element={<Results/>}/>
            <Route path="homework" element={<Homewrok/>}/>
            <Route path="/homework/:id" element={<StudentHomeworkDetail/>}/>
            <Route path="/hostel" element={<Hostel/>}/>
            <Route path="/inventory" element={<Inventory/>}/>
            <Route path="/library" element={<Library/>}/>
            <Route path="/gallery" element={<Gallery/>}/>
            <Route path="/transport" element={<Transport/>}/>
            <Route path="/classes" element={<Classes/>}/>
            <Route path="/classes/time-table" element={<TimeTable/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/messages" element={<Messages/>}/>
            <Route path="/messages/:messageId" element={<Messages/>}/>
            <Route path="/notice-board" element={<NoticeBoard/>}/>
            <Route path="/notice-board/:noticeId" element={<NoticeBoard/>}/>
            <Route path="/notifications" element={<Notifications/>}/>
            <Route path="/admission-management" element={<AdmissionManagement/>}/>
            <Route path="/parent-guardian" element={<ParentGuardian/>}/>
            <Route path="/parent-guardian/remove" element={<ParentRemove/>}/>
            <Route path="/employees" element={<Employees/>}/>
            <Route path="/employees/edit" element={<EmployeeEdit/>}/>
            <Route path="/employees/change-details" element={<EmployeeChangeDetails/>}/>
            <Route path="/employees/accessible-class" element={<EmployeeAccessibleClass/>}/>
            <Route path="/employees/change-permissions" element={<EmployeeChangePermissions/>}/>
            <Route path="/employees/experience-letter" element={<EmployeeExperienceLetter/>}/>
            <Route path="/employees/change-password" element={<EmployeeChangePassword/>}/>
            <Route path="/employees/change-role" element={<EmployeeChangeRole/>}/>
            <Route path="/employees/bank-details" element={<EmployeeBankDetails/>}/>
            <Route path="/employees/remove" element={<EmployeeRemove/>}/>

            <Route path="/fees" element={<Fees />} />
            <Route path="/fees/recent-payments" element={<RecentPayments />} />
            <Route path="/fees/student-fees" element={<StudentFees />} />
            <Route path="/fees/class-fees" element={<ClassFees />} />
            <Route path="/fees/defaulters" element={<DefaultersList />} />
            <Route path="/fees/reports" element={<FeesReports />} />
            <Route path="/fees/audit-tax" element={<AuditTaxReports />} />
            <Route path="/attendance" element={<Attendance />} />
            
            {/* TRANSPORT ROUTES */}
            <Route path="/transport/dashboard" element={<TransportDashboard />} />
            <Route path="/transport/vehicles" element={<Vehicles />} />
            <Route path="/transport/routes" element={<TransportRoutes />} />
            <Route path="/transport/stops" element={<Stops />} />
            <Route path="/transport/drivers" element={<Drivers />} />
            <Route path="/transport/students" element={<TransportStudents />} />
            <Route path="/transport/trips" element={<TripScheduler />} />
            <Route path="/transport/tracking" element={<LiveTracking />} />
            <Route path="/transport/reports" element={<TransportReports />} />
            
            <Route path="/online-classes" element={<OnlineClasses />} />
            <Route path="/materials" element={<Materials />} />

            {/* CALENDAR & ATTENDANCE ROUTES */}
            <Route path="/calendar-attendance/holiday-calendar" element={<HolidayCalendar/>}/>
            <Route path="/calendar-attendance/student-attendance" element={<StudentAttendance/>}/>
            <Route path="/calendar-attendance/employee-attendance" element={<EmployeeAttendance/>}/>
            <Route path="/calendar-attendance/view-attendance" element={<ViewAttendance/>}/>

            {/* TIME TABLE ROUTES */}
            <Route path="/time-table" element={<TimeTable/>}/>

            <Route path="/settings" element={<Settings/>}/>
            
            {/* SUPER ADMIN ROUTES */}
            <Route path="/super-admin/sa-dashboard" element={<Overview/>}/>
            <Route path="/super-admin/school-admins" element={<Admin/>}/>
          </Route>

          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      </NotificationProvider>
    </UserProvider>
  );
}
