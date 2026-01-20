import React, { useState } from "react";
import { Send, Plus, HelpCircle, Info, Search } from "lucide-react";
import chatlogo from "../assets/chatlogo.png";
import Sendicon from "../assets/send.svg";
import Voice from "../assets/voice.png";
import Name from "../assets/name.svg";
import ClassroomDisplay from "./ClassroomDisplay";
import { useLocation } from "react-router-dom";

export default function Chat() {
  const location = useLocation();

  // State for chat messages and user input
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const storedData = localStorage.getItem("questionPaper");
  const questionPapers = storedData ? JSON.parse(storedData) : [];

  

  // Handle sending a message
  const handleSendMessage = () => {
    if (input.trim() === "") return; // Prevent empty messages
    const newMessage = { text: input, sender: "user", timestamp: new Date() };
    setMessages([...messages, newMessage]);
    setInput(""); // Clear input
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
      <div className="flex justify-between w-full px-8">
        <img src={Name} alt="Name" />
      </div>

      {location.pathname.includes("generalchat") && (
        <div className="flex flex-col items-center justify-between gap-6 max-w-6xl mx-auto w-full">
          {messages.length == 0 && (
            <>
              <div className="backdrop-blur-md rounded-[30px]">
                <img
                  src={chatlogo}
                  alt="ScoriX Logo"
                  className="w-50 h-50 mx-auto"
                />
              </div>

              <div>
                <h1 className="text-2xl font-semibold text-black">
                  Unleash AI with{" "}
                  <span className="text-orange-600">ScoriX</span> Smarter Ideas
                  <br /> and Insights at your Fingertips
                </h1>
              </div>
            </>
          )}

          <div className="flex-1 w-full overflow-y-auto max-h-[540px] p-4 scrollbar-hide">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 px-5 rounded-2xl ${
                    message.sender === "user"
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
          </div>

          <div
            className={`rounded-4xl p-3 pb-5 flex items-center justify-center ${
              messages.length > 0 ? "fixed bottom-10" : "relative"
            }`}
          >
            <div className="absolute inset-0 rounded-3xl bg-[linear-gradient(90deg,#9BD2F3_0%,#D5CEC7_50%,#F8B676_100%)] opacity-70"></div>
            <div className="relative z-10">
              <div className="bg-white/70 backdrop-blur-md shadow-md p-3 rounded-2xl flex items-center gap-3 w-[600px]">
                <Plus size={18} className="text-gray-600" />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500"
                />
                <img src={Voice} alt="voice" />
                <button onClick={handleSendMessage}>
                  <img src={Sendicon} alt="send" />
                </button>
              </div>
              <div className="flex text-sm text-gray-700 mt-3 justify-between">
                <p>
                  🎉 <span className="font-medium">Code Compare</span> feature
                  added to boost your workflow.
                </p>
                <a
                  href="#"
                  className="text-orange-600 font-semibold hover:underline"
                >
                  Explore Now
                </a>
              </div>
            </div>
          </div>

          {messages.length == 0 && (
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
          )}
        </div>
      )}
      {location.pathname.includes("question-paper-generator") && (
        <div className=" px-6 text-black overflow-y-scroll h-185  scrollbar-hide mt-[-3em]">
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
      )}
      {location.pathname.includes("classroom") && <ClassroomDisplay />}
    </div>
  );
}
