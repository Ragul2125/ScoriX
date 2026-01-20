import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CreateTeacherPreferenceModal from "./CreateTeacherPreferenceModal";

export default function CreateTeacherProfileModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    role: "Teacher",
    schoolOrCollegeName: "",
    department: "",
    mobileNumber: "",
    profilePictureUrl: "",
    subjectsTaught: "",
    yearsOfExperience: "",
    gradesTaught: "",
    bio: "",
  });

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("teacherId"); // assuming the teacher user _id is stored after login

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("User ID not found. Please login again.");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/profile`,
        {
          ...formData,
          user: userId,
          gradesTaught: formData.gradesTaught.split(",").map((g) => g.trim()),
          subjectsTaught: formData.subjectsTaught
            .split(",")
            .map((s) => s.trim()),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Teacher profile created successfully!");
      console.log(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to create teacher profile");
    }
  };

  // const Navigate = useNavigate();

  // const handleOpenPerference = ()=>{
  //   Navigate("/teacherpreferences")
  // }

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/70 rounded-3xl shadow-2xl w-[700px] max-h-[90vh] overflow-y-auto border border-white/40 relative animate-fadeIn scrollbar-hide">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            👩‍🏫 Create Teacher Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer text-black"
          >
            <X size={20} />
          </button>
        </div>
         
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
          {[
            ["schoolOrCollegeName", "School / College Name", "e.g. SMVEC"],
            ["department", "Department / Subject", "e.g. CSE / Physics"],
            ["mobileNumber", "Mobile Number", "e.g. 9876543210"],
            [
              "profilePictureUrl",
              "Profile Picture URL",
              "Image link (optional)",
            ],
            [
              "subjectsTaught",
              "Subjects Taught",
              "Comma-separated (e.g. Math, Science)",
            ],
            [
              "gradesTaught",
              "Grades Taught",
              "Comma-separated (e.g. 10th, 11th)",
            ],
            ["yearsOfExperience", "Years of Experience", "e.g. 5"],
          ].map(([name, label, placeholder]) => (
            <div key={name} className="flex flex-col">
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

          {/* Bio */}
          <div className="flex flex-col col-span-2">
            <label className="text-gray-600 text-sm mb-1">
              Teacher JD / Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              placeholder="Describe yourself briefly..."
              className="p-2.5 rounded-xl border border-gray-300 bg-white/60 focus:ring-2 focus:ring-orange-400 outline-none text-black"
            ></textarea>
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
              onClick={() => setIsProfileModalOpen(true)}
            >
              Create Profile
            </button>
            {isProfileModalOpen && (
              <CreateTeacherPreferenceModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                teacherProfileId={userId}
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
