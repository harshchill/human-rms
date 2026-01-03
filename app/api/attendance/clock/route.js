import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "../../../../lib/connectDb";
import Attendance from "../../../../models/attendance";

function todayKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  await dbConnect();

  const { action } = await req.json(); // 'in' or 'out'
  const date = todayKey();
  const userId = session.user.id;

  let record = await Attendance.findOne({ userId, date });
  if (!record) {
    record = await Attendance.create({ userId, date });
  }

  if (action === "in") {
    if (record.clockInAt && !record.clockOutAt) {
      return new Response(JSON.stringify({ error: "Already clocked in" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    record.clockInAt = new Date();
    record.clockOutAt = undefined;
  } else if (action === "out") {
    if (!record.clockInAt || record.clockOutAt) {
      return new Response(JSON.stringify({ error: "Not clocked in" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }
    record.clockOutAt = new Date();
    const minutes = Math.floor((record.clockOutAt - record.clockInAt) / 60000);
    record.totalMinutes = (record.totalMinutes || 0) + Math.max(0, minutes);
  } else {
    return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  await record.save();

  return new Response(JSON.stringify({ ok: true, attendance: record }), { status: 200, headers: { "Content-Type": "application/json" } });
}
