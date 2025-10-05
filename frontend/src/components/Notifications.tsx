import { useEffect, useState } from "react";
import api from "../utils/api";

interface NotificationData {
  id?: number;
  message: string;
  created_at?: string;
  submission_id?: number;
  [key: string]: any; // any extra fields
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initial fetch from DB
    const fetchDb = async () => {
      try {
        setLoading(true);
        const res = await api.get<NotificationData[]>("/notifications/?ordering=-created_at");
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to load notifications from DB", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDb();

    // Determine WS URL based on API base URL
    const apiUrl = new URL(api.defaults.baseURL || "http://127.0.0.1:8000/api");
    const wsScheme = apiUrl.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${wsScheme}//${apiUrl.host}/ws/notifications/`;

    const socket = new WebSocket(wsUrl);

    socket.onopen = () => setConnectionStatus("Connected");

    socket.onmessage = (event) => {
      try {
        const data: NotificationData = JSON.parse(event.data);
        setNotifications((prev) => {
          // de-dupe by id if available
          if (data.id) {
            const exists = prev.find((n) => n.id === data.id);
            if (exists) return prev;
          }
          return [data, ...prev]; // prepend newest
        });
      } catch (err) {
        console.error("Failed to parse notification:", err);
      }
    };

    socket.onclose = () => setConnectionStatus("Disconnected");
    socket.onerror = () => setConnectionStatus("Error connecting");

    return () => socket.close();
  }, []);

  return (
    <div
      style={{
        border: "1px solid var(--color-border)",
        padding: "15px",
        borderRadius: "8px",
        maxWidth: "420px",
        background: "var(--color-surface)",
        color: "var(--color-text)",
        boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
      }}
    >
      <h3 style={{ marginBottom: "10px", color: "var(--color-secondary)" }}>Admin Notifications</h3>
      <p style={{ fontSize: "12px", color: "#6b7280" }}>Status: {connectionStatus}</p>
      {loading && (<p style={{ fontSize: "12px", color: "#999" }}>Loading from DB…</p>)}
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button
          className="refresh-button"
          onClick={async () => {
            try {
              setLoading(true);
              const res = await api.get<NotificationData[]>("/notifications/?ordering=-created_at");
              setNotifications(res.data);
            } catch (err) {
              console.error("Refresh notifications failed", err);
            } finally {
              setLoading(false);
            }
          }}
        >🔄 Refresh</button>
        <button
          className="back-button"
          onClick={async () => {
            // mark all as read
            try {
              const res = await api.get<NotificationData[]>("/notifications/?ordering=-created_at");
              const list = res.data;
              await Promise.all(list.map(n => n.id ? api.patch(`/notifications/${n.id}/`, { is_read: true }) : Promise.resolve()));
              const res2 = await api.get<NotificationData[]>("/notifications/?ordering=-created_at");
              setNotifications(res2.data);
            } catch (err) {
              console.error("Mark all as read failed", err);
            }
          }}
        >✓ Mark all as read</button>
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {notifications.length === 0 && (
          <li style={{ color: "#999", fontSize: "14px" }}>No notifications yet</li>
        )}
        {notifications.map((notif, index) => (
          <li
            key={notif.id || index}
            style={{
              marginBottom: "10px",
              padding: "10px",
              background: "#f9f9f9",
              borderRadius: "6px",
              borderLeft: "4px solid #007bff",
            }}
          >
            <strong style={{ color: "var(--color-secondary)" }}>{notif.message}</strong>
            {notif.created_at && (
              <div style={{ fontSize: "12px", color: "#666" }}>
                {new Date(notif.created_at).toLocaleString()}
              </div>
            )}
            {notif.submission_id && (
              <div style={{ fontSize: "12px", color: "#374151" }}>
                Submission ID: {notif.submission_id}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
