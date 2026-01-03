"use client";

import React from "react";
import {
  format,
  eachDayOfInterval,
  endOfMonth,
  startOfMonth,
  getDay,
  isSameDay,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
} from "date-fns";
import { clsx } from "clsx";

const getStatusColor = (status) => {
  switch (status) {
    case "PRESENT":
      return "bg-emerald-500 hover:bg-emerald-600";
    case "ABSENT":
      return "bg-rose-500 hover:bg-rose-600";
    case "LEAVE":
      return "bg-blue-500 hover:bg-blue-600";
    case "HALF_DAY":
      return "bg-amber-400 hover:bg-amber-500";
    case "HOLIDAY":
      return "bg-slate-300";
    case "WEEKEND":
      return "bg-slate-100";
    default:
      return "bg-gray-50 text-gray-400";
  }
};

const MonthGrid = ({ month, year, data }) => {
  const startDate = startOfMonth(month);
  const endDate = endOfMonth(month);

  const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });
  const startDayIndex = getDay(startDate);

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">
        {format(month, "MMMM")}
      </h3>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
          <span
            key={day}
            className="text-[10px] text-center text-gray-400 font-medium"
          >
            {day}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {Array.from({ length: startDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="h-6 w-6" />
        ))}

        {daysInMonth.map((day) => {
          const record = data.find((r) => isSameDay(r.date, day));
          const isWeekend = getDay(day) === 0 || getDay(day) === 6;

          let status = record?.status;
          if (!status && isWeekend) status = "WEEKEND";

          return (
            <div
              key={day.toISOString()}
              title={`${format(day, "yyyy-MM-dd")}: ${status || "No Info"}`}
              className={clsx(
                "h-6 w-6 rounded-md flex items-center justify-center text-[10px] cursor-pointer transition-colors",
                getStatusColor(status),
                status === "WEEKEND" ? "text-gray-400" : "text-white"
              )}
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function AttendanceYearView({ year, data }) {
  const months = eachMonthOfInterval({
    start: startOfYear(new Date(year, 0, 1)),
    end: endOfYear(new Date(year, 0, 1)),
  });

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {months.map((month) => (
          <MonthGrid
            key={month.toISOString()}
            month={month}
            year={year}
            data={data}
          />
        ))}
      </div>
    </div>
  );
}
