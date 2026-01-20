import React, { useState } from 'react';
import { Plus, Upload, Users, FileText, Settings, ChevronRight, GraduationCap, BookOpen, Download } from 'lucide-react';

export default function ClassroomManagement() {

  const handleAddClassroom = () => {
    setShowAddClassroom(true);
  };

  const handleUploadAnswerKey = (classroomId) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setClassrooms(prev => prev.map(c => 
          c.id === classroomId 
            ? { ...c, answerKey: file.name }
            : c
        ));
      }
    };
    input.click();
  };

  const handleUploadStudentAnswer = (classroomId, studentId) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        alert("Answer sheet uploaded for student. AI grading in progress...");
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Classroom Management</h1>
                <p className="text-sm text-gray-500">Manage classrooms and grade student submissions</p>
              </div>
            </div>
            <button
              onClick={handleAddClassroom}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-5 h-5" />
              Add Classroom
            </button>
          </div>
        </div>
      </div>

      
    </div>
  );
}