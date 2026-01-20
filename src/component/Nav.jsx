import React from "react";
import { Home, Compass } from "lucide-react";
import logo from "../assets/logo.svg"
import { useNavigate } from "react-router-dom";

export default function Nav() {
   const Navigate = useNavigate();

  const handleopenclassrom = () =>{
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
      <nav className="flex flex-col gap-6 ">
        {/* Home */}
        <div className="flex flex-col items-center gap-3 cursor-pointer rounded-xl  transition">
          <div className="p-4 rounded-full" style={{ backgroundColor: "#000000" }}>
            <Home className="text-white" size={20} />
          </div>
          <span className="text-gray-800 font-small">Home</span>
        </div>

        {/* Discover */}
        <div className="flex flex-col items-center gap-3 cursor-pointer  rounded-xl transition">
          <div className="p-4 rounded-full" style={{ backgroundColor: "#E6D5CF" }}>
            <Compass className="text-black" size={20} />
          </div>
          <span className="text-gray-800 font-small">Discover</span>
        </div>
      </nav>
    </div>
  );
}
