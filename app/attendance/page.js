import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "../../lib/connectDb";
import User from "../../models/user";
import Attendance from "../../models/attendance";

function formatMinutes(mins = 0) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

export default async function AttendancePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  await dbConnect();
  const me = await User.findById(session.user.id).select("role name").lean();

  if (me.role === "admin") {
    const records = await Attendance.find({}).sort({ createdAt: -1 }).limit(100).populate("userId", "name loginID").lean();
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-6">Attendance (Admin)</h1>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left p-3">Employee</th>
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Clock In</th>
                  <th className="text-left p-3">Clock Out</th>
                  <th className="text-left p-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id} className="border-t border-slate-100">
                    <td className="p-3">{r.userId?.name} <span className="text-slate-400 text-xs">{r.userId?.loginID}</span></td>
                    <td className="p-3">{r.date}</td>
                    <td className="p-3">{r.clockInAt ? new Date(r.clockInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                    <td className="p-3">{r.clockOutAt ? new Date(r.clockOutAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                    <td className="p-3">{formatMinutes(r.totalMinutes)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Employee view
  const myRecords = await Attendance.find({ userId: session.user.id }).sort({ date: -1 }).limit(30).lean();
  const totalWeek = myRecords.slice(0, 7).reduce((acc, r) => acc + (r.totalMinutes || 0), 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Attendance</h1>
          <p className="text-slate-500 mt-1">Hello {me.name}, here is your recent activity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl">
            <p className="text-slate-500 text-sm">Total this week</p>
            <p className="text-2xl font-semibold text-slate-900 mt-1">{formatMinutes(totalWeek)}</p>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-2xl">
            <p className="text-slate-500 text-sm">Days recorded</p>
            <p className="text-2xl font-semibold text-slate-900 mt-1">{myRecords.length}</p>
          </div>
          <div className="bg-white border border-slate-200 p-5 rounded-2xl">
            <p className="text-slate-500 text-sm">Status</p>
            <p className="text-2xl font-semibold text-slate-900 mt-1">{myRecords[0]?.clockInAt && !myRecords[0]?.clockOutAt ? 'Clocked In' : 'Idle'}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Clock In</th>
                <th className="text-left p-3">Clock Out</th>
                <th className="text-left p-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {myRecords.map((r) => (
                <tr key={r._id} className="border-t border-slate-100">
                  <td className="p-3">{r.date}</td>
                  <td className="p-3">{r.clockInAt ? new Date(r.clockInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                  <td className="p-3">{r.clockOutAt ? new Date(r.clockOutAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                  <td className="p-3">{formatMinutes(r.totalMinutes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
