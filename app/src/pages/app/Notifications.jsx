import { useEffect, useState } from "react";
import { Bell, Check, Trash2 } from "lucide-react";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  deleteNotification,
} from "../../services/notificationService";
import "../../style/notifications.css";

function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getNotifications();
      setItems(response?.notifications || response?.data?.notifications || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const read = async (id) => {
    try {
      await markNotificationAsRead(id);
      setItems((current) =>
        current.map((item) =>
          item._id === id ? { ...item, read: true, isRead: true } : item
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update notification.");
    }
  };

  const readAll = async () => {
    try {
      await markAllNotificationsAsRead();
      setItems((current) =>
        current.map((item) => ({ ...item, read: true, isRead: true }))
      );
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update notifications.");
    }
  };

  const remove = async (id) => {
    try {
      await deleteNotification(id);
      setItems((current) => current.filter((item) => item._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete notification.");
    }
  };

  return (
    <main className="notifications-page">
      <header>
        <span>STAY ON TRACK</span>
        <h1>Notifications</h1>
        <p>Updates and reminders from your learning journey.</p>
      </header>

      {loading ? (
        <div className="progress-state">Loading notifications...</div>
      ) : error ? (
        <div className="progress-state progress-state--error">{error}</div>
      ) : (
        <section className="notifications-card">
          <div className="notifications-toolbar">
            <strong>{items.length} notifications</strong>
            {items.some((item) => !(item.isRead ?? item.read)) && (
              <button type="button" onClick={readAll}>
                <Check size={15} /> Mark all read
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="notifications-empty">
              <Bell size={28} />
              <h2>You're all caught up</h2>
              <p>New reminders will appear here.</p>
            </div>
          ) : (
            items.map((item) => (
              <article
                className={`notification-row ${(item.isRead ?? item.read) ? "notification-row--read" : ""}`}
                key={item._id}
              >
                <div className="notification-icon"><Bell size={17} /></div>
                <div>
                  <h2>{item.title || "UrPath update"}</h2>
                  <p>{item.message || item.content || ""}</p>
                  <small>
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : ""}
                  </small>
                </div>
                <div className="notification-actions">
                  {!(item.isRead ?? item.read) && (
                    <button
                      type="button"
                      onClick={() => read(item._id)}
                      aria-label="Mark as read"
                    >
                      <Check size={15} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(item._id)}
                    aria-label="Delete"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      )}
    </main>
  );
}

export default Notifications;
