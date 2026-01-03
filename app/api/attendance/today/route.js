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

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  await dbConnect();
  const date = todayKey();
  const userId = session.user.id;
  const record = await Attendance.findOne({ userId, date }).lean();
  return new Response(JSON.stringify({ attendance: record || null }), { status: 200, headers: { "Content-Type": "application/json" } });
}
