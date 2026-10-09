"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function DashboardLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('adminLogs');
    if (stored) {
      setLogs(JSON.parse(stored).reverse());
    }
  }, []);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/dashboard" style={{ color: "#1a472a", textDecoration: "none" }}>? Back to Dashboard</Link>
        <h1 style={{ color: "#1a472a", marginTop: "20px" }}>?? Email Logs</h1>
        <p>History of sent emails</p>
      </div>
      
      {logs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px", background: "#f9f9f9", borderRadius: "10px" }}>
          <p>No emails sent yet.</p>
          <a href="/admin" style={{ color: "#1a472a", textDecoration: "underline" }}>Go to Admin Panel ?</a>
        </div>
      ) : (
        logs.map((log, index) => (
          <div key={index} style={{
            padding: "15px",
            marginBottom: "10px",
            background: "#f9f9f9",
            borderRadius: "8px",
            borderLeft: "4px solid #4caf50"
          }}>
            <div><strong>?? Type:</strong> {log.eventType}</div>
            <div><strong>?? To:</strong> {log.details?.to || 'N/A'}</div>
            <div><strong>?? Template:</strong> {log.details?.template || 'N/A'}</div>
            <div><strong>?? Time:</strong> {new Date(log.timestamp).toLocaleString()}</div>
          </div>
        ))
      )}
    </div>
  );
}
