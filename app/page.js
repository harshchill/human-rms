import React from 'react';
import SidebarNav from './components/SidebarNav';
import LeaveBalance from './dashboard/LeaveBalance';
import Attendance from './dashboard/Attendance';
import LeaveHistory from './dashboard/LeaveHistory';
import Quickaction from './dashboard/Quickaction';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import dbConnect from '../lib/connectDb';
import User from '../models/user';
import { redirect } from 'next/navigation';
import UserMenu from './components/UserMenu';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect('/login');
  }

  await dbConnect();

  let content = null;
  if (session.user.role === 'admin') {
    const users = await User.find({}, 'name loginID email').lean();
    content = (
      <div>
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <p className="text-slate-500">Welcome, {session.user.name || 'Admin'}</p>
            <UserMenu name={session.user.name} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((u) => (
            <a key={u._id} href={`/users/${u._id}`} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                  {String(u.name || '?').trim().charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-slate-900 font-semibold">{u.name}</p>
                  <p className="text-slate-500 text-sm">{u.loginID || '—'}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  } else {
    const me = await User.findById(session.user.id).lean();
    content = (
      <>
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back, {me?.name || 'Employee'}!</h1>
            <p className="text-slate-500 mt-1">Here is what's happening with your workspace today.</p>
          </div>
          <UserMenu name={me?.name} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <LeaveBalance total={20} remaining={12} />
          <Attendance />
          <div className="bg-white p-6 rounded-2xl border-2 border-orange-100 shadow-sm flex flex-col justify-between h-44">
            <h3 className="text-slate-600 text-sm font-semibold">Employee Info</h3>
            <div>
              <p className="text-slate-900 font-bold text-lg">{me?.loginID || 'ID N/A'}</p>
              <p className="text-xs text-slate-400 mt-1">{me?.email}</p>
            </div>
            <div className="w-full h-1.5 bg-orange-100 rounded-full"></div>
          </div>
          <div className="bg-white p-6 rounded-2xl border-2 border-purple-100 shadow-sm flex flex-col justify-between h-44">
            <h3 className="text-slate-600 text-sm font-semibold">Company</h3>
            <div>
              <p className="text-slate-900 font-bold text-lg">{me?.companyName || '—'}</p>
              <p className="text-xs text-slate-400 mt-1">Phone: {me?.phone || '—'}</p>
            </div>
            <div className="w-full h-1.5 bg-purple-100 rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <LeaveHistory />
          </div>
          <div className="lg:col-span-1">
            <Quickaction />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <SidebarNav />
      <main className="flex-1 ml-64 p-8 lg:p-12">
        {content}
      </main>
    </div>
  );
}
