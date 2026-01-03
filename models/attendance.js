import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  date: { type: String, required: true, index: true }, // YYYY-MM-DD
  clockInAt: { type: Date },
  clockOutAt: { type: Date },
  totalMinutes: { type: Number, default: 0 },
  notes: { type: String },
}, { timestamps: true });

AttendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.models?.Attendance || mongoose.model("Attendance", AttendanceSchema);
