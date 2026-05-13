'use client';
import { useState, useRef } from "react";
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB4YY3u9ZBfQr6h5j_zwlYyLh7pQ6drufI",
  authDomain: "studio-6715036493-baccc.firebaseapp.com",
  projectId: "studio-6715036493-baccc",
  storageBucket: "studio-6715036493-baccc.firebasestorage.app",
  messagingSenderId: "36078031878",
  appId: "1:36078031878:web:d1dc9f237cf4a41b265f87"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const COUNTRIES = [
  'Colombia', 'Mexico', 'Chile', 'Argentina', 'Peru',
  'Ecuador', 'Panama', 'Costa Rica', 'Venezuela', 'Uruguay', 'Republica Dominicana'
];

function Input({ label, type = "text", placeholder, required, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1a2744", marginBottom: 6 }}>
        {label} {required && <span style={{ color: "#e85d4a" }}>*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ width: "100%", border: "1.5px solid " + (focused ? "#0e4d8a" : "#dde5f0"), borderRadius: 10, padding: "12px 16px", fontSize: 14, outline: "none", background: "#fff", boxSizing: "border-box", color: "#1a2744" }}
      />
    </div>
  );
}

function FileUploadBox({ label, required, file, onChange }) {
  const inputRef = useRef();
  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1a2744", marginBottom: 6 }}>
        {label} {required && <span style={{ color: "#e85d4a" }}>*</span>}
      </label>
      <div onClick={() => inputRef.current.click()} style={{ border: "2px dashed #c8d6f0", borderRadius: 12, padding: "24px 20px", textAlign: "center", cursor: "pointer", background: file ? "#f0f7ff" : "#fafbff" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>{file ? "✅" : "📄"}</div>
        {file ? (
          <p style={{ fontSize: 13, color: "#0e4d8a", fontWeight: 600 }}>{file.name}</p>
        ) : (
          <>
            <p style={{ fontSize: 13, color: "#0e4d8a", fontWeight: 600 }}>Click to upload file</p>
            <p style={{ fontSize: 11, color: "#999", marginTop: 4 }}>PDF, DOC, DOCX accepted</p>
          </>
        )}
        <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }} onChange={(e) => onChange(e.target.files[0])} />
      </div>
    </div>
  );
}

function VideoLinkField({ number, title, scenario, task, required, value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ background: "#f7f9ff", borderRadius: 14, padding: 20, marginBottom: 24, border: "1px solid #e0e8f5" }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#0e4d8a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>
          {number}
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#1a2744", marginBottom: 4 }}>{title} {required && <span style={{ color: "#e85d4a" }}>*</span>}</p>
          {scenario && <p style={{ fontSize: 12, color: "#666", marginBottom: 6 }}><strong>Scenario:</strong> {scenario}</p>}
          <p style={{ fontSize: 12, color: "#444", lineHeight: 1.6 }}><strong>Task:</strong> {task}</p>
        </div>
      </div>
      <div style={{ background: "#fff8e6", border: "1px solid #fde68a", borderRadius: 8, padding: "8px 12px", marginBottom: 12 }}>
        <p style={{ fontSize: 11, color: "#92400e" }}>Record your video, upload to Google Drive/YouTube/Loom, paste the public link below</p>
      </div>
      <input
        type="url"
        placeholder="https://drive.google.com/... or https://youtube.com/..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ width: "100%", border: "1.5px solid " + (focused ? "#0e4d8a" : "#dde5f0"), borderRadius: 10, padding: "12px 16px", fontSize: 13, outline: "none", background: "#fff", boxSizing: "border-box" }}
      />
    </div>
  );
}

