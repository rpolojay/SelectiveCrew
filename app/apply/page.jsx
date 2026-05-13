"use client";
import { useState } from "react";

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Application submitted! We will contact you soon.");
    // Add your form submission logic here
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ color: "#1a472a" }}>Apply for Cruise Ship Jobs</h1>
      <p>Fill out the form below to start your application.</p>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <div>
          <label>Full Name *</label>
          <input
            type="text"
            required
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>
        
        <div>
          <label>Email *</label>
          <input
            type="email"
            required
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>
        
        <div>
          <label>Phone Number</label>
          <input
            type="tel"
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>
        
        <div>
          <label>Position Interested In</label>
          <select
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
            value={formData.position}
            onChange={(e) => setFormData({...formData, position: e.target.value})}
          >
            <option value="">Select a position</option>
            <option value="photographer">Shipboard Photographer</option>
            <option value="retail">Retail Sales Associate</option>
            <option value="management">Retail Management</option>
          </select>
        </div>
        
        <button type="submit" style={{ background: "#1a472a", color: "white", padding: "12px", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Submit Application
        </button>
      </form>
    </div>
  );
}
