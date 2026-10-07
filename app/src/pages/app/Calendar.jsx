import { useMemo, useState } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  isSameDay,
} from "date-fns";
import { enUS } from "date-fns/locale";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "../../style/calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const today = new Date();
const sessionDate = (day, hours, minutes = 0) => new Date(today.getFullYear(), today.getMonth(), day, hours, minutes);

const initialSessions = [
  {
    id: 1,
    title: "React Components",
    start: sessionDate(2, 10),
    end: new Date(2026, 8, 12, 11, 30),
    type: "learning",
    category: "Frontend",
  },
  {
    id: 2,
    title: "JavaScript Quiz",
    start: sessionDate(5, 18),
    end: new Date(2026, 8, 15, 18, 30),
    type: "quiz",
    category: "JavaScript",
  },
  {
    id: 3,
    title: "MongoDB Review",
    start: sessionDate(9, 16),
    end: new Date(2026, 8, 18, 17, 0),
    type: "review",
    category: "Backend",
  },
  {
    id: 4,
    title: "API Architecture",
    start: sessionDate(13, 14),
    end: new Date(2026, 8, 22, 15, 30),
    type: "project",
    category: "Full Stack",
  },
  {
    id: 5,
    title: "Node.js Practice",
    start: sessionDate(18, 17),
    end: new Date(2026, 8, 25, 18, 30),
    type: "learning",
    category: "Backend",
  },
  {
    id: 6,
    title: "Weekly Review",
    start: sessionDate(24, 19),
    end: new Date(2026, 8, 28, 20, 0),
    type: "review",
    category: "Progress",
  },
];

