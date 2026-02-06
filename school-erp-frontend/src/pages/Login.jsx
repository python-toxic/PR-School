import React from "react";
import { useState } from "react";
import * as authService from "../services/auth.service";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "../context/UserContext.jsx";
import { School, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";


import {
  Card,

  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card.jsx";
import { Button } from "../components/ui/button.jsx";
import { Label } from "../components/ui/label.jsx";
import { Input } from "../components/ui/input.jsx";

export default function Login() {
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSuperAdminLogin = searchParams.get("super-admin") === "true";

  const [role, setRole] = useState(isSuperAdminLogin ? "super-admin" : "admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill all required fields");
      setLoading(false);
      return;
    }

    try {
      // Using the centralized auth service
      // Note: The backend expects { email, password }
      // If super admin login logic differs significantly, handle it here or in service
      // For now, mapping both flows to the unified login

      /* 
         We are ignoring the specific 'role' selection for the specific API call 
         because the Unified Login API (/api/auth/login) determines role from DB.
         However, we could check if the returned role matches the selected role if we want strictness.
      */

      const data = await authService.login(email, password);

      // strict role check optional:
      // if (!isSuperAdminLogin && data.role.toLowerCase() !== role) { ... }

      // UserContext typically expects { name, role, token, userId }
      // The API returns { _id, name, email, role, token }
      const userData = {
        name: data.name,
        role: data.role, // Ensure backend returns role string matching frontend expectations (e.g. UPPER CASE vs lower case)
        token: data.token,
        userId: data._id,
      };

      setUser(userData);

      // Should be saved by auth.service but setUser updates context state
      // navigate based on role or just dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
    }
  };



  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#f5f5f7] px-4 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-white/60 blur-3xl" />
        <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-slate-200/60 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-52 w-52 rounded-full bg-white/70 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative mx-auto flex w-full max-w-lg items-center justify-center"
      >
        <Card className="w-full rounded-3xl border border-slate-200/80 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <CardHeader className="space-y-3 px-8 pb-2 pt-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md">
              <School size={26} />
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                {isSuperAdminLogin ? "Super Admin" : "School ERP"}
              </p>
              <CardTitle className="text-3xl font-semibold text-slate-900">
                {isSuperAdminLogin ? "Welcome back." : "Sign in to continue."}
              </CardTitle>
            </div>
            <CardDescription className="text-sm text-slate-500">
              Minimal, focused, and designed for clarity across every workflow.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleLogin}>
            <CardContent className="space-y-5 px-8 pb-2 pt-6">
              {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                  {error}
                </div>
              )}

              {!isSuperAdminLogin && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">
                    Select Role
                  </Label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                  >
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                    <option value="parent">Parent</option>
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  {isSuperAdminLogin ? "Email Address" : "Email / Mobile"}
                </Label>
                <Input
                  type={isSuperAdminLogin ? "email" : "text"}
                  placeholder={
                    isSuperAdminLogin
                      ? "name@school.edu"
                      : "Email, mobile, or ID"
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full rounded-2xl border-slate-200 px-4 text-sm shadow-sm focus-visible:ring-slate-900/10"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">
                  {isSuperAdminLogin
                    ? "Password"
                    : "Password / DOB / Generated Code"}
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={
                      isSuperAdminLogin
                        ? "Enter your password"
                        : "Student: YYYY-MM-DD | Parent: Auto-generated"
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 w-full rounded-2xl border-slate-200 px-4 pr-12 text-sm shadow-sm focus-visible:ring-slate-900/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="px-8 pb-8 pt-4">
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full"
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-2xl bg-slate-900 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </motion.div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
