"use client";
import React, { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function UserMenu({ name = "User" }) {
  const [open, setOpen] = useState(false);
  const initial = String(name || "U").trim().charAt(0).toUpperCase();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {initial}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-lg shadow-md py-2 z-50">
          <Link
            href="/me"
            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            My Profile
          </Link>
          <Link
            href="#"
            className="block px-4 py-2 text-sm text-slate-400 cursor-not-allowed"
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
            }}
          >
            Settings (soon)
          </Link>
          <button
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
