"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MyProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", companyName: "", email: "", loginID: "" });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/me");
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        if (mounted) {
          setForm({
            name: data.name || "",
            phone: data.phone || "",
            companyName: data.companyName || "",
            email: data.email || "",
            loginID: data.loginID || "",
          });
        }
      } catch (e) {
        setError("Failed to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [router]);

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, phone: form.phone, companyName: form.companyName })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save");
      }
    } catch (e) {
      setError(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">My Profile</h1>
        {loading ? (
          <div className="text-slate-500">Loading...</div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  className="w-full px-3 py-2 border rounded"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  className="w-full px-3 py-2 border rounded"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  type="tel"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <input
                  className="w-full px-3 py-2 border rounded"
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Employee ID</label>
                <input className="w-full px-3 py-2 border rounded bg-slate-50" value={form.loginID} disabled />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input className="w-full px-3 py-2 border rounded bg-slate-50" value={form.email} disabled />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                type="submit"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded border"
                onClick={() => router.push("/")}
              >
                Back to Dashboard
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
