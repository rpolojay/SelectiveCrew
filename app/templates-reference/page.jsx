"use client";
import Link from "next/link";

export default function TemplatesReference() {
  const templates = [
    { key: "starboard_final", name: "Starboard Final Interview", category: "Offer" },
    { key: "ncl_photo", name: "NCL Photographer", category: "Interview" },
    { key: "interview", name: "Interview Invitation", category: "Interview" },
    { key: "offer", name: "Job Offer", category: "Offer" },
    { key: "visa", name: "C1/D Visa", category: "Onboarding" },
    { key: "omnia", name: "Omnia Assessment", category: "Assessment" },
    { key: "shortlisted", name: "Shortlisted", category: "Status" },
    { key: "rejection", name: "Not Selected", category: "Status" }
  ];

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/dashboard" style={{ color: "#1a472a", textDecoration: "none" }}>← Back to Dashboard</Link>
        <h1 style={{ color: "#1a472a", marginTop: "20px" }}>📧 Email Templates Reference</h1>
        <p>Available templates for use in the admin panel email modal</p>
      </div>
      
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "15px",
        marginTop: "20px"
      }}>
        {templates.map(template => (
          <div key={template.key} style={{
            padding: "15px",
            background: "#f9f9f9",
            borderRadius: "8px",
            borderLeft: "4px solid #1a472a"
          }}>
            <div><strong>{template.name}</strong></div>
            <div style={{ fontSize: "12px", color: "#666" }}>Key: {template.key}</div>
            <div style={{ fontSize: "12px", color: "#888", marginTop: "5px" }}>Category: {template.category}</div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: "30px", padding: "15px", background: "#e8f5e9", borderRadius: "8px", textAlign: "center" }}>
        <p>💡 <strong>How to use:</strong> Go to <a href="/admin" style={{ color: "#1a472a" }}>Admin Panel</a> → Click Email on any candidate → Select a template</p>
      </div>
    </div>
  );
}
