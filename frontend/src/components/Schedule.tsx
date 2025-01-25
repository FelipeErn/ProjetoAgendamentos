import React, { useState } from "react";
import dayjs from "dayjs";

interface Event {
    eventId: number;
    date: string;
    color: string;
    title: string;
}

const Schedule: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [events] = useState<Event[]>([
        { eventId: 1, date: "2025-01-10", color: "red", title: "Teste" },
        { eventId: 2, date: "2025-01-13", color: "green", title: "Teste" },
        { eventId: 3, date: "2025-01-14", color: "blue", title: "Teste" },
        { eventId: 4, date: "2025-01-24", color: "yellow", title: "Teste" },
    ]);

    const startOfMonth = currentDate.startOf("month");
    const endOfMonth = currentDate.endOf("month");
    const startDay = startOfMonth.startOf("week");
    const endDay = endOfMonth.endOf("week");
    const calendarDays: dayjs.Dayjs[] = [];

    let day = startDay;
    while (day.isBefore(endDay)) {
        calendarDays.push(day);
        day = day.add(1, "day");
    }

    const changeMonth = (direction: "prev" | "next") => {
        setCurrentDate(direction === "prev" ? currentDate.subtract(1, "month") : currentDate.add(1, "month"));
    };

    return (
        <>
            {/* <div className="flex justify-between items-center p-4">
        <button
          onClick={() => changeMonth("prev")}
          className="text-gray-500 hover:text-gray-700"
        >
          &lt; Previous
        </button>
        <h2 className="text-xl font-bold">{currentDate.format("MMMM YYYY")}</h2>
        <button
          onClick={() => changeMonth("next")}
          className="text-gray-500 hover:text-gray-700"
        >
          Next &gt;
        </button>
      </div> */}

            <div className="w-full flex gap-4 px-8 py-2">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((day) => (
                    <div
                        key={day}
                        className="text-end text-sm pr-4 uppercase text-slate-400 h-fit w-[calc(100%/7)]"
                    >
                        {day}
                    </div>
                ))}
            </div>

            <div className="flex-1 grid grid-cols-7 gap-4 px-8">
                {calendarDays.map((day) => {
                    const isCurrentMonth = day.month() === currentDate.month();
                    const isToday = day.isSame(dayjs(), "day");
                    const dayEvents = events.filter((event) =>
                        day.isSame(dayjs(event.date), "day")
                    );

                    return (
                        <div
                            key={day.toString()}
                            className={`p-4 h-[150px] rounded-lg border ${isCurrentMonth ? "bg-white border-slate-100" : "bg-slate-100 border-slate-200"
                                } ${isToday ? "ring-2 ring-blue-400" : ""}`}
                        >
                            <div
                                className={`font-bold ${isToday ? "text-blue-500" : "text-gray-800"
                                    }`}
                            >
                                {day.date()}
                            </div>

                            <div className="mt-2 space-y-1">
                                {dayEvents.map((event, index) => (
                                    <div
                                        key={index}
                                        className={`text-sm px-2 py-1 rounded-lg text-center ${event.color === "red"
                                            ? "bg-red-200 text-red-800"
                                            : event.color === "blue"
                                                ? "bg-blue-200 text-blue-800"
                                                : event.color === "green"
                                                ? "bg-green-200 text-green-800"
                                                : "bg-yellow-200 text-yellow-800"
                                            }`}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default Schedule;
