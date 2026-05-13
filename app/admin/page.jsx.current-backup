"use client";
import React, { useState, useEffect } from "react";

export default function AdminDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  useEffect(() => {
    setTimeout(() => {
      setCandidates([]);
      setLoading(false);
    }, 500);
  }, []);

  const stages = [
    "Applied", "Reviewing", "Pre Interview", "Interviewed", 
    "Shortlisted", "Offered", "Placed", "Rejected", "Contact"
  ];

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading candidates...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ background: "#1a472a", padding: "10px 20px", marginBottom: "20px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#ffd700", fontWeight: "bold" }}>⚓ Selective Crew Admin</span>
        <a href="/dashboard" style={{ color: "white", textDecoration: "none" }}>📊 Dashboard</a>
      </div>
      <h1 style={{ color: "#1a472a", marginBottom: "20px" }}>Candidate Pipeline</h1>
      <div style={{ display: "flex", gap: "10px", overflowX: "auto", marginBottom: "20px" }}>
        {stages.map((stage) => (
          <div key={stage} style={{ background: "#f5f5f5", padding: "10px", borderRadius: "5px", minWidth: "100px", textAlign: "center" }}>
            <strong>{stage}</strong>
            <div>{candidates.filter(c => (c.stage || "Applied") === stage).length}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
