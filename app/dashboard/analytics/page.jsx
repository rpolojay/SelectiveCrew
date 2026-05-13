"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function DashboardAnalytics() {
  const [stats, setStats] = useState({
    totalEmails: 0,
    templatesUsed: {}
  });

  useEffect(() => {
    const logs = JSON.parse(localStorage.getItem('adminLogs') || '[]');
    const templateCount = {};
    
    logs.forEach(log => {
      if (log.details?.template) {
        templateCount[log.details.template] = (templateCount[log.details.template] || 0) + 1;
      }
    });
    
    setStats({
      totalEmails: logs.length,
      templatesUsed: templateCount
    });
  }, []);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <Link href="/dashboard" style={{ color: "#1a472a", textDecoration: "none" }}>← Back to Dashboard</Link>
      <h1 style={{ color: "#1a472a" }}>📈 Analytics Dashboard</h1>
      <p>Recruitment metrics and insights</p>
      
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px",
        marginTop: "30px"
      }}>
        <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "10px" }}>📧</div>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#1a472a" }}>{stats.totalEmails}</div>
          <div>Total Emails Sent</div>
        </div>
        
        <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "10px" }}>📝</div>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#1a472a" }}>{Object.keys(stats.templatesUsed).length}</div>
          <div>Templates Used</div>
        </div>
      </div>
      
      {Object.keys(stats.templatesUsed).length > 0 && (
        <div style={{ marginTop: "30px", background: "#fff", border: "1px solid #e0e0e0", borderRadius: "10px", padding: "20px" }}>
          <h3>Template Usage</h3>
          {Object.entries(stats.templatesUsed).map(([template, count]) => (
            <div key={template} style={{ padding: "10px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between" }}>
              <span>{template}</span>
              <span style={{ fontWeight: "bold", color: "#1a472a" }}>{count} times</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
