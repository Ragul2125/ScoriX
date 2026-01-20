import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

export default function CreateClassroomModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    clsID: "",
    clsName: "",
    schoolOrCollegeName: "",
    department: "",
    sectionOrGrade: "",
    subject: "",
    nameList: "", // string
    academicYearOrTerm: "",
    evaluationPattern: "Marks-Based",
    feedbackStylePreference: "Constructive",
    strictnessLevel: "Moderate",
    aiMode: "Auto",
  });

  // 🧠 get token + teacherId from localStorage (assuming you store them after login)
  const token = localStorage.getItem("token");
  const teacherId = localStorage.getItem("teacherId");

  if (!isOpen) return null;

  // 📩 handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🚀 handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teacherId) {
      alert("Teacher ID not found. Please login again.");
      return;
    }

    try {
        console.log(import.meta.env.VITE_BACKEND_URL);
        console.log(formData)
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/classrooms`,
        { ...formData, teacherProfile: teacherId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      );

      alert("Classroom created successfully!");
      console.log("✅ Response:", res.data);
      onClose();
    } catch (error) {
      console.error("❌ Error creating classroom:", error);
      alert("Failed to create classroom");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl w-[700px] max-h-[90vh] overflow-y-auto border border-white/40 relative animate-fadeIn scrollbar-hide">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            🏫 Create New Classroom
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
          {[
            ["clsID", "Class ID", "e.g. CLS1023"],
            ["clsName", "Name", "Enter class name"],
            ["schoolOrCollegeName", "School / College Name", "Institution name"],
            ["department", "Department", "e.g. Computer Science"],
            ["sectionOrGrade", "Section / Grade", "e.g. A / 10th Grade"],
            ["subject", "Subject", "e.g. Mathematics"],
            ["academicYearOrTerm", "Academic Year / Term", "2025 - 2026 / Term 1"],
          ].map(([name, label, placeholder]) => (
            <div key={name} className="flex flex-col">
              <label className="text-gray-600 text-sm mb-1">{label}</label>
              <input
                name={name}
                value={formData[name]}
                onChange={handleChange}
                type="text"
                placeholder={placeholder}
                className="p-2.5 rounded-xl border border-gray-300 bg-white/60 focus:ring-2 focus:ring-orange-400 outline-none text-black"
              />
            </div>
          ))}

          {/* Name list */}
          <div className="flex flex-col col-span-2">
            <label className="text-gray-600 text-sm mb-1">Name List</label>
            <textarea
              name="nameList"
              value={formData.nameList}
              onChange={handleChange}
              placeholder="Paste or enter student names..."
              rows="2"
              className="p-2.5 rounded-xl border border-gray-300 bg-white/60 focus:ring-2 focus:ring-orange-400 outline-none text-black"
            ></textarea>
          </div>

          {/* Dropdown fields */}
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm mb-1">
              Evaluation Pattern
            </label>
            <select
              name="evaluationPattern"
              value={formData.evaluationPattern}
              onChange={handleChange}
              className="p-2.5 rounded-xl border border-gray-300 bg-white/60 focus:ring-2 focus:ring-orange-400 outline-none text-black"
            >
              <option>Grades</option>
              <option>Marks-Based</option>
              <option>Rubric Based</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 text-sm mb-1">
              Feedback Style Preference
            </label>
            <select
              name="feedbackStylePreference"
              value={formData.feedbackStylePreference}
              onChange={handleChange}
              className="p-2.5 rounded-xl border border-gray-300 bg-white/60 focus:ring-2 focus:ring-orange-400 outline-none text-black"
            >
              <option>Formal</option>
              <option>Friendly</option>
              <option>Constructive</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 text-sm mb-1">Strictness Level</label>
            <select
              name="strictnessLevel"
              value={formData.strictnessLevel}
              onChange={handleChange}
              className="p-2.5 rounded-xl border border-gray-300 bg-white/60 focus:ring-2 focus:ring-orange-400 outline-none text-black"
            >
              <option>Lenient</option>
              <option>Moderate</option>
              <option>Strict</option>
            </select>
          </div>

          {/* AI Mode */}
          <div className="flex flex-col col-span-2">
            <label className="text-gray-600 text-sm mb-1">AI Mode</label>
            <div className="flex items-center gap-4">
              {["Auto", "Manual"].map((mode) => (
                <label key={mode} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="aiMode"
                    value={mode}
                    checked={formData.aiMode === mode}
                    onChange={handleChange}
                    className="accent-orange-500"
                  />
                  {mode === "Auto" ? "Auto Review" : "Manual Review"}
                </label>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-xl transition"
            >
              Create Classroom
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
