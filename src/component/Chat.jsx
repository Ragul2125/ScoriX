import React, { useState } from "react";
import { Send, Plus, HelpCircle, Info, Search, X, Mic, ChevronDown } from "lucide-react";
import chatlogo from "../assets/chatlogo.png";
import Sendicon from "../assets/send.svg";
import Voice from "../assets/voice.png";
import Name from "../assets/name.svg";
import ClassroomDisplay from "./ClassroomDisplay";
import { useLocation } from "react-router-dom";

export default function Chat({ isWidget = false, hideHeader = false }) {
  const location = useLocation();

  // State for chat messages and user input
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatMode, setChatMode] = useState("normal");
  const [chatModel, setChatModel] = useState("general");
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = React.useRef(null);

  const [questionPapers, setQuestionPapers] = useState(() => {
    const storedData = localStorage.getItem("questionPaper");
    return storedData ? JSON.parse(storedData) : [];
  });

  // Listen for question paper updates (from QuestionInput)
  React.useEffect(() => {
    const handleQuestionPaperUpdate = () => {
      const storedData = localStorage.getItem("questionPaper");
      if (storedData) {
        setQuestionPapers(JSON.parse(storedData));
      }
    };

    window.addEventListener("question-paper-updated", handleQuestionPaperUpdate);
    return () => window.removeEventListener("question-paper-updated", handleQuestionPaperUpdate);
  }, []);

  // State for generation-specific messages
  const [generationMessages, setGenerationMessages] = useState([]);
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, generationMessages]);

  // Listen for generation trigger from QuestionInput
  React.useEffect(() => {
    const handleGenerationTrigger = (e) => {
      // Ensure we only run this on the correct page
      if (!location.pathname.includes("question-paper-generator")) return;

      const userPrompt = e?.detail?.prompt || "Generate questions";

      setGenerationMessages((prev) => [
        ...prev,
        { text: userPrompt, sender: "user", timestamp: new Date() },
        { text: "Thinking...", sender: "ai", timestamp: new Date() }
      ]);

      // Simulate thinking delay
      setTimeout(() => {
        setGenerationMessages((prev) => {
          const newMessages = [...prev];
          if (newMessages.length > 0 && newMessages[newMessages.length - 1].text === "Thinking...") {
            newMessages[newMessages.length - 1] = {
              text: "I have analyzed the document. Here are some generated questions based on the content.",
              sender: "ai",
              timestamp: new Date()
            };
          }
          return newMessages;
        });
      }, 3000);
    };

    // Check for pending generation from localStorage
    const pendingGen = localStorage.getItem("pendingGeneration");
    if (pendingGen) {
      try {
        const data = JSON.parse(pendingGen);
        if (Date.now() - data.timestamp < 10000 && location.pathname.includes("question-paper-generator")) {
          handleGenerationTrigger({ detail: data });
          localStorage.removeItem("pendingGeneration");
        } else if (Date.now() - data.timestamp >= 10000) {
          localStorage.removeItem("pendingGeneration");
        }
      } catch (err) {
        console.error("Error parsing pending generation:", err);
        localStorage.removeItem("pendingGeneration");
      }
    }

    window.addEventListener("generate-triggered", handleGenerationTrigger);
    return () => window.removeEventListener("generate-triggered", handleGenerationTrigger);
  }, [location.pathname]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachedFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
    if (attachedFiles.length <= 1 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearFiles = () => {
    setAttachedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + (prev ? " " : "") + transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      }

      recognition.start();
    } else {
      alert("Browser does not support speech recognition.");
      setIsListening(false);
    }
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (input.trim() === "") return; // Prevent empty messages
    const newMessage = {
      text: input,
      sender: "user",
      timestamp: new Date(),
      mode: chatMode,
      model: chatModel,
    };
    // Console log to verify the payload as requested
    console.log("Sending Request Body:", {
      content: input,
      mode: chatMode,
      model: chatModel,
      files: attachedFiles
    });
    setMessages([...messages, newMessage]);
    setInput(""); // Clear input
    clearFiles(); // Clear file after sending
    // Simulate AI response (replace with actual API call for ScoriX)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          text: `${input}`,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    }, 1000);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <div className="flex flex-col gap-20">
      {/* Header */}
      {!hideHeader && (
        <div className="flex justify-between w-full px-8">
          <img src={Name} alt="Name" />
        </div>
      )}

      {(location.pathname.includes("generalchat") || isWidget) && (
        <div className="flex flex-col items-center justify-between gap-6 max-w-6xl mx-auto w-full">
          {messages.length == 0 && (
            <>
              {!hideHeader && (
                <div className="backdrop-blur-md rounded-[30px]">
                  <img
                    src={chatlogo}
                    alt="ScoriX Logo"
                    className="w-50 h-50 mx-auto"
                  />
                </div>
              )}

              {!hideHeader && (
                <div>
                  <h1 className="text-2xl font-semibold text-black text-center">
                    Unleash AI with{" "}
                    <span className="text-orange-600">ScoriX</span> Smarter Ideas
                    <br /> and Insights at your Fingertips
                  </h1>
                </div>
              )}
            </>
          )}

          <div className="flex-1 w-full overflow-y-auto max-h-[540px] p-4 scrollbar-hide">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[70%] p-3 px-5 rounded-2xl ${message.sender === "user"
                    ? "bg-orange-600 text-white rounded-tr-lg"
                    : "bg-gray-200 text-black rounded-tl-lg"
                    }`}
                >
                  <p>{message.text}</p>
                  {/* <p className="text-xs text-gray-500 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p> */}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div
            className={`rounded-4xl p-3 pb-5 flex items-center justify-center ${messages.length > 0 ? "fixed bottom-10" : "relative"
              }`}
          >
            <div className="absolute inset-0 rounded-3xl bg-[linear-gradient(90deg,#9BD2F3_0%,#D5CEC7_50%,#F8B676_100%)] opacity-70"></div>
            <div className="relative z-10">
              {attachedFiles.length > 0 && (
                <div className="absolute -top-15 left-0 flex overflow-x-auto gap-2 px-4 animate-fade-in-up w-full scrollbar-hide">
                  {attachedFiles.map((file, index) => (
                    <div key={index} className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs border border-orange-100 shadow-sm flex items-center gap-2 text-gray-700">
                      <span className="font-medium truncate max-w-[150px]">{file.name}</span>
                      <button onClick={() => removeFile(index)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="bg-white/70 backdrop-blur-md shadow-md p-3 rounded-2xl flex items-center gap-3 w-[600px]">
                <button onClick={() => fileInputRef.current.click()} className="hover:bg-gray-100 p-1 rounded-full transition-colors">
                  <Plus size={18} className="text-gray-600" />
                </button>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isListening ? "Listening..." : "Ask me anything..."}
                  className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500"
                />
                <button onClick={toggleListening} className={`p-1 rounded-full transition-all ${isListening ? "mobile-ripple text-red-500" : "hover:bg-gray-100"}`}>
                  {isListening ? <Mic size={20} /> : <img src={Voice} alt="voice" />}
                </button>
                <button onClick={handleSendMessage}>
                  <img src={Sendicon} alt="send" />
                </button>
              </div>
              <div className="flex text-sm text-gray-700 mt-3 items-center px-2 gap-4">
                <div className="relative group">
                  <select
                    value={chatMode}
                    onChange={(e) => setChatMode(e.target.value)}
                    className="appearance-none bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl pl-4 pr-8 py-1.5 text-xs font-semibold text-gray-700 outline-none hover:bg-white/80 hover:border-orange-200 focus:border-orange-400 transition-all cursor-pointer shadow-sm"
                  >
                    <option value="normal">Normal</option>
                    <option value="deep-think">Deep Think</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-hover:text-orange-500 transition-colors" size={14} />
                </div>

                <div className="relative group">
                  <select
                    value={chatModel}
                    onChange={(e) => setChatModel(e.target.value)}
                    className="appearance-none bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl pl-4 pr-8 py-1.5 text-xs font-semibold text-gray-700 outline-none hover:bg-white/80 hover:border-orange-200 focus:border-orange-400 transition-all cursor-pointer shadow-sm"
                  >
                    <option value="general">General</option>
                    <option value="ans-key-generator">Ans Key Generator</option>
                    <option value="question-paper-gen">Question Paper Gen</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-hover:text-orange-500 transition-colors" size={14} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* {messages.length == 0 && (
            <div className="flex gap-4 mt-4">
              <button className="bg-black/70 whitespace-nowrap text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-black transition">
                <HelpCircle size={16} />
                Help me write
              </button>
              <button className="bg-black/70 whitespace-nowrap text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-black transition">
                <Info size={16} />
                Learn about
              </button>
              <button className="bg-black/70 whitespace-nowrap text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-black transition">
                <Search size={16} />
                Analyze Image
              </button>
              <button className="bg-black/70 whitespace-nowrap text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-black transition">
                <Plus size={16} />
                See More
              </button>
            </div>
          )} */}
      {location.pathname.includes("question-paper-generator") && (
        <div className=" px-6 text-black overflow-y-scroll h-185  scrollbar-hide mt-[-3em]">
          {/* Messages Display (User Prompt & Model Thinking) */}
          <div className="mb-8 w-full max-w-4xl mx-auto space-y-4">
            {generationMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${message.sender === "user"
                    ? "bg-orange-600 text-white rounded-tr-sm"
                    : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm"
                    }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <span className="text-[10px] opacity-70 mt-1 block">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {questionPapers.length === 0 && generationMessages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No question papers generated yet.</p>
            </div>
          )}

          {questionPapers.length > 0 && generationMessages.length > 0 && (
            <div className="flex items-center justify-center h-full">
              <button className="text-gray-500">Ask AI</button>
            </div>
          )}

          {questionPapers.map((paper) => (
            <div
              key={paper.sample}
              className=" bg-white shadow-xl rounded-2xl p-8 mb-10 border border-gray-200"
            >
              <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                Question Paper – Sample {paper.sample}
              </h1>

              {/* Parts Loop */}
              {Object.entries(paper.question_paper).map(([part, questions]) => (
                <div key={part} className="mb-6 ">
                  <h2 className="text-lg font-semibold mb-3 text-indigo-700 uppercase">
                    {part.replace("_", " ")}
                  </h2>

                  <table className="w-full border-collapse border border-gray-300">
                    <thead className="bg-gray-200 text-gray-700 text-sm">
                      <tr>
                        <th className="border border-gray-300 px-3 py-2">
                          Q.No
                        </th>
                        <th className="border border-gray-300 px-3 py-2 text-left">
                          Question
                        </th>
                        <th className="border border-gray-300 px-3 py-2">
                          Marks
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {questions.map((q) => (
                        <tr key={q.qno} className="hover:bg-gray-50">
                          <td className="border border-gray-300 text-center py-2">
                            {q.qno}
                          </td>
                          <td className="border border-gray-300 px-3 py-2">
                            {q.question}
                          </td>
                          <td className="border border-gray-300 text-center py-2">
                            {q.marks}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ))}
        </div>
      )
      }
      {location.pathname.includes("classroom") && <ClassroomDisplay />}
    </div >
  );
}
