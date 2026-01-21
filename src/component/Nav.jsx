import React from "react";
import { Home, LogOut } from "lucide-react";
import logo from "../assets/logo.svg"
import { useNavigate } from "react-router-dom";

export default function Nav() {
  const Navigate = useNavigate();

  const handleopenclassrom = () => {
    Navigate("/classroom")

  }
  const handlelogout = () => {
    localStorage.removeItem("token")
    Navigate("/")
  }
  const handlehome = () => {
    Navigate("/classroom")
  }
  return (
    <div className="flex flex-col items-center">
      {/* Logo Section */}
      <div className="mb-5">
        <div className="text-2xl font-bold text-gray-800 tracking-wide py-2 cursor-pointer" onClick={handleopenclassrom}>
          <img src={logo} alt="" />
          <p className="text-[#fe842b] font-bold">_____</p>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="h-[82vh] flex flex-col gap-6  justify-between">
        {/* Home */}
        <div className="flex flex-col items-center gap-3 cursor-pointer rounded-xl  transition">
          <div className="p-4 rounded-full" style={{ backgroundColor: "#000000" }} onClick={handlehome}>
            <Home className="text-white" size={20} />
          </div>
          <span className="text-gray-800 font-small">Home</span>
        </div>
        <div className="flex flex-col items-center gap-3 cursor-pointer rounded-xl transition">
          <div
            className="p-4 rounded-full"
            style={{ backgroundColor: "#dc2626" }}
            onClick={handlelogout}
          >
            <LogOut className="text-white" size={20} />
          </div>
          <span className="text-gray-800 font-small">Logout</span>
        </div>

      </nav>
    </div>
  );
}
