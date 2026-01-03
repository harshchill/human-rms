import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "../../../lib/connectDb";
import User from "../../../models/user";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  await dbConnect();
  const user = await User.findById(session.user.id).lean();
  return new Response(JSON.stringify({
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    companyName: user.companyName || "",
    loginID: user.loginID || "",
  }), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  const body = await req.json();
  const { name, phone, companyName } = body || {};
  await dbConnect();
  const update = {};
  if (typeof name === 'string') update.name = name;
  if (typeof phone === 'string') update.phone = phone;
  if (typeof companyName === 'string') update.companyName = companyName;
  await User.findByIdAndUpdate(session.user.id, update, { new: true });
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
}
