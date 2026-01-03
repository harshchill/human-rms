import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "../../../../lib/connectDb";
import Leave from "../../../../models/leave";
import User from "../../../../models/user";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  await dbConnect();
  // Only admins can view all leave requests
  const me = await User.findById(session.user.id).select("role");
  if (!me || me.role !== "admin") return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { "Content-Type": "application/json" } });
  const list = await Leave.find({}).sort({ createdAt: -1 }).populate("userId", "name loginID email").lean();
  return new Response(JSON.stringify({ requests: list }), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  await dbConnect();
  const me = await User.findById(session.user.id).select("role");
  if (!me || me.role !== "admin") return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { "Content-Type": "application/json" } });

  const { id, status } = await req.json();
  if (!id || !["approved", "rejected", "pending"].includes(status)) {
    return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  await Leave.findByIdAndUpdate(id, { status });
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
}
