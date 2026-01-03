import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "../../../lib/connectDb";
import Leave from "../../../models/leave";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  await dbConnect();
  const list = await Leave.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean();
  return new Response(JSON.stringify({ requests: list }), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  const body = await req.json();
  const { type, startDate, endDate, reason } = body || {};
  if (!type || !startDate || !endDate) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
  await dbConnect();
  const reqDoc = await Leave.create({ userId: session.user.id, type, startDate, endDate, reason: reason || "" });
  return new Response(JSON.stringify({ ok: true, id: reqDoc._id }), { status: 201, headers: { "Content-Type": "application/json" } });
}
