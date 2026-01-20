import { useState } from "react";
import React from "react";
import axios from "axios";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
} from "lucide-react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email_id, setEmail_id] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [institution_name, setInstitution_name] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Get backend URL from .env (Vite format)
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const Navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isLogin
        ? `${backendURL}/api/auth/login`
        : `${backendURL}/api/auth/signup`;

      const payload = isLogin
        ? { email_id, password }
        : { name, email_id, password, institution_name };

      const res = await axios.post(endpoint, payload);

      console.log("Response:", res.data);
      alert(`${isLogin ? "Login" : "Signup"} successful!`);

      // Example: store JWT token
      
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("teacherId", res.data.user.teacher_id);
        Navigate("/classroom");
      }
    } catch (err) {
      console.error("Auth Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0">
        {/* Main gradient orb - blue */}
        <div
          className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full opacity-40 blur-3xl animate-pulse"
          style={{
            background: "radial-gradient(circle, #6BB7F5 0%, transparent 70%)",
            animationDuration: "8s",
          }}
        ></div>

        {/* Secondary gradient orb - orange */}
        <div
          className="absolute bottom-0 right-1/4 w-[700px] h-[700px] rounded-full opacity-50 blur-3xl animate-pulse"
          style={{
            background: "radial-gradient(circle, #FFB07A 0%, transparent 70%)",
            animationDuration: "10s",
            animationDelay: "2s",
          }}
        ></div>

        {/* Tertiary gradient - blue */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-70 blur-3xl animate-pulse"
          style={{
            background: "radial-gradient(circle, #6BB7F5 0%, transparent 70%)",
            animationDuration: "12s",
            animationDelay: "4s",
          }}
        ></div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        ></div>

        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E\")",
          }}
        ></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8 flex items-center justify-center gap-16">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-col justify-center max-w-xl">
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div
                className="w-16 h-16 rounded-2xl mr-4 flex items-center justify-center relative overflow-hidden shadow-md"
                style={{
                  background:
                    "linear-gradient(135deg, #6BB7F5 0%, #FFB07A 100%)",
                }}
              >
                <img src={logo} alt="logo" />
              </div>
              <div>
                <h1 className="text-5xl font-bold">
                  <span className="text-gray-900">Scori</span>
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #6BB7F5 0%, #FFB07A 100%)",
                    }}
                  >
                    X
                  </span>
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Intelligent Learning Platform
                </p>
              </div>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Transform your learning journey with AI-powered insights
            </h2>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="w-full max-w-md">
          <div
            className="rounded-3xl p-8 backdrop-blur-xl border shadow-md"
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              borderColor: "rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Toggle */}
            <div
              className="flex rounded-2xl p-1 mb-8"
              style={{ background: "rgba(0, 0, 0, 0.05)" }}
            >
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 cursor-pointer rounded-xl font-semibold transition-all ${
                  isLogin
                    ? "text-white shadow-md"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                style={
                  isLogin
                    ? {
                        background:
                          "linear-gradient(135deg, #6BB7F5 0%, #5BA4E6 100%)",
                      }
                    : {}
                }
              >
                Log in
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 cursor-pointer rounded-xl font-semibold transition-all ${
                  !isLogin
                    ? "text-white shadow-md"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                style={
                  !isLogin
                    ? {
                        background:
                          "linear-gradient(135deg, #6BB7F5 0%, #5BA4E6 100%)",
                      }
                    : {}
                }
              >
                Sign up
              </button>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3.5 rounded-xl border bg-white bg-opacity-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    size={20}
                  />
                  <input
                    type="email"
                    value={email_id}
                    onChange={(e) => setEmail_id(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border bg-white bg-opacity-50 text-gray-900 placeholder-gray-400 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    size={20}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border bg-white bg-opacity-50 text-gray-900 placeholder-gray-400 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={institution_name}
                    onChange={(e) => setInstitution_name(e.target.value)}
                    placeholder="Enter your institution"
                    className="w-full px-4 py-3.5 rounded-xl border bg-white bg-opacity-50 text-gray-900 placeholder-gray-400 focus:outline-none transition-all"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 rounded-xl font-semibold text-white transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group relative overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, #6BB7F5 0%, #FFB07A 100%)",
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isLogin ? "Continue" : "Create account"}
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
