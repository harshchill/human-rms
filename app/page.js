"use client";
import React from 'react';
import Sidebar from './components/sidebar';
import LeaveBalance from './dashboard/LeaveBalance';
import Attendance from './dashboard/Attendance';
import LeaveHistory from './dashboard/LeaveHistory';
import Quickaction from './dashboard/Quickaction';
import AttendancePage from './Attendance/page';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      
    
      <Sidebar />
      <main className="flex-1 ml-64 p-8 lg:p-12">

        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back, Sarah!
            </h1>
            <p className="text-slate-500 mt-1">Here is what's happening with your workspace today.</p>
          </div>
          
          {/* Profile Avatars (Matching your image) */}
          <div className="flex items-center gap-3">
             <div className="flex -space-x-2">
                <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-200"></div>
                <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-300"></div>
             </div>
             <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg">
               S
             </div>
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <LeaveBalance total={20} remaining={12} />
          <Attendance />
          
          {/* Holiday Card (Styled to match Sarah image) */}
          <div className="bg-white p-6 rounded-2xl border-2 border-orange-100 shadow-sm flex flex-col justify-between h-44">
            <h3 className="text-slate-600 text-sm font-semibold">Upcoming Holidays</h3>
            <div>
              <p className="text-slate-900 font-bold text-lg">Republic Day</p>
              <p className="text-xs text-slate-400 mt-1">Jan 26, 2026</p>
            </div>
            <div className="w-full h-1.5 bg-orange-100 rounded-full"></div>
          </div>

          {/* Tasks Card (Styled to match Sarah image) */}
          <div className="bg-white p-6 rounded-2xl border-2 border-purple-100 shadow-sm flex flex-col justify-between h-44">
            <h3 className="text-slate-600 text-sm font-semibold">Pending Tasks</h3>
            <div>
              <p className="text-slate-900 font-bold text-lg">3 Appraisals</p>
              <p className="text-xs text-slate-400 mt-1">To complete</p>
            </div>
            <div className="w-full h-1.5 bg-purple-100 rounded-full"></div>
          </div>
        </div>

        {/* 4. Bottom Section: History and Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <LeaveHistory />
          </div>
          <div className="lg:col-span-1">
            <Quickaction />
          </div>
        </div>
      </main>
    </div>
  );
}
