'use client';
import { useState } from 'react';
import { useLang } from '../../lib/LanguageContext';
import { posts } from './posts';

const navy = "#0a1628";
const ocean = "#0e4d8a";
const gold = "#f0a500";



const ICONS = {
  Ship: () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2c1.3 0 1.9.5 2.5 1"/><path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.3.7 4.4 1.62 6"/><path d="M2 14l9-4 9 4"/><path d="M12 10V2"/><path d="m7 7 5-5 5 5"/></svg>,
  Wave: () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5s2.5 2 5 2 2.5-2 5-2c1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2c1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2c1.3 0 1.9.5 2.5 1"/></svg>,
  Dollar: () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Camera: () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  Bag: () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  Photo: () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
};

function renderContent(blocks) {
  return blocks.map((block, i) => {
    if (block.type === "h3") return <h3 key={i} style={{ fontSize: 18, fontWeight: 700, color: navy, margin: "28px 0 12px" }}>{block.text}</h3>;
    if (block.type === "li") return <p key={i} style={{ fontSize: 15, color: "#444", lineHeight: 1.8, paddingLeft: 20, marginBottom: 6 }}>• {block.text}</p>;
    return <p key={i} style={{ fontSize: 15, color: "#444", lineHeight: 1.9, marginBottom: 12 }}>{block.text}</p>;
  });
}

function BlogCard({ post, lang, onClick }) {
  const es = lang === 'es';
  const Icon = ICONS[post.icon];
  return (
    <div onClick={onClick}
      style={{ background: "#fff", borderRadius: 18, overflow: "hidden", border: "1px solid #e8eef8", boxShadow: "0 2px 16px rgba(14,77,138,0.06)", cursor: "pointer" }}>
      <div style={{ background: "linear-gradient(135deg, " + navy + " 0%, " + ocean + " 100%)", padding: "32px 24px", textAlign: "center" }}>
        <Icon />
      </div>
      <div style={{ padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 700, background: "#f0f7ff", color: ocean, padding: "4px 10px", borderRadius: 20 }}>
            {es ? post.category_es : post.category_en}
          </span>
          <span style={{ fontSize: 11, color: "#aaa" }}>{post.readTime} read</span>
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: navy, marginBottom: 10, lineHeight: 1.4 }}>
          {es ? post.title_es : post.title_en}
        </h3>
        <p style={{ fontSize: 13, color: "#666", lineHeight: 1.7, marginBottom: 16 }}>
          {es ? post.summary_es : post.summary_en}
        </p>
        <span style={{ fontSize: 13, fontWeight: 700, color: ocean }}>
          {es ? "Leer mas ?" : "Read more ?"}
        </span>
      </div>
    </div>
  );
}

function BlogPost({ post, lang, onBack }) {
  const es = lang === 'es';
  const Icon = ICONS[post.icon] || ICONS['Ship'];
  const content = es ? post.content_es : post.content_en;
  return (
    <div style={{maxWidth:760,margin:'0 auto',padding:'48px 24px',fontFamily:'system-ui,sans-serif'}}>
      <button onClick={onBack} style={{background:'none',border:'none',color:'#0e4d8a',fontSize:14,fontWeight:600,cursor:'pointer',marginBottom:24,padding:0}}>? Back to Blog</button>
      <div style={{fontSize:11,fontWeight:700,letterSpacing:2,color:'#0d9488',textTransform:'uppercase',marginBottom:8}}>{es?post.category_es:post.category_en} · {post.date} · {post.readTime} read</div>
      <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(24px,4vw,38px)',fontWeight:700,color:'#0a1628',lineHeight:1.25,marginBottom:16}}>{es?post.title_es:post.title_en}</h1>
      <p style={{fontSize:16,color:'#64748b',lineHeight:1.7,marginBottom:32,borderBottom:'1px solid #e8eef8',paddingBottom:32}}>{es?post.summary_es:post.summary_en}</p>
      <div>{content.map((block,i)=>(
        block.type==='h3'?<h2 key={i} style={{fontSize:20,fontWeight:700,color:'#0a1628',margin:'28px 0 12px',fontFamily:"'Playfair Display',serif"}}>{block.text}</h2>:
        block.type==='li'?<div key={i} style={{display:'flex',gap:8,marginBottom:8,fontSize:15,color:'#374151',lineHeight:1.7}}><span style={{color:'#0d9488',flexShrink:0}}>?</span>{block.text}</div>:
        <p key={i} style={{fontSize:15,color:'#374151',lineHeight:1.85,marginBottom:16}}>{block.text}</p>
      ))}</div>
      <div style={{marginTop:48,background:'#f0f7ff',borderRadius:16,padding:'28px 24px',textAlign:'center'}}>
        <p style={{fontSize:15,fontWeight:700,color:'#0a1628',marginBottom:8}}>{es?'Listo para empezar?':'Ready to start?'}</p>
        <a href="/apply" style={{display:'inline-block',background:'#0d9488',color:'#fff',padding:'12px 28px',borderRadius:10,fontSize:14,fontWeight:700,textDecoration:'none'}}>{es?'Aplicar Ahora — Gratis':'Apply Now — Free'}</a>
      </div>
    </div>
  );
}

