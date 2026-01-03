import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import dbConnect from "../../../lib/connectDb";
import User from "../../../models/user";

export default async function UserProfilePage({ params }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (session.user.role !== "admin") redirect("/");

  const { id } = await params;
  await dbConnect();
  const user = await User.findById(id).lean();
  if (!user) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-semibold">User not found</h1>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <main className="flex-1 p-8 lg:p-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{user.name}</h1>
          <p className="text-slate-500 mt-1">{user.loginID || "ID —"}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200">
            <h2 className="text-slate-800 font-semibold mb-4">Profile</h2>
            <div className="space-y-2 text-sm text-slate-700">
              <p><span className="text-slate-500">Email:</span> {user.email}</p>
              <p><span className="text-slate-500">Role:</span> {user.role}</p>
              <p><span className="text-slate-500">Company:</span> {user.companyName || "—"}</p>
              <p><span className="text-slate-500">Phone:</span> {user.phone || "—"}</p>
              <p><span className="text-slate-500">Joined:</span> {new Date(user.joinedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
