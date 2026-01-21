import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Pages/Layout.jsx";
import "./app.css";
import LoginPage from "./component/Login.jsx";
import ProfileSetup from "./component/CreateTeacherProfileModal.jsx";
import CreateTeacherProfileModal from "./component/CreateTeacherProfileModal.jsx";
import CreateTeacherPreferenceModal from "./component/CreateTeacherPreferenceModal.jsx";
import TeacherProfileView from "./component/Profile.jsx";
import ClassroomManagement from "./component/ClassRoom.jsx";
import ClassroomDisplay from "./component/ClassroomDisplay.jsx";
import ImageReorderPopup from "./component/Upload.jsx";
import Chat from "./component/Chat.jsx";

const App = () => {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* <Route path="/" element={<Layout />} /> */}
        <Route path="/generalchat" element={<Layout />} />
        <Route path="/classroom" element={<Layout />} />
        <Route path="/question-paper-generator" element={<Layout />} />
        <Route path="/profile" element={<CreateTeacherProfileModal />} />
        <Route
          path="/teacherpreferences"
          element={<CreateTeacherPreferenceModal />}
        />
        <Route path="/teacherprofileview" element={<TeacherProfileView />} />
        {/* <Route path="/classroom" element={<ClassroomManagement />} />
        <Route path="/classrooms/:id" element={<ClassroomDisplay />} /> */}
        <Route path="/upload" element={<ImageReorderPopup />} />
        <Route >
          <Route path="/classroom" element={<div>Select a classroom</div>} />
          <Route path="classroom/:id" element={<Layout />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