export default function BlogPage() {
  const { lang } = useLang();
  const es = lang === 'es';
  const [selectedPost, setSelectedPost] = useState(null);

  if (selectedPost) {
    return <BlogPost post={selectedPost} lang={lang} onBack={() => setSelectedPost(null)} />;
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif" }}>
      <section style={{ background: "linear-gradient(135deg, " + navy + " 0%, " + ocean + " 100%)", color: "#fff", padding: "80px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: gold, textTransform: "uppercase", marginBottom: 14 }}>Blog</div>
          <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 16 }}>
            {es ? "Tu Guia para Trabajar en Cruceros" : "Your Guide to Working on Cruise Ships"}
          </h1>
          <p style={{ fontSize: 16, color: "#b8d0f0", lineHeight: 1.8 }}>
            {es
              ? "Consejos reales, guias honestas y todo lo que necesitas saber para lanzar tu carrera en el mar."
              : "Real tips, honest guides, and everything you need to know to launch your career at sea."}
          </p>
        </div>
      </section>

      <section style={{ padding: "60px 20px", background: "#f8faff" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
            <div style={{marginBottom:32,background:"linear-gradient(135deg,#0a1628,#1a3a5c)",borderRadius:16,padding:"24px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
              <div>
                <div style={{fontSize:11,fontWeight:700,letterSpacing:2,color:"#c9a84c",textTransform:"uppercase",marginBottom:6}}>Now Hiring</div>
                <div style={{fontSize:18,fontFamily:"Georgia,serif",fontWeight:700,color:"#f8f4ec",marginBottom:4}}>Cruise Ship Photographer Jobs</div>
                <div style={{fontSize:13,color:"rgba(248,244,236,0.6)"}}>Norwegian Cruise Line · Portfolio-based application · Free to apply</div>
              </div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <a href="/cruise-ship-photographer-jobs" style={{background:"#c9a84c",color:"#0a1628",padding:"10px 20px",borderRadius:8,fontSize:13,fontWeight:700,textDecoration:"none",whiteSpace:"nowrap"}}>Apply as Photographer</a>
                <a href="/fast-track-manager" style={{background:"rgba(255,255,255,0.08)",color:"#f8f4ec",padding:"10px 20px",borderRadius:8,fontSize:13,fontWeight:600,textDecoration:"none",border:"1px solid rgba(255,255,255,0.15)",whiteSpace:"nowrap"}}>Fast Track Manager</a>
              </div>
            </div>
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} lang={lang} onClick={() => setSelectedPost(post)} />
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: "60px 20px", background: navy, textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <p style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginBottom: 12 }}>
            {es ? "Listo para dar el salto?" : "Ready to take the leap?"}
          </p>
          <p style={{ fontSize: 15, color: "#b8d0f0", marginBottom: 28 }}>
            {es ? "Aplica hoy y nuestro equipo te contactara en 48 horas." : "Apply today and our team will contact you within 48 hours."}
          </p>
          <a href="/apply" style={{ display: "inline-block", background: gold, color: navy, borderRadius: 14, padding: "16px 40px", fontSize: 16, fontWeight: 800, textDecoration: "none" }}>
            {es ? "Aplicar Ahora ?" : "Apply Now ?"}
          </a>
        </div>
      </section>
    </div>
  );
}



