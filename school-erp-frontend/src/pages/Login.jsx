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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-300 to-blue-100 px-4">

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card
          className="
          w-full 
          max-w-xl 
          lg:max-w-2xl 
          rounded-3xl 
          border border-blue-200/60 
          bg-white/80 backdrop-blur-xl 
          shadow-[0_30px_60px_rgba(37,99,235,0.25)]
          transition-transform duration-300
          hover:-translate-y-1
        "
        >

          {/* Header */}
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg">
                <School size={32} />
              </div>
            </div>

            <CardTitle className="text-4xl font-bold text-blue-700">
              {isSuperAdminLogin ? "Super Admin Login" : "Welcome"}
            </CardTitle>


          </CardHeader>

          {/* Form */}
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-2 px-14">

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-100 border border-red-400 text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Role - Hidden for super admin */}
              {!isSuperAdminLogin && (
                <div className="space-y-2">
                  <Label className="text-md font-medium text-blue-700">
                    Select Role
                  </Label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="
                    w-full h-12 rounded-lg 
                    border border-blue-300 
                    bg-white px-4 text-base
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  "
                  >
                    <option value="admin">Admin</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                    <option value="parent">Parent</option>
                  </select>
                </div>
              )}

              {/* Email/Identifier */}
              <div className="space-y-1">
                <Label className="text-sm font-medium text-blue-700">
                  {isSuperAdminLogin ? "Email Address" : "Email / Mobile"}
                </Label>
                <Input
                  type={isSuperAdminLogin ? "email" : "text"}
                  placeholder={isSuperAdminLogin ? "Enter your email" : "Enter email, mobile, or ID"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 w-full px-4 text-base focus-visible:ring-blue-500"
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <Label className="text-sm font-medium text-blue-700">
                  {isSuperAdminLogin ? "Password" : "Password / DOB / Generated Code"}
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={isSuperAdminLogin ? "Enter your password" : "Student: YYYY-MM-DD | Parent: Auto-generated code"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 w-full px-4 pr-12 text-base focus-visible:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700 transition"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

            </CardContent>

            {/* Footer */}
            <CardFooter className="px-14 pt-2 pb-10">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="w-full"
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className="
                  w-full h-12 text-lg font-semibold 
                  bg-gradient-to-r from-blue-600 to-indigo-600 
                  hover:from-blue-700 hover:to-indigo-700 
                  text-white rounded-xl 
                  shadow-lg hover:shadow-xl 
                  transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
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