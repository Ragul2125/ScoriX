import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Plus, Send, X, Mic } from "lucide-react";
import excel from "../assets/excel.png";
import word from "../assets/word.png";
import pdf from "../assets/pdf.png";
import ppt from "../assets/ppt.png";
import figma from "../assets/figma.png";
import file from "../assets/file.png";
import txt from "../assets/txt.png";
// Chat assets
import chatlogo from "../assets/chatlogo.png";
import Sendicon from "../assets/send.svg";
import Voice from "../assets/voice.png";
import Name from "../assets/name.svg";
import Chat from "./Chat";

export default function QuestionInput({ setQuestionPapers, showChat = false }) {
  const [documents, setDocuments] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);

  // Chat State
  const [messages, setMessages] = useState([]);

  const [chatInput, setChatInput] = useState("");
  const [chatMode, setChatMode] = useState("normal");
  const [chatModel, setChatModel] = useState("general");
  const [chatAttachedFiles, setChatAttachedFiles] = useState([]);
  const [isChatListening, setIsChatListening] = useState(false);
  const [resultData, setResultData] = useState();

  const chatFileInputRef = useRef(null);

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const ngrokUrl = "https://0b615aab87fe.ngrok-free.app"

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

  // ✅ File upload (store only)
  const handleAddDocument = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.docx,.txt"; // restrict to valid types
    input.multiple = false;

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      // Store full file object for later upload
      setDocuments((prev) => [...prev, { id: Date.now(), name: file.name, file: file }]);
    };

    input.click();
  };

  const handleGenerate = async () => {


    setIsGenerated(true);

    // Trigger Chat "Thinking" state
    const triggerData = { prompt: prompt || "Generate questions", timestamp: Date.now() };
    // localStorage.setItem("pendingGeneration", JSON.stringify(triggerData));

    window.dispatchEvent(new CustomEvent("generate-triggered", {
      detail: triggerData
    }));

    // Create FormData with all docs
    const formData = new FormData();
    if (documents.length > 0) {
      documents.forEach((doc) => {
        formData.append("file", doc.file);
      });
    } else {
      formData.append("file", "");
    }

    formData.append("text", prompt || "");
    console.log("Sending FormData...");

    try {
      const response = await fetch(
        `${ngrokUrl}/api/generate-question-paper`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const result = await response.json();
      console.log(result);

      localStorage.setItem("stream_url", result.stream_url)
      localStorage.setItem("task_id", result.task_id)

      // Dispatch event with generation data for Chat component to start SSE
      window.dispatchEvent(new CustomEvent("generation-data-ready", {
        detail: {
          stream_url: result.stream_url,
          task_id: result.task_id,
          ngrokUrl: ngrokUrl
        }
      }));

      if (result.questions) {
        console.log("✅ Generated Questions:", result.questions);
        alert("Questions generated successfully! Check console for output.");
        localStorage.setItem("generatedQuestions", JSON.stringify(result.questions));
      } else {
        console.log("⚠️ Streaming started, waiting for completion...");
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
    }
  };


  // --- Chat Logic ---
  const handleChatFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setChatAttachedFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const removeChatFile = (index) => {
    setChatAttachedFiles((prev) => prev.filter((_, i) => i !== index));
    if (chatAttachedFiles.length <= 1 && chatFileInputRef.current) {
      chatFileInputRef.current.value = "";
    }
  };

  const clearChatFiles = () => {
    setChatAttachedFiles([]);
    if (chatFileInputRef.current) chatFileInputRef.current.value = "";
  };

  const toggleChatListening = () => {
    if (isChatListening) {
      setIsChatListening(false);
      return;
    }

    setIsChatListening(true);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setChatInput((prev) => prev + (prev ? " " : "") + transcript);
        setIsChatListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsChatListening(false);
      };

      recognition.onend = () => {
        setIsChatListening(false);
      }

      recognition.start();
    } else {
      alert("Browser does not support speech recognition.");
      setIsChatListening(false);
    }
  };

  const handleChatSend = () => {
    if (chatInput.trim() === "") return;
    const newMessage = {
      text: chatInput,
      sender: "user",
      timestamp: new Date(),
      mode: chatMode,
      model: chatModel,
    };

    console.log("Sending Chat Request:", {
      content: chatInput,
      mode: chatMode,
      model: chatModel,
      files: chatAttachedFiles
    });

    setMessages([...messages, newMessage]);
    setChatInput("");
    clearChatFiles();

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: `${chatInput}`,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    }, 1000);
  };

  const handleChatKeyPress = (e) => {
    if (e.key === "Enter") handleChatSend();
  };

  return (
    <div
      className="w-110 rounded-3xl p-5 pr-0 flex flex-col gap-6 text-gray-800 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(90deg, #FFE8D0 0%, #F4E7DC 50%, #FFFFFF 100%)",
      }}
    >
      {false && (
        <Chat
          data={resultData}
        />
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 font-semibold text-lg text-black">
          <span>💬</span>
          <span>Question Generator</span>

        </div>
      </div>

      {/* Conditional Layout for Documents */}
      {isGenerated ? (
        // Top Scrollable Bar
        <div className="flex gap-4 overflow-x-auto scrollbar-hide py-2 border-b border-gray-200/50 bg-black/70 rounded-2xl px-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm whitespace-nowrap">
            <span className="text-white">Documents</span>
          </div>
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-lg whitespace-nowrap">
              <img src={getIconForFile(doc.name)} alt={doc.name} className="w-5 h-5 rounded-md" />
              <span className="text-xs font-medium text-gray-700">{doc.name}</span>
            </div>
          ))}
        </div>
      ) : (
        // Standard Centered List
        <div className="mt-2 bg-black/70 rounded-2xl p-4 flex flex-col gap-3 flex-1">
          {/* Header */}
          <div className="flex justify-between items-center text-gray-300 text-sm mb-1">
            <div className="flex items-center gap-1">
              <span>Documents</span>

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
      )}

      {/* Prompt input - Textarea */}
      {!isGenerated && (
        <div className="bg-white backdrop-blur-md rounded-2xl p-3">
          <div className="flex flex-col gap-2 text-black text-sm w-full">
            <textarea
              placeholder="Type your prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-transparent outline-none flex-1 text-black placeholder-gray-400 w-full resize-none min-h-[100px]"
            />
          </div>
        </div>
      )}

      {/* Generate Button - Hidden if Generated */}
      {!isGenerated && (
        <div
          onClick={handleGenerate}
          className="flex justify-center items-center bg-gradient-to-r from-[#3B82F6] to-[#F97316] text-black px-3 py-3 rounded-2xl text-m font-bold cursor-pointer hover:opacity-90 transition"
        >
          <h1>Generate</h1>
        </div>
      )}

      {/* In-line Chat Interface */}
      {showChat && (
        <div className="mt-4 border-t border-gray-200/20 pt-4 h-full w-full flex flex-col gap-4">

          {/* Chat Messages Area */}
          <div className="flex-1 w-full overflow-y-auto p-4 scrollbar-hide">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-6 text-center opacity-80">
                <div className="backdrop-blur-md rounded-[30px]">
                  <img src={chatlogo} alt="ScoriX Logo" className="w-40 h-40 mx-auto" />
                </div>
                <h1 className="text-xl font-semibold text-black">
                  Unleash AI with <span className="text-orange-600">ScoriX</span>
                  <br /> Smarter Ideas and Insights
                </h1>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-3 px-5 rounded-2xl ${message.sender === "user" ? "bg-orange-600 text-white rounded-tr-lg" : "bg-gray-200 text-black rounded-tl-lg"}`}>
                    <p>{message.text}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Area */}
          <div className="relative">
            {/* Gradient Border Background */}
            <div className="absolute inset-0 rounded-3xl bg-[linear-gradient(90deg,#9BD2F3_0%,#D5CEC7_50%,#F8B676_100%)] opacity-70 pointer-events-none"></div>

            <div className="relative z-10 p-1">
              {/* Attached Files Display */}
              {chatAttachedFiles.length > 0 && (
                <div className="flex gap-2 px-4 py-2 overflow-x-auto scrollbar-hide">
                  {chatAttachedFiles.map((file, index) => (
                    <div key={index} className="bg-white/90 backdrop-blur-md px-3 py-1 text-xs rounded-lg border border-orange-100 flex items-center gap-2 text-gray-700 whitespace-nowrap">
                      <span className="font-medium truncate max-w-[100px]">{file.name}</span>
                      <button onClick={() => removeChatFile(index)} className="text-gray-400 hover:text-red-500">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input Bar */}
              <div className="bg-white/70 backdrop-blur-md shadow-sm p-2 rounded-2xl flex items-center gap-2">
                <button onClick={() => chatFileInputRef.current.click()} className="hover:bg-gray-100 p-1.5 rounded-full transition-colors">
                  <Plus size={18} className="text-gray-600" />
                </button>
                <input
                  type="file"
                  multiple
                  ref={chatFileInputRef}
                  onChange={handleChatFileChange}
                  className="hidden"
                />
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleChatKeyPress}
                  placeholder={isChatListening ? "Listening..." : "Ask me anything..."}
                  className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500 text-sm"
                />
                <button onClick={toggleChatListening} className={`p-1.5 rounded-full transition-all ${isChatListening ? "text-red-500 animate-pulse" : "hover:bg-gray-100 text-gray-600"}`}>
                  {isChatListening ? <Mic size={18} /> : <img src={Voice} alt="voice" className="w-5 h-5" />}
                </button>
                <button onClick={handleChatSend} className="p-1.5 hover:bg-orange-100 rounded-full transition-colors">
                  <img src={Sendicon} alt="send" className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Dropdowns */}
          <div className="flex justify-end gap-3 px-2">
            <div className="relative group">
              <select
                value={chatMode}
                onChange={(e) => setChatMode(e.target.value)}
                className="appearance-none bg-white/40 backdrop-blur-sm border border-black/10 rounded-xl pl-3 pr-7 py-1 text-xs font-semibold text-gray-700 outline-none hover:bg-white/60 focus:border-orange-400 transition-all cursor-pointer"
              >
                <option value="normal">Normal</option>
                <option value="deep-think">Deep Think</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={12} />
            </div>
            <div className="relative group">
              <select
                value={chatModel}
                onChange={(e) => setChatModel(e.target.value)}
                className="appearance-none bg-white/40 backdrop-blur-sm border border-black/10 rounded-xl pl-3 pr-7 py-1 text-xs font-semibold text-gray-700 outline-none hover:bg-white/60 focus:border-orange-400 transition-all cursor-pointer"
              >
                <option value="general">General</option>
                <option value="ans-key-generator">Ans Key Generator</option>
                <option value="question-paper-gen">Question Paper Gen</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={12} />
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
