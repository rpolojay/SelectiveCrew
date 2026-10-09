"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px" }}>
      <div style={{
        background: "#1a472a",
        padding: "15px 20px",
        borderRadius: "10px",
        marginBottom: "30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <span style={{ color: "#ffd700", fontSize: "20px", fontWeight: "bold" }}>?? Selective Crew Dashboard</span>
          <Link href="/admin" style={{ color: "white", textDecoration: "none" }}>? Go to Admin</Link>
          <Link href="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none" }}>View Site</Link>
        </div>
      </div>

      <h1 style={{ color: "#1a472a", marginBottom: "10px" }}>Welcome to Your Dashboard</h1>
      <p style={{ color: "#666", marginBottom: "30px" }}>Overview of your recruitment platform</p>

      <>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "40px"
          }}>
            <div style={{ background: "linear-gradient(135deg, #1a472a, #2d5a3b)", color: "white", padding: "25px", borderRadius: "10px", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>??</div>
              <div style={{ fontSize: "32px", fontWeight: "bold" }}>—</div>
              <div>Total Candidates</div>
            </div>
            
            <div style={{ background: "linear-gradient(135deg, #0d9488, #14b8a6)", color: "white", padding: "25px", borderRadius: "10px", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>?</div>
              <div style={{ fontSize: "32px", fontWeight: "bold" }}>—</div>
              <div>Successful Placements</div>
            </div>
            
            <div style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white", padding: "25px", borderRadius: "10px", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>??</div>
              <div style={{ fontSize: "32px", fontWeight: "bold" }}>—</div>
              <div>Emails Sent</div>
            </div>
            
            <div style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white", padding: "25px", borderRadius: "10px", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "10px" }}>??</div>
              <div style={{ fontSize: "32px", fontWeight: "bold" }}>12</div>
              <div>Templates Available</div>
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px"
          }}>
            <Link href="/admin" style={{ background: "#f9f9f9", padding: "25px", textDecoration: "none", borderRadius: "10px", border: "1px solid #e0e0e0", textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "10px" }}>??</div>
              <div style={{ fontSize: "18px", fontWeight: "bold", color: "#1a472a" }}>Manage Candidates</div>
              <div style={{ fontSize: "14px", color: "#666" }}>View and manage all candidates</div>
            </Link>
            
            <Link href="/admin" style={{ background: "#f9f9f9", padding: "25px", textDecoration: "none", borderRadius: "10px", border: "1px solid #e0e0e0", textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "10px" }}>??</div>
              <div style={{ fontSize: "18px", fontWeight: "bold", color: "#1a472a" }}>Send Emails</div>
              <div style={{ fontSize: "14px", color: "#666" }}>Use templates to email candidates</div>
            </Link>
            
            <Link href="/dashboard/logs" style={{ background: "#f9f9f9", padding: "25px", textDecoration: "none", borderRadius: "10px", border: "1px solid #e0e0e0", textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "10px" }}>??</div>
              <div style={{ fontSize: "18px", fontWeight: "bold", color: "#1a472a" }}>View Logs</div>
              <div style={{ fontSize: "14px", color: "#666" }}>Email sending history</div>
            </Link>
          </div>
      </>
    </div>
  );
}
