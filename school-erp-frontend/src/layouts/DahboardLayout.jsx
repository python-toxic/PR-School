import { useState } from "react";
import { Outlet, useLocation, useNavigate, Navigate } from "react-router-dom";
import { Sidebar } from "../components/common/Sidebar.jsx";
import { TopNavbar } from "../components/common/TopNavbar.jsx";
import { useUser } from "../context/UserContext.jsx";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useUser();

  const activeItem = location.pathname
    .replace("/dashboard/", "")
    .replace("/super-admin/", "super-admin/")
    .replace("/", "");

  const handleSidebarClick = (item) => {
    navigate(`/${item}`);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      
      <Sidebar
        activeItem={activeItem}
        onItemClick={handleSidebarClick}
      />

      <div className="flex flex-col flex-1 ml-64">
        <TopNavbar/>
      

      
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  </div>
  );
}
