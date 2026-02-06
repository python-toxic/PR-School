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
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 px-4 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-16 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mx-auto flex w-full max-w-5xl items-center justify-center"
      >
        <Card className="w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_24px_80px_rgba(15,23,42,0.55)] backdrop-blur-xl">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_1fr]">
            <div className="flex h-full flex-col justify-between border-b border-white/10 px-8 py-10 text-white lg:border-b-0 lg:border-r lg:px-12">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white shadow-lg">
                    <School size={26} />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                      {isSuperAdminLogin ? "Super Admin Access" : "School ERP Suite"}
                    </p>
                    <CardTitle className="text-2xl font-semibold text-white">
                      {isSuperAdminLogin ? "Manage with clarity." : "Welcome back."}
                    </CardTitle>
                  </div>
                </div>

                <CardDescription className="text-base text-white/70">
                  A premium workspace for academics, finance, and operations.
                  Everything stays clean, minimal, and focused.
                </CardDescription>

                <div className="space-y-3 text-sm text-white/70">
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <span>Real-time dashboards</span>
                    <span className="text-white/50">Live</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <span>Secure access controls</span>
                    <span className="text-white/50">Role-based</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <span>Unified reporting</span>
                    <span className="text-white/50">Export-ready</span>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex items-center justify-between text-xs text-white/40">
                <span>Trusted by premium campuses</span>
                <span>v2.4</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="bg-white px-8 py-10 lg:px-12">
              <CardHeader className="space-y-2 px-0 pb-6 text-left">
                <CardTitle className="text-3xl font-semibold text-slate-900">
                  {isSuperAdminLogin ? "Sign in to Super Admin" : "Sign in to your portal"}
                </CardTitle>
                <CardDescription className="text-sm text-slate-500">
                  Enter your credentials to continue.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5 px-0">
                {error && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
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
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
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
                        ? "Enter your email"
                        : "Enter email, mobile, or ID"
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 w-full rounded-xl border-slate-200 px-4 text-sm shadow-sm focus-visible:ring-slate-900/10"
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
                          : "Student: YYYY-MM-DD | Parent: Auto-generated code"
                      }
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 w-full rounded-xl border-slate-200 px-4 pr-12 text-sm shadow-sm focus-visible:ring-slate-900/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-800"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="px-0 pt-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full"
                >
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full rounded-xl bg-slate-900 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </Button>
                </motion.div>
              </CardFooter>
            </form>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
