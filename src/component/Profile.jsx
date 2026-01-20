import React from "react";
import {
  X,
  User,
  BookOpen,
  Award,
  Building2,
  Phone,
  Calendar,
  Users,
  GraduationCap,
} from "lucide-react";

export default function TeacherProfileView({ isOpen, onClose, teacherData }) {
  if (!isOpen || !teacherData) return null;

  const { teacher, profile, preferences } = teacherData;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-[linear-gradient(90deg,#9BD2F3_0%,#D5CEC7_50%,#F8B676_100%)] text-white p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* <User className="w-8 h-8" /> */}
            <h2 className="text-2xl font-bold">Teacher Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Top Section */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img
                  src={
                    profile?.profilePicture ||
                    "https://cdn-icons-png.flaticon.com/512/219/219986.png"
                  }
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  {teacher?.name || "Unnamed Teacher"}
                </h3>
                <p className="text-lg text-indigo-600 font-semibold mb-1">
                  {profile?.role || "Teacher"}
                </p>
                <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
                  <Building2 className="w-4 h-4" />
                  {teacher?.institution_name || "Institution not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Main Info Section */}
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                Basic Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Department</p>
                  <p className="text-gray-800 font-medium">
                    {profile?.department || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Mobile Number</p>
                  <p className="text-gray-800 font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4 text-indigo-600" />
                    {profile?.mobileNumber || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Years of Experience
                  </p>
                  <p className="text-gray-800 font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    {profile?.yearsOfExperience || "0"} Years
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Grades Taught</p>
                  <p className="text-gray-800 font-medium flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    {Array.isArray(profile?.gradesTaught)
                      ? profile.gradesTaught.join(", ")
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Grading Preferences */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                Grading Preferences
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Strictness, Style, Tone */}
                <div className="bg-indigo-50 p-4 rounded-lg">
                  <h5 className="text-sm font-semibold text-indigo-700 mb-2 flex items-center gap-2">
                    🎯 Grading Approach
                  </h5>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>
                      <strong>Strictness:</strong>{" "}
                      {preferences?.gradingStrictness || "N/A"}
                    </li>
                    <li>
                      <strong>Style:</strong>{" "}
                      {preferences?.feedbackStyle || "N/A"}
                    </li>
                    <li>
                      <strong>Tone:</strong>{" "}
                      {preferences?.feedbackTone || "N/A"}
                    </li>
                  </ul>
                </div>

                {/* Scale, Marking, Tolerance */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h5 className="text-sm font-semibold text-purple-700 mb-2 flex items-center gap-2">
                    📏 Evaluation Rules
                  </h5>
                  <ul className="space-y-1 text-gray-700 text-sm">
                    <li>
                      <strong>Mark Distribution:</strong>{" "}
                      {preferences?.markDistributionPreference || "N/A"}
                    </li>
                    <li>
                      <strong>Scale:</strong>{" "}
                      {preferences?.gradingScale || "N/A"}
                    </li>
                    <li>
                      <strong>Partial Credit:</strong>{" "}
                      {preferences?.partialCreditPreference
                        ? "✅ Yes"
                        : "❌ No"}
                    </li>
                    <li>
                      <strong>Spelling Tolerance:</strong>{" "}
                      {preferences?.spellingTolerance ? "✅ Yes" : "❌ No"}
                    </li>
                  </ul>
                </div>

                {/* Question & Exam Types */}
                <div className="bg-green-50 p-4 rounded-lg md:col-span-2">
                  <h5 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-2">
                    📝 Question & Exam Preferences
                  </h5>
                  <div className="flex flex-col md:flex-row gap-4 text-sm text-gray-700">
                    <div className="flex-1">
                      <p className="font-medium text-gray-600 mb-1">
                        Question Types
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {preferences?.questionTypePreference?.length ? (
                          preferences.questionTypePreference.map((q, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                            >
                              {q}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">No data</span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-600 mb-1">
                        Exam Types
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {preferences?.examTypePreference?.length ? (
                          preferences.examTypePreference.map((e, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs"
                            >
                              {e}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">No data</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Focus Areas */}
                <div className="bg-yellow-50 p-4 rounded-lg md:col-span-2">
                  <h5 className="text-sm font-semibold text-yellow-700 mb-2 flex items-center gap-2">
                    💡 Focus Areas Per Question
                  </h5>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                    {preferences?.focusAreasPerQuestion?.length ? (
                      preferences.focusAreasPerQuestion.map((f, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs"
                        >
                          {f}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">
                        No focus areas specified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Subjects Taught */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Subjects Taught
              </h4>
              <p className="text-gray-800 font-medium leading-relaxed">
                {Array.isArray(profile?.subjectsTaught)
                  ? profile.subjectsTaught.join(", ")
                  : "Not specified"}
              </p>
            </div>

            {/* Style Templates / Notes */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                Teaching Style Templates
              </h4>
              <p className="text-gray-800 leading-relaxed">
                {Array.isArray(preferences?.styleTemplates)
                  ? preferences.styleTemplates.join(", ")
                  : "No templates added."}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Close
          </button>
        </div> */}
      </div>
    </div>
  );
}
