import React, { useState } from "react";
import { ChevronDown, Search, Plus } from "lucide-react";
import excel from "../assets/excel.png";
import word from "../assets/word.png";
import pdf from "../assets/pdf.png";
import ppt from "../assets/ppt.png";
import figma from "../assets/figma.png";
import file from "../assets/file.png";
import txt from "../assets/txt.png";

export default function QuestionInput({setQuestionPapers}) {
  const [documents, setDocuments] = useState([]);
  const [prompt, setPrompt] = useState("");

  // ✅ File icon resolver
  const getIconForFile = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    switch (ext) {
      case "doc":
      case "docx":
        return word;
      case "xls":
      case "xlsx":
        return excel;
      case "fig":
      case "figma":
        return figma;
      case "pdf":
        return pdf;
      case "ppt":
      case "pptx":
        return ppt;
      case "txt":
        return txt;
      default:
        return file;
    }
  };

  // ✅ File upload + backend call
  const handleAddDocument = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.docx"; // restrict to valid types
    input.multiple = false;

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setDocuments((prev) => [...prev, { id: Date.now(), name: file.name }]);

      // ✅ Create FormData
      const formData = new FormData();
      formData.append("file", file);
      formData.append("text", prompt || ""); // user-entered prompt

      console.log(formData)
      try {
        const response = await fetch(
          "https://ce4e1f142d44.ngrok-free.app/api/generate-questions",
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();

        localStorage.setItem("questionPaper", JSON.stringify(result));
        // setQuestionPapers(result);
        
        if (result.questions) {
          console.log("✅ Generated Questions:", result.questions);
          alert("Questions generated successfully! Check console for output.");
          // optionally store in localStorage
          localStorage.setItem("generatedQuestions", JSON.stringify(result.questions));
        } else {
          console.error("⚠️ Unexpected response:", result);
          // alert("No questions generated. Check console for details.");
        }
      } catch (error) {
        console.error("❌ Upload error:", error);
        // alert("Error uploading file or generating questions.");
      }
    };

    input.click();
  };
  
  return (
    <div
      className="w-95 rounded-3xl p-5 pr-0 flex flex-col gap-6 text-gray-800 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(90deg, #FFE8D0 0%, #F4E7DC 50%, #FFFFFF 100%)",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 font-semibold text-lg text-black">
          <span>💬</span>
          <span>Question Generator</span>
          <ChevronDown size={16} className="opacity-80" />
        </div>
      </div>

      {/* Prompt input */}
      <div className="bg-white backdrop-blur-md rounded-2xl p-3">
        <div className="flex items-center gap-2 text-black text-sm">
          <Search size={16} />
          <input
            type="text"
            placeholder="Type Some Prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="bg-transparent outline-none flex-1 text-black placeholder-gray-400 h-10 w-10"
          />
        </div>
      </div>

      {/* Documents Section */}
      <div className="mt-2 bg-black/70 rounded-2xl p-4 flex flex-col gap-3 flex-1">
        {/* Header */}
        <div className="flex justify-between items-center text-gray-300 text-sm mb-1">
          <div className="flex items-center gap-1">
            <span>Documents</span>
            <ChevronDown size={14} />
          </div>
          <Plus
            size={16}
            className="cursor-pointer hover:text-white"
            onClick={handleAddDocument}
          />
        </div>

        {/* Document List */}
        <div className="flex flex-col gap-3 overflow-y-auto scrollbar-hide">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition cursor-pointer"
            >
              <div className="bg-white p-3 rounded-xl">
                <img
                  src={getIconForFile(doc.name)}
                  alt={doc.name}
                  className="w-6 h-6 rounded-md"
                />
              </div>
              <span className="text-sm text-gray-100">{doc.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center items-center bg-gradient-to-r from-[#3B82F6] to-[#F97316] text-black px-3 py-3 rounded-2xl text-m font-bold cursor-pointer">
        <h1>Generate</h1>
      </div>
    </div>
  );
}
