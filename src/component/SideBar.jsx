import React, { useState } from "react";
import { Plus, ChevronDown, Search, FileText } from "lucide-react";
import scope from "../assets/scope.svg";
import { useNavigate } from "react-router-dom";
import CreateClassroomModal from "../component/CreateClassroomModal";
import ClassList from "./ClassList";

export default function Sidebar() {
  

  const Navigate = useNavigate();

  const handlesendgeneralchat = () =>{
    Navigate("/generalchat")
  }

  const handleopenquestiongenerator = () =>{
    Navigate("/question-paper-generator")
  }
  
  const [showModal, setShowModal] = useState(false);


  return (
    <div className="relative w-full bg-[#0E0E0E] text-white rounded-3xl overflow-hidden shadow-2xl p-7 flex flex-col space-y-6">
      {/* Gradient glow background */}
      <div className="absolute -top-40 -left-40 w-96 h-96 blur-3xl opacity-30 rounded-full"></div>

      {/* Header */}
      <div className="relative flex items-center justify-between">
        <h2 className="text-lg font-semibold">New Chat</h2>
        <button className="text-gray-400 hover:text-white transition">
          <FileText size={18} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1A1A1A] text-sm text-gray-300 placeholder-gray-500 outline-none focus:ring-2 focus:ring-[#E6D5CF]"
        />
      </div>

      {/* Agents Section */}
      <div className="relative flex flex-col gap-4">
        <button className="flex justify-between items-center bg-gradient-to-r from-[#3B82F6] to-[#F97316] text-white px-3 py-2 rounded-xl text-m font-medium cursor-pointer" onClick={handleopenquestiongenerator}>
          Question paper agent
        </button>
        <div className="flex items-center gap-2 text-gray-300 text-m cursor-pointer hover:text-white transition" onClick={handlesendgeneralchat}>
          <img src={scope} alt="" />
          <span>General chat</span>
        </div>
      </div>

      {/* Classes Section */}
      <div className="relative flex flex-col gap-4">
        <div className="flex justify-between items-center text-gray-400 text-m">
          <div className="flex items-center gap-1">
            <span>Classes</span>
            <ChevronDown size={14} />
          </div>
          <Plus size={16} className="cursor-pointer hover:text-white"  onClick={() => setShowModal(true)}/>
        </div>

         <CreateClassroomModal isOpen={showModal} onClose={() => setShowModal(false)} />

        {/* Class list */}
        <ClassList/>
      </div>
    </div>
  );
}
