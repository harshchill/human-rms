"use client";

import React, { useState } from "react";
// UPDATED IMPORT: We now import from the SAME folder
import AttendanceYearView from "./AttendanceYearView";

const generateMockData = (year) => {
  const data = [];
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  
  for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
    const random = Math.random();
    if (d.getDay() === 0 || d.getDay() === 6) continue; 

    if (random > 0.9) data.push({ date: new Date(d), status: "ABSENT" });
    else if (random > 0.85) data.push({ date: new Date(d), status: "LEAVE" });
    else if (random > 0.8) data.push({ date: new Date(d), status: "HALF_DAY" });
    else data.push({ date: new Date(d), status: "PRESENT" });
  }
  return data;
};

const StatCard = ({ label, value, color, bg }) => (
  <div className={`p-4 rounded-xl shadow-sm border border-gray-100 ${bg}`}>
    <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
    <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
  </div>
);

export default function AttendancePage() {
  const [selectedYear, setSelectedYear] = useState(2025);
  const attendanceData = generateMockData(selectedYear);

  const stats = {
    present: attendanceData.filter((r) => r.status === "PRESENT").length,
    absent: attendanceData.filter((r) => r.status === "ABSENT").length,
    leaves: attendanceData.filter((r) => r.status === "LEAVE").length,
    halfDays: attendanceData.filter((r) => r.status === "HALF_DAY").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Attendance Overview</h1>
          <p className="text-gray-500">Employee ID: #EMP-001</p>
        </div>
        
        <select 
          value={selectedYear} 
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border border-gray-300 rounded-lg px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value={2023}>2023</option>
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Present" value={stats.present} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard label="Total Absent" value={stats.absent} color="text-rose-600" bg="bg-rose-50" />
        <StatCard label="Leaves Taken" value={stats.leaves} color="text-blue-600" bg="bg-blue-50" />
        <StatCard label="Half Days" value={stats.halfDays} color="text-amber-600" bg="bg-amber-50" />
      </div>

      <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div> Present</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-rose-500 rounded-full"></div> Absent</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> Leave</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-400 rounded-full"></div> Half Day</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-100 border border-gray-200 rounded-full"></div> Weekend</div>
      </div>

      <AttendanceYearView year={selectedYear} data={attendanceData} />
    </div>
  );
}