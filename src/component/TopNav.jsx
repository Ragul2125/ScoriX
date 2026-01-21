import React, { useState } from "react";
import image from "../assets/topnavimg.png";
import profile from "../assets/profile.svg";
import notification from "../assets/notification.svg";
import CreateTeacherProfileModal from "./CreateTeacherProfileModal.jsx";
import TeacherProfileView from "./Profile.jsx";
import axios from "axios";

const TopNav = () => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isProfileViewOpen, setIsProfileViewOpen] = useState(false);
  const [teacherData, setTeacherData] = useState(null);
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);

  const handleProfileClick = async () => {
    const teacherId = localStorage.getItem("teacherId");

    if (!teacherId) {
      console.warn("No teacherID found in localStorage.");
      setIsProfileModalOpen(true);
      return;
    }

    try {
      setIsCheckingProfile(true);
      const response = await axios.get(
        `http://localhost:5000/api/teacherprofile/${teacherId}`
      );

      console.log(response);


      if (response.data) {
        // ✅ Profile exists → open view modal with data
        setTeacherData(response.data);
        setIsProfileViewOpen(true);
        console.log(teacherData);

      } else {
        // ❌ No profile → open setup modal
        setIsProfileModalOpen(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setIsProfileModalOpen(true);
      } else {
        console.error("Error checking profile:", error);
        alert("Server error while checking your profile.");
      }
    } finally {
      setIsCheckingProfile(false);
    }
  };

  return (
    <div className="flex justify-between p-2">
      <div>
        <img src={image} alt="logo" />
      </div>

      <div className="flex gap-2 items-center">
        {/* <img src={notification} alt="notification" className="w-7 h-7" /> */}

        <img
          src={profile}
          alt="profile"
          className={`w-10 h-10 cursor-pointer ${isCheckingProfile ? "opacity-50 pointer-events-none" : ""
            }`}
          onClick={handleProfileClick}
        />
      </div>

      {/* 🟢 Setup Profile Modal */}
      {isProfileModalOpen && (
        <CreateTeacherProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      {/* 🟢 View Profile Modal */}
      {isProfileViewOpen && teacherData && (
        <TeacherProfileView
          isOpen={isProfileViewOpen}
          onClose={() => setIsProfileViewOpen(false)}
          teacherData={teacherData}
        />
      )}
    </div>
  );
};

export default TopNav;