function Calendar() {
  const [sessions, setSessions] = useState(initialSessions);

  const [selectedDate, setSelectedDate] = useState(today);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newSession, setNewSession] = useState({
    title: "",
    time: "10:00",
    duration: "60",
    type: "learning",
    category: "Frontend",
  });

  const selectedSessions = useMemo(
    () =>
      sessions.filter((session) =>
        isSameDay(session.start, selectedDate)
      ),
    [sessions, selectedDate]
  );

  const upcomingSessions = useMemo(() => {
    return [...sessions]
      .filter((session) => session.start >= selectedDate)
      .sort((a, b) => a.start - b.start)
      .slice(0, 3);
  }, [sessions, selectedDate]);

  const eventPropGetter = (event) => {
    return {
      className: `calendar-event event-${event.type}`,
    };
  };

  const dayPropGetter = (date) => {
    const hasSession = sessions.some((session) =>
      isSameDay(session.start, date)
    );

    const isSelected = isSameDay(date, selectedDate);

    return {
      className: [
        hasSession ? "has-session" : "",
        isSelected ? "selected-day" : "",
      ]
        .filter(Boolean)
        .join(" "),
    };
  };

  // Click empty day
  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
    setNewSession({
      title: "",
      time: "10:00",
      duration: "60",
      type: "learning",
      category: "Frontend",
    });
    setIsModalOpen(true);
  };

  // Click existing session
  const handleSelectEvent = (event) => {
    setSelectedDate(event.start);
  };

  const handleAddSession = (event) => {
    event.preventDefault();

    if (!newSession.title.trim()) return;

    const [hours, minutes] = newSession.time
      .split(":")
      .map(Number);

    const start = new Date(selectedDate);
    start.setHours(hours, minutes, 0, 0);

    const end = new Date(
      start.getTime() + Number(newSession.duration) * 60000
    );

    const session = {
      id: Date.now(),
      title: newSession.title,
      start,
      end,
      type: newSession.type,
      category: newSession.category,
    };

    setSessions((current) => [...current, session]);

    setIsModalOpen(false);

    setNewSession({
      title: "",
      time: "10:00",
      duration: "60",
      type: "learning",
      category: "Frontend",
    });
  };

  return (
    <section className="calendar-page">

      {/* HEADER */}
      <header className="calendar-header">
        <div>
          <span className="calendar-eyebrow">
            YOUR RHYTHM
          </span>

          <h1>Calendar</h1>

          <p>
            Plan your learning, one day at a time.
          </p>
        </div>

        <div className="calendar-stat">
          <strong>12h 40m</strong>
          <span>Learning this month</span>
        </div>
      </header>

      {/* MAIN CARD */}
      <div className="calendar-card">

        {/* CALENDAR */}
        <div className="calendar-main">

          <div className="calendar-topbar">
            <div>
              <span className="calendar-label">
                LEARNING PLAN
              </span>

              <h2>{format(selectedDate, "MMMM")} <span>{format(selectedDate, "yyyy")}</span></h2>
            </div>

            <div className="calendar-legend">
              <span>
                <i className="legend-dot learning-dot" />
                Learning
              </span>

              <span>
                <i className="legend-dot quiz-dot" />
                Quiz
              </span>

              <span>
                <i className="legend-dot project-dot" />
                Project
              </span>
            </div>
          </div>

          <div className="calendar-wrapper">
            <BigCalendar
              localizer={localizer}
              events={sessions}
              startAccessor="start"
              endAccessor="end"
              defaultView="month"
              views={["month"]}
              date={selectedDate}
              onNavigate={setSelectedDate}
              selectable
              popup
              eventPropGetter={eventPropGetter}
              dayPropGetter={dayPropGetter}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              toolbar
            />
          </div>

          {/* SMALL HINT */}
          <div className="calendar-hint">
            <span>+</span>
            Click an empty day to schedule a learning session
          </div>
        </div>

        {/* SIDEBAR */}
        <aside className="calendar-sidebar">

          <div className="selected-section">

            <span className="calendar-label">
              SELECTED DAY
            </span>

            <div className="selected-date">
              <div className="selected-number">
                {format(selectedDate, "dd")}
              </div>

              <div>
                <h3>
                  {format(selectedDate, "EEEE")}
                </h3>

                <p>
                  {format(selectedDate, "MMMM yyyy")}
                </p>
              </div>
            </div>

            <div className="progress-box">
              <div className="progress-heading">
                <span>Today's progress</span>

                <strong>
                  {selectedSessions.length} / 3
                </strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(
                      selectedSessions.length / 3,
                      1
                    ) * 100}%`,
                  }}
                />
              </div>
            </div>

          </div>

          {/* SESSIONS */}
          <div className="sessions-section">

            <div className="section-heading">
              <span>SESSIONS</span>

              <span className="session-count">
                {selectedSessions.length}
              </span>
            </div>

            {selectedSessions.length > 0 ? (
              selectedSessions.map((session) => (
                <div
                  className={`session-card session-${session.type}`}
                  key={session.id}
                >
                  <div className="session-icon">
                    {session.type === "quiz"
                      ? "?"
                      : session.type === "project"
                      ? "↗"
                      : "●"}
                  </div>

                  <div className="session-info">
                    <span>{session.category}</span>

                    <h4>{session.title}</h4>

                    <p>
                      {format(session.start, "HH:mm")}
                      {" — "}
                      {format(session.end, "HH:mm")}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-session">
                <div>✦</div>

                <h4>Nothing scheduled</h4>

                <p>
                  Click a day to plan your next session.
                </p>
              </div>
            )}

          </div>

          {/* UPCOMING */}
          <div className="upcoming-section">

            <div className="section-heading">
              <span>UP NEXT</span>
            </div>

            {upcomingSessions.map((session) => (
              <button
                className="upcoming-item"
                key={session.id}
                onClick={() =>
                  setSelectedDate(session.start)
                }
              >
                <div className="upcoming-date">
                  <strong>
                    {format(session.start, "dd")}
                  </strong>

                  <span>
                    {format(session.start, "MMM")}
                  </span>
                </div>

                <div>
                  <h4>{session.title}</h4>

                  <p>
                    {format(session.start, "HH:mm")}
                    {" · "}
                    {session.category}
                  </p>
                </div>

                <span className="upcoming-arrow">
                  →
                </span>
              </button>
            ))}

          </div>

          <button
            className="continue-button"
            onClick={() => setIsModalOpen(true)}
          >
            Add learning session
            <span>+</span>
          </button>

        </aside>
      </div>

      {/* =====================================================
          ADD SESSION MODAL
          ===================================================== */}

      {isModalOpen && (
        <div
          className="calendar-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsModalOpen(false);
            }
          }}
        >
          <div className="calendar-modal">

            <button
              className="modal-close"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>

            <span className="calendar-label">
              NEW SESSION
            </span>

            <h2>
              Plan your next step
            </h2>

            <p className="modal-date">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </p>

            <form onSubmit={handleAddSession}>

              <label>
                Session name
                <input
                  type="text"
                  placeholder="e.g. Learn React Hooks"
                  value={newSession.title}
                  onChange={(event) =>
                    setNewSession({
                      ...newSession,
                      title: event.target.value,
                    })
                  }
                  autoFocus
                />
              </label>

              <div className="modal-grid">

                <label>
                  Time
                  <input
                    type="time"
                    value={newSession.time}
                    onChange={(event) =>
                      setNewSession({
                        ...newSession,
                        time: event.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Duration
                  <select
                    value={newSession.duration}
                    onChange={(event) =>
                      setNewSession({
                        ...newSession,
                        duration: event.target.value,
                      })
                    }
                  >
                    <option value="30">30 min</option>
                    <option value="45">45 min</option>
                    <option value="60">1 hour</option>
                    <option value="90">1h 30</option>
                    <option value="120">2 hours</option>
                  </select>
                </label>

              </div>

              <label>
                Session type
                <div className="session-type-picker">

                  <button
                    type="button"
                    className={
                      newSession.type === "learning"
                        ? "type-option active learning-option"
                        : "type-option"
                    }
                    onClick={() =>
                      setNewSession({
                        ...newSession,
                        type: "learning",
                      })
                    }
                  >
                    <span>●</span>
                    Learning
                  </button>

                  <button
                    type="button"
                    className={
                      newSession.type === "quiz"
                        ? "type-option active quiz-option"
                        : "type-option"
                    }
                    onClick={() =>
                      setNewSession({
                        ...newSession,
                        type: "quiz",
                      })
                    }
                  >
                    <span>?</span>
                    Quiz
                  </button>

                  <button
                    type="button"
                    className={
                      newSession.type === "project"
                        ? "type-option active project-option"
                        : "type-option"
                    }
                    onClick={() =>
                      setNewSession({
                        ...newSession,
                        type: "project",
                      })
                    }
                  >
                    <span>↗</span>
                    Project
                  </button>

                </div>
              </label>

              <label>
                Category
                <input
                  type="text"
                  placeholder="e.g. Frontend"
                  value={newSession.category}
                  onChange={(event) =>
                    setNewSession({
                      ...newSession,
                      category: event.target.value,
                    })
                  }
                />
              </label>

              <div className="modal-actions">

                <button
                  type="button"
                  className="modal-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="modal-save"
                >
                  Add session
                  <span>→</span>
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </section>
  );
}

export default Calendar;