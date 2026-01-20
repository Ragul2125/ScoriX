import React, { useEffect, useState } from "react";
import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom";

const ClassList = () => {
  const [classes, setClasses] = useState([]);

  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const colors = [
    "bg-purple-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-rose-500",
    "bg-indigo-500",
  ];

  const getRandomColor = () =>
    colors[Math.floor(Math.random() * colors.length)];

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${backendURL}/api/classrooms`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setClasses((prev) =>
        res.data.map((cls, index) => ({
          ...cls,
          // keep same color if already exists
          color: prev[index]?.color || getRandomColor(),
        }))
      );
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  };

  useEffect(() => {
    fetchClasses(); // initial fetch
  }, []);

  const navigate = useNavigate();
  
  const handleClassClick = (cls) => {
    navigate(`/classroom/${cls._id}`);
    localStorage.setItem("selectedClassroomId", cls._id);
    localStorage.setItem("selectedClassroomName", cls.clsName);
  };
  
  return (
    <div className="flex flex-col gap-3 overflow-y-scroll h-full p-2 scrollbar-hide ">
      <div className="flex-1">
        <Outlet />
      </div>
      {classes.length > 0 ? (
        classes.map((cls) => (
          <div
            key={cls._id}
            onClick={() => handleClassClick(cls)}
            className="flex items-center gap-3 bg-[#1A1A1A] hover:bg-[#2A2A2A] p-3 rounded-2xl cursor-pointer"
          >
            <div
              className={`${cls.color} w-12 h-12 flex items-center justify-center rounded-xl font-bold text-white`}
            >
              {cls.clsName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white font-medium">{cls.clsName}</p>
              <p className="text-gray-400 text-sm">{cls.department}</p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-center py-4">No classrooms found</p>
      )}
    </div>
  );
};

export default ClassList;
