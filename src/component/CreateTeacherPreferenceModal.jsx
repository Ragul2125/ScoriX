import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

export default function CreateTeacherPreferenceModal({ isOpen = true , onClose}) {

   const teacherProfileId = localStorage.getItem("teacherId");
    console.log(teacherProfileId);
    
  const [formData, setFormData] = useState({
    gradingStrictness: "medium",
    partialCreditPreference: true,
    spellingTolerance: true,
    feedbackTone: "neutral",
    markDistributionPreference: "even",
    questionTypePreference: "",
    gradingScale: "percentage",
    feedbackStyle: "detailed",
    focusAreasPerQuestion: "",
    examTypePreference: "",
    styleTemplates: "",
  });

  const token = localStorage.getItem("token");
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!teacherProfileId) {
      alert("Teacher Profile ID missing!");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/teacher/preferences`,
        {
          ...formData,
          teacherProfile: teacherProfileId,
          questionTypePreference: formData.questionTypePreference.split(",").map((v) => v.trim()),
          focusAreasPerQuestion: formData.focusAreasPerQuestion.split(",").map((v) => v.trim()),
          examTypePreference: formData.examTypePreference.split(",").map((v) => v.trim()),
          styleTemplates: formData.styleTemplates.split(",").map((v) => v.trim()),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Teacher preferences saved successfully!");
      console.log(res.data);
      
    } catch (error) {
      console.error(error);
      alert("Failed to save preferences");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/70 rounded-3xl shadow-2xl w-[700px] max-h-[90vh] overflow-y-auto border border-white/40 relative animate-fadeIn scrollbar-hide">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">⚙️ Teacher Preferences</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition text-black">
            <X size={20} />
          </button>
        </div>
          
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
          {/* Dropdowns */}
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm mb-1">Grading Strictness</label>
            <select
              name="gradingStrictness"
              value={formData.gradingStrictness}
              onChange={handleChange}
              className="p-2.5 rounded-xl border border-gray-300 bg-white/60"
            >
              <option value="lenient">Lenient</option>
              <option value="medium">Medium</option>
              <option value="strict">Strict</option>
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className="text-gray-600 text-sm mb-1">Feedback Tone</label>
            <select
              name="feedbackTone"
              value={formData.feedbackTone}
              onChange={handleChange}
              className="p-2.5 rounded-xl border border-gray-300 bg-white/60"
            > 
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="critical">Critical</option>
            </select>
          </div>
           
          {/* Checkboxes */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="partialCreditPreference"
              checked={formData.partialCreditPreference}
              onChange={handleChange}
              className="accent-orange-500"
            />
            <label>Allow Partial Credit</label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="spellingTolerance"
              checked={formData.spellingTolerance}
              onChange={handleChange}
              className="accent-orange-500"
            />
            <label>Spelling Tolerance</label>
          </div>

          {/* Text Fields */}
          {[
            ["markDistributionPreference", "Mark Distribution Preference", "even / weighted"],
            ["gradingScale", "Grading Scale", "percentage / points"],
            ["feedbackStyle", "Feedback Style", "detailed / brief"],
            ["questionTypePreference", "Question Type Preference", "MCQ, Short Answer, etc."],
            ["focusAreasPerQuestion", "Focus Areas per Question", "concepts, syntax, etc."],
            ["examTypePreference", "Exam Type Preference", "midterm, final, quiz"],
            ["styleTemplates", "Style Templates", "template1, template2"],
          ].map(([name, label, placeholder]) => (
            <div key={name} className="flex flex-col col-span-2">
              <label className="text-gray-600 text-sm mb-1">{label}</label>
              <input
                type="text"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                className="p-2.5 rounded-xl border border-gray-300 bg-white/60 focus:ring-2 focus:ring-orange-400 outline-none text-black"
              />
            </div>
          ))}

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
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
