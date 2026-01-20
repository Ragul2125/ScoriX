import React, { useState } from "react";
import Nav from "../component/Nav.jsx";
import Sidebar from "../component/SideBar.jsx";
import TopNav from "../component/TopNav.jsx";
import QuestionInput from "../component/QuestionInput.jsx";
import Chat from "../component/Chat.jsx";
import Name from "../assets/name.svg";
import { useLocation } from "react-router-dom";

const Layout = () => {
  const location = useLocation();

  const [questionPapers , setQuestionPapers] = useState([]);

  console.log(questionPapers)

  const chatComponent = <Chat questionPapers={questionPapers} />;
  return (
    <div className="w-dvw h-dvh bg-custom-gradient pl-3 pr-3.5 flex justify-between gap-3 rounded-2xl">
      <div className="w-[22%] h-auto bg-nav-gradient rounded-4xl flex justify-between pt-2.5 pb-2.5 pl-2 pr-2">
        <div className="p-3 ">
          <Nav />
        </div>
        <div className="bg-black w-[78%] rounded-4xl text-white">
          <Sidebar />
        </div>
      </div>
      <main className="flex-1 h-dvh rounded-2xl pt-2.5 pb-2.5 flex">
        <div className="w-full bg-white h-auto rounded-4xl p-4 text-white flex  gap-3">
          <div className="w-full">
            <div className="h-15 rounded-3xl">
              <TopNav />
            </div>
            <div className="relative rounded-3xl h-210 w-full flex flex-col pt-6 ">
              <div className="absolute inset-0 rounded-3xl bg-[linear-gradient(90deg,#9BD2F3_0%,#D5CEC7_50%,#F8B676_100%)] opacity-60"></div>
              <div className="relative z-10 ">
                <Chat />
              </div>
            </div>
          </div>
         
          {location.pathname.includes("question-paper-generator") && <QuestionInput setQuestionPapers={setQuestionPapers}/>}
        </div>
      </main>
    </div>
  );
};

export default Layout;