function RadioGroup({ label, options, required, value, onChange }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1a2744", marginBottom: 4 }}>
        {label} {required && <span style={{ color: "#e85d4a" }}>*</span>}
      </label>
      <p style={{ fontSize: 11, color: "#888", marginBottom: 10, fontStyle: "italic" }}>Mark only one oval.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {options.map((opt) => (
          <label key={opt} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", padding: "10px 14px", borderRadius: 10, border: "1.5px solid " + (value === opt ? "#0e4d8a" : "#e8eef8"), background: value === opt ? "#f0f7ff" : "#fff" }}>
            <input type="radio" name={label} value={opt} checked={value === opt} onChange={() => onChange(opt)} style={{ accentColor: "#0e4d8a" }} />
            <span style={{ fontSize: 13, color: "#1a2744" }}>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function PhotoApplyPage() {
  const [section, setSection] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [cv, setCv] = useState(null);
  const [country, setCountry] = useState("");
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [age21, setAge21] = useState("");
  const [video1, setVideo1] = useState("");
  const [video2, setVideo2] = useState("");
  const [video3, setVideo3] = useState("");
  const [camera, setCamera] = useState("");
  const [studioLighting, setStudioLighting] = useState("");
  const [scheduleAccepted, setScheduleAccepted] = useState(false);
  const [tattoos, setTattoos] = useState("");

  const navy = "#0a1628";
  const ocean = "#0e4d8a";
  const gold = "#f0a500";

  const SECTIONS = [
    { id: 1, label: "Personal Info" },
    { id: 2, label: "Video Interview" },
    { id: 3, label: "Experience" },
  ];

  async function handleSubmit() {
    if (!video3) { setError("Please paste the link for your video answer."); return; }
    if (!scheduleAccepted) { setError("Please confirm you accept the work schedule."); return; }
    setSubmitting(true);
    setError("");

    try {
      await addDoc(collection(db, "applications"), {
        position: "Photographer — NCL",
        fullName,
        email,
        whatsapp,
        country,
        portfolio: portfolio || "",
        age21: age21 || "",
        camera: camera || "",
        studioLighting: studioLighting || "",
        tattoos: tattoos || "",
        scheduleAccepted,
        video1: video1 || "",
        video2: video2 || "",
        video3,
        status: "new",
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    }

    setSubmitting(false);
  }

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "#f4f7fb", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif", padding: 20 }}>
        <div style={{ background: "#fff", borderRadius: 24, padding: 48, maxWidth: 480, width: "100%", textAlign: "center", boxShadow: "0 8px 48px rgba(14,77,138,0.12)" }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: navy, marginBottom: 12 }}>Application Submitted!</h2>
          <p style={{ fontSize: 14, color: "#666", lineHeight: 1.8 }}>
            Thank you, <strong>{fullName}</strong>! We have received your Photographer application. Our recruitment team will review your videos and contact you within 48 hours.
          </p>
          <div style={{ marginTop: 20, background: "#f0f7ff", borderRadius: 12, padding: 14 }}>
            <p style={{ fontSize: 13, color: ocean }}>Confirmation will be sent to <strong>{email}</strong></p>
          </div>
          <a href="/" style={{ display: "inline-block", marginTop: 28, background: ocean, color: "#fff", border: "none", borderRadius: 12, padding: "13px 32px", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>Back to Home</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4fb", fontFamily: "system-ui, sans-serif", padding: "32px 16px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        <div style={{ background: "linear-gradient(135deg, " + navy + " 0%, " + ocean + " 100%)", borderRadius: 20, padding: 32, marginBottom: 20, color: "#fff" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: gold, textTransform: "uppercase", marginBottom: 6 }}>Initial Video Interview Form</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>Photographer — Selective Crew</h1>
          <p style={{ fontSize: 14, fontWeight: 700, color: gold, marginBottom: 16 }}>LAUNCH YOUR CAREER AT SEA: PHOTOGRAPHER</p>
          <p style={{ fontSize: 13, color: "#b8d0f0", lineHeight: 1.7, marginBottom: 16 }}>
            We are looking for "Salespeople with Cameras" to join the Photo Team on board Norwegian Cruise Line (NCL).
          </p>
          <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: gold, marginBottom: 8 }}>THE BENEFITS:</p>
            {["Salary: Base $1,000/month + Commissions.", "Travel: Paid flights to/from the ship.", "Expenses: Visa and Medical costs reimbursed onboard.", "Living: Free accommodation, meals, uniforms, and equipment.", "Career Path: Photographer → Senior → Assistant Manager → Photo Manager."].map((b, i) => (
              <p key={i} style={{ fontSize: 12, color: "#c8dfff", marginBottom: 4 }}>• {b}</p>
            ))}
          </div>
          <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: gold, marginBottom: 8 }}>THE REQUIREMENTS:</p>
            {["Minimum Age: 21+", "Photography experience (Portrait/Event/Wedding).", "Retail/Sales background (Big Plus).", "Fluent English.", "Friendly, outgoing, and eager to learn."].map((r, i) => (
              <p key={i} style={{ fontSize: 12, color: "#c8dfff", marginBottom: 4 }}>• {r}</p>
            ))}
          </div>
          <div style={{ background: "rgba(240,165,0,0.15)", borderRadius: 12, padding: 16, border: "1px solid rgba(240,165,0,0.3)" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: gold, marginBottom: 8 }}>HOW TO APPLY (Video Links Only):</p>
            <p style={{ fontSize: 12, color: "#fde68a", marginBottom: 4 }}>• Do not upload video files.</p>
            <p style={{ fontSize: 12, color: "#fde68a" }}>• Record your videos → Upload to Google Drive/YouTube/Loom → Paste the Link below.</p>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 16, padding: "18px 24px", marginBottom: 20, boxShadow: "0 2px 16px rgba(14,77,138,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {SECTIONS.map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: section > s.id ? "#22c55e" : section === s.id ? ocean : "#e8eef8", color: section >= s.id ? "#fff" : "#aaa", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>
                    {section > s.id ? "✓" : s.id}
                  </div>
                  <span style={{ fontSize: 10, color: section >= s.id ? ocean : "#bbb", fontWeight: 600 }}>{s.label}</span>
                </div>
                {i < 2 && <div style={{ flex: 1, height: 2, background: section > s.id ? "#22c55e" : "#e8eef8", margin: "0 8px", marginBottom: 18 }} />}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 4px 24px rgba(14,77,138,0.08)" }}>

          {section === 1 && (
            <div>
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: gold, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Section 1 of 3</div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: navy }}>Personal Information</h2>
              </div>
              <Input label="Email Address" type="email" placeholder="your@email.com" required value={email} onChange={setEmail} />
              <Input label="Link to your Online Portfolio" type="url" placeholder="https://your-portfolio.com" value={portfolio} onChange={setPortfolio} />
              <FileUploadBox label="Upload your Official CV / Resume" required={false} file={cv} onChange={setCv} />
              <RadioGroup label="Current Country of Residence" options={COUNTRIES} required value={country} onChange={setCountry} />
              <Input label="Full Name" placeholder="Your full name" required value={fullName} onChange={setFullName} />
              <Input label="WhatsApp Number (with Country Code)" type="tel" placeholder="+1 234 567 8900" required value={whatsapp} onChange={setWhatsapp} />
              <Input label="Are you at least 21 years old?" placeholder="Yes / No" value={age21} onChange={setAge21} />
              {error && <p style={{ color: "#e85d4a", fontSize: 13, marginBottom: 16, background: "#fff5f5", padding: "10px 14px", borderRadius: 8 }}>⚠️ {error}</p>}
              <button
                onClick={() => {
                  if (!email || !fullName || !whatsapp || !country) { setError("Please fill in all required fields."); return; }
                  setError(""); setSection(2);
                }}
                style={{ width: "100%", background: ocean, color: "#fff", border: "none", borderRadius: 12, padding: 15, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                Next: Section 2 →
              </button>
            </div>
          )}

          {section === 2 && (
            <div>
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: gold, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Section 2 of 3</div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: navy }}>English & Personality</h2>
                <p style={{ fontSize: 13, color: "#888", marginTop: 4 }}>Video Links Only — Do not upload files</p>
              </div>
              <VideoLinkField number={1} title="Video 1 — Technical Check"
                scenario="A guest on the open deck at sunset (golden hour) wants a portrait with the ocean as background."
                task="In 60 seconds, explain exactly how you set up your camera (ISO, Aperture, Shutter Speed, Flash) for this shot."
                required={true} value={video1} onChange={setVideo1} />
              <VideoLinkField number={2} title="Video 2 — The Sales Test"
                scenario='A guest in the Photo Gallery says: "I only want one print for $20. The $300 package is too expensive."'
                task="Record a video acting out how you convince the guest to buy the $300 package, selling the value."
                required={true} value={video2} onChange={setVideo2} />
              {error && <p style={{ color: "#e85d4a", fontSize: 13, marginBottom: 16, background: "#fff5f5", padding: "10px 14px", borderRadius: 8 }}>⚠️ {error}</p>}
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => { setError(""); setSection(1); }} style={{ flex: 1, background: "#f0f4fb", color: "#555", border: "none", borderRadius: 12, padding: 14, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>← Back</button>
                <button
                  onClick={() => {
                    if (!video1 || !video2) { setError("Please paste links for both video answers."); return; }
                    setError(""); setSection(3);
                  }}
                  style={{ flex: 2, background: ocean, color: "#fff", border: "none", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                  Next: Section 3 →
                </button>
              </div>
            </div>
          )}

          {section === 3 && (
            <div>
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: gold, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 4 }}>Section 3 of 3</div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: navy }}>Experience & Reality Check</h2>
              </div>
              <VideoLinkField number={3} title="Video 3 — Resilience & Adaptation" scenario={null}
                task="Life on board involves strict rules and sharing a small cabin. Tell us about a time in your past job where you had to adapt to a difficult situation or a difficult coworker. How did you handle it?"
                required={true} value={video3} onChange={setVideo3} />
              <Input label="What camera body and lenses do you own/use?" placeholder="e.g. Sony A7III, 35mm f/1.8, 85mm f/1.4" value={camera} onChange={setCamera} />
              <RadioGroup label="Do you have experience with studio lighting (Strobes/Softboxes)?"
                options={["Yes", "Basic Knowledge", "No"]}
                required={false} value={studioLighting} onChange={setStudioLighting} />
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#1a2744", marginBottom: 4 }}>Do you accept the work schedule?</label>
                <p style={{ fontSize: 11, color: "#888", marginBottom: 10, fontStyle: "italic" }}>Check all that apply.</p>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", padding: "12px 14px", borderRadius: 10, border: "1.5px solid " + (scheduleAccepted ? "#0e4d8a" : "#e8eef8"), background: scheduleAccepted ? "#f0f7ff" : "#fff" }}>
                  <input type="checkbox" checked={scheduleAccepted} onChange={(e) => setScheduleAccepted(e.target.checked)} style={{ accentColor: "#0e4d8a", marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: "#1a2744", lineHeight: 1.6 }}>
                    I understand that I will work 7 days a week for 6-8 months with no full days off. I accept a variable schedule that requires long shifts (10-14 hours) on Sea Days and busy evenings, balanced by lighter shifts on Port Days.
                  </span>
                </label>
              </div>
              <RadioGroup label="Tattoos Policy Check"
                options={["No visible tattoos.", "Yes, but can be covered by long sleeves.", "Yes, on Face/Neck/Hands (Cannot cover)."]}
                required={false} value={tattoos} onChange={setTattoos} />
              {error && <p style={{ color: "#e85d4a", fontSize: 13, marginBottom: 16, background: "#fff5f5", padding: "10px 14px", borderRadius: 8 }}>⚠️ {error}</p>}
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => { setError(""); setSection(2); }} style={{ flex: 1, background: "#f0f4fb", color: "#555", border: "none", borderRadius: 12, padding: 14, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>← Back</button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{ flex: 2, background: gold, color: navy, border: "none", borderRadius: 12, padding: 14, fontSize: 15, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#aaa", marginTop: 20 }}>
          Your information is securely stored and only used for recruitment purposes.
        </p>
      </div>
    </div>
  );
}
