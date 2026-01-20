import React, { useEffect, useState } from "react";
import { Upload, FileText, Download } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ImageReorderPopup from "./Upload";
import { useParams } from "react-router-dom";
import ImageReorderPopup2 from "./Upload1";

const ClassroomDisplay = () => {
  const navigate = useNavigate();

  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [openPopUp, setOpenPopUp] = useState(0);
  const [answerKeyFiles, setAnswerKeyFiles] = useState([]);
  const { id } = useParams();
  console.log(openPopUp);
  const BASE_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

  useEffect(() => {
    if (!id) {
      setError("No classroom selected. Please select one first.");
      setLoading(false);
      return;
    }

    const fetchClassroomData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const res = await axios.get(`${BASE_URL}/api/classrooms/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;

        // ✅ Fix nameList if it's a string inside an array
        if (
          Array.isArray(data.nameList) &&
          typeof data.nameList[0] === "string"
        ) {
          try {
            data.nameList = JSON.parse(data.nameList[0]);
          } catch (err) {
            console.error("Error parsing nameList JSON:", err);
            data.nameList = [];
          }
        }

        setClassroom(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching classroom:", err);
        setError("Failed to load classroom details.");
      } finally {
        setLoading(false);
      }
    };

    fetchClassroomData();
  }, [id]);

  const handleUploadAnswerKey = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".png,.jpg,.jpge,.gif,.pdf,.docx"; // accept both types
    input.multiple = true;

    input.onchange = async (e) => {
      const files = Array.from(e.target.files);

      if (files.length > 0) {
        setAnswerKeyFiles((prev) => [...prev, ...files]);

        // ✅ Create FormData
        const formData = new FormData();

        // ✅ Separate PDF & DOCX uploads
        files.forEach((file) => {
          const ext = file.name.split(".").pop().toLowerCase();

          if (
            ext === "pdf" ||
            ext === "png" ||
            ext === "jpg" ||
            ext === "jpge" ||
            ext === "gif"
          ) {
            formData.append("images", file); // send PDFs as "images"
          } else if (ext === "docx" || ext === "pdf") {
            formData.append("docs", file); // send DOCX as "docs"
          } else {
            console.warn(`⚠️ Unsupported file type skipped: ${file.name}`);
          }
        });

        // ✅ Optionally include metadata
        // formData.append("info_json", JSON.stringify({ type: "objective" }));

        // ✅ Debug logs
        console.log("📦 FormData contents:");
        for (let [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(
              `${key}: ${value.name} (${value.type}, ${value.size} bytes)`
            );
          } else {
            console.log(`${key}: ${value}`);
          }
        }

        try {
          const response = await fetch(
            "https://a9b0719e2853.ngrok-free.app/process",
            {
              method: "POST",
              body: formData,
            }
          );

          if (!response.ok) {
            throw new Error("Upload failed");
          }

          const result = await response.json();
          console.log("✅ Server Response:", result);

          localStorage.setItem("response", JSON.stringify(result.response));
          alert("Files uploaded successfully!");
        } catch (error) {
          console.error("❌ Upload error:", error);
          alert("Error uploading files. Check console for details.");
        }
      }
    };

    input.click();
  };

  const handleUploadStudentAnswer = (studentRollNo) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        alert(`Answer uploaded for ${studentRollNo}`);
        // TODO: Add backend upload logic
      }
    };
    input.click();
  };
   
  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-600">
        Loading classroom details...
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] text-red-600">
        <p>{error}</p>
        {/* <button
          onClick={() => navigate("/classrooms")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go Back
        </button> */}
      </div>
    );

  if (!classroom)
    return (
      <div className="flex justify-center items-center h-[60vh] text-gray-600">
        No classroom found.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 flex items-center flex-col">
      <div className="min-w-6xl bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex gap-6 px-6">
            {["overview", "students"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 border-b-2 font-medium text-sm transition ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {classroom.clsName}
              </h2>
              <p className="text-gray-600">{classroom.schoolOrCollegeName}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Classroom ID
                  </label>
                  <p className="text-gray-900 font-medium">{classroom.clsID}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Department / Section
                  </label>
                  <p className="text-gray-900">
                    {classroom.department} / {classroom.sectionOrGrade}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Subject
                  </label>
                  <p className="text-gray-900">{classroom.subject}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Academic Year / Term
                  </label>
                  <p className="text-gray-900">
                    {classroom.academicYearOrTerm}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Evaluation Pattern
                  </label>
                  <p className="text-gray-900">{classroom.evaluationPattern}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    AI Mode
                  </label>
                  <p className="text-gray-900">{classroom.aiMode}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Total Students
                  </label>
                  <p className="text-gray-900">
                    {classroom.nameList?.length || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Answer Key Section */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Question Paper and Answer Key
                    </h3>
                    {classroom.answerKey ? (
                      <p className="text-sm text-gray-600">
                        {classroom.answerKey}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-600">
                        No answer key uploaded
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleUploadAnswerKey}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  <Upload className="w-4 h-4" />
                  {classroom.answerKey ? "Update" : "Upload"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === "students" && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Student List
              </h3>
              <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>

            <div className="overflow-x-auto h-70">
              <table className="w-full ">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Roll No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Handwritten Paper
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Objective Paper
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {classroom.nameList?.map((student, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {student.rollno}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {index == 0
                            ? localStorage.getItem("total_mark") || "N/A"
                            : "N/A" || "N/A"}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => setOpenPopUp(1)}
                          className="flex items-center gap-2 text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          Upload Handwritten Answer Images
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => setOpenPopUp(2)}
                          className="flex items-center gap-2 text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          Upload Objective Paper Images
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {openPopUp == 1 ? (
              <ImageReorderPopup setOpenPopUp={setOpenPopUp} />
            ) : openPopUp == 2 ? (
              <ImageReorderPopup2 setOpenPopUp={setOpenPopUp} />
            ) : (
              ""
            )}
            {!classroom.answerKey && (
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Please upload an answer key in the Overview tab before
                  uploading student answer sheets.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassroomDisplay;
