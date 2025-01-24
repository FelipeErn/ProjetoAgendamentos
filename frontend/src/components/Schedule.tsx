import React, { useState } from "react";

interface Event {
  id: number;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
}

const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`);

const daysOfWeek = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

const Schedule: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({});

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) return;

    setEvents([
      ...events,
      {
        id: events.length + 1,
        title: newEvent.title,
        date: newEvent.date,
        time: newEvent.time,
      } as Event,
    ]);
    setNewEvent({});
    setShowModal(false);
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 p-4">
      <div className="grid grid-cols-8 border border-gray-300">
        <div className="bg-gray-200 p-2"></div>
        {daysOfWeek.map((day) => (
          <div key={day} className="bg-gray-200 p-2 text-center font-semibold">
            {day}
          </div>
        ))}

        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className="border-t border-gray-300 p-2 text-sm text-gray-600">
              {hour}
            </div>

            {daysOfWeek.map((day) => (
              <div
                key={`${day}-${hour}`}
                className="border-t border-l border-gray-300 p-2 relative hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setNewEvent({ time: hour, date: day });
                  setShowModal(true);
                }}
              >
                {events
                  .filter((event) => event.time === hour && event.date === day)
                  .map((event) => (
                    <div
                      key={event.id}
                      className="bg-blue-500 text-white text-xs rounded p-1 absolute top-1 left-1 right-1"
                    >
                      {event.title}
                    </div>
                  ))}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-2">Adicionar Evento</h2>
            <input
              type="text"
              placeholder="Título"
              value={newEvent.title || ""}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="border border-gray-300 rounded-lg p-2 w-full mb-2"
            />
            <input
              type="date"
              value={newEvent.date || ""}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              className="border border-gray-300 rounded-lg p-2 w-full mb-2"
            />
            <input
              type="time"
              value={newEvent.time || ""}
              onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
              className="border border-gray-300 rounded-lg p-2 w-full mb-2"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddEvent}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
