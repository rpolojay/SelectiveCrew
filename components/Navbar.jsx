'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '../lib/LanguageContext';
import { t } from '../lib/translations';

const JOB_LINKS = [
  { href: '/jobs',                           label: 'All Open Positions',        sub: 'Browse every current opening' },
  { href: '/apply',                          label: 'Retail Sales Associate',     sub: 'Starboard · Worldwide' },
  { href: '/fast-track-manager',             label: 'Fast Track Manager',         sub: 'Starboard · Leadership role', hot: true },
  { href: '/cruise-ship-photographer-jobs',  label: 'Photographer Jobs',          sub: 'Norwegian Cruise Line' },
  { href: '/fine-jewelry-cruise-ship-jobs', label: 'Fine Jewelry Specialist', sub: 'Diamonds & luxury watches onboard' },
  { href: '/cruise-ship-retail-sales-career',label: 'Retail Sales Career Guide',  sub: 'Commission-driven career info' },
  { href: '/japanese-speakers',              label: 'Japanese Speakers',          sub: 'Asia / Pacific routes' },
  { href: '/cruise-jobs-colombia',            label: 'Jobs in Colombia',           sub: 'Reclutamos en toda Colombia' },
  { href: '/cruise-jobs-peru',                label: 'Jobs in Peru',               sub: 'Reclutamos en todo Peru' },
  { href: '/cruise-jobs-ecuador',             label: 'Jobs in Ecuador',            sub: 'Reclutamos en Ecuador' },
  { href: '/cruise-jobs-chile',               label: 'Jobs in Chile',              sub: 'Reclutamos en Chile' },
  { href: '/cruise-jobs-argentina',           label: 'Jobs in Argentina',          sub: 'Reclutamos en Argentina' },
  { href: '/cruise-jobs-panama',              label: 'Jobs in Panama',             sub: 'Reclutamos en Panama' },
  { href: '/cruise-jobs-dominican-republic',  label: 'Jobs in Dominican Republic',  sub: 'Reclutamos en Rep. Dominicana' },

];

export default function Navbar() {
  const [menuOpen, setMenuOpen]     = useState(false);
  const [jobsOpen, setJobsOpen]     = useState(false);
  const [jobsMobOpen, setJobsMobOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const [isMobile, setIsMobile]     = useState(false);
  const [mounted, setMounted] = useState(false);
  const { lang, setLang } = useLang();
  const tx = t[lang];
  const dropdownRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setJobsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setMenuOpen(false); setJobsOpen(false); }, []);

  const TOP_LINKS = [
    { href: '/blog',      label: tx.nav_blog || 'Blog' },
    { href: '/employers', label: 'LATAM Recruiting' },
{ href: '/remote-staffing', label: 'Hire Remote Talent' },
    { href: '/about',     label: lang === 'es' ? 'Nosotros' : 'About Us' },
    { href: '/documents', label: lang === 'es' ? 'Subir Documentos' : 'Submit Documents', sub: lang === 'es' ? 'Portal de documentos' : 'Secure document portal' },
  { href: '/training',  label: lang === 'es' ? 'Formacion' : 'Training', highlight: true },
  { href: '/resources', label: lang === 'es' ? 'Recursos' : 'Resources' },
  ];

  if (pathname && pathname.startsWith('/portal')) return null;

  // /remote-staffing is for U.S. businesses: hide candidate banner and Jobs menu there.
  const isRemoteStaffing = pathname?.startsWith('/remote-staffing');

  return (
    <>
      <style>{`
        .nav-link { font-size:13px; font-weight:500; color:rgba(255,255,255,0.75); transition:color 0.2s; padding:6px 0; position:relative; text-decoration:none; white-space:nowrap; }
        .nav-link::after { content:''; position:absolute; bottom:0; left:0; right:0; height:1.5px; background:#0d9488; transform:scaleX(0); transform-origin:left; transition:transform 0.2s; }
        .nav-link:hover { color:#fff; }
        .nav-link:hover::after { transform:scaleX(1); }
        .nav-link.hl { color:#14b8a6; font-weight:700; }
        .nav-link.hl:hover { color:#5eead4; }
        .jobs-trigger { display:flex; align-items:center; gap:5px; font-size:13px; font-weight:600; color:#fff; background:rgba(13,148,136,0.15); border:1px solid rgba(13,148,136,0.3); border-radius:8px; padding:7px 14px; cursor:pointer; transition:all 0.2s; white-space:nowrap; }
        .jobs-trigger:hover { background:rgba(13,148,136,0.25); border-color:rgba(13,148,136,0.5); }
        .jobs-trigger.open { background:rgba(13,148,136,0.25); border-color:#0d9488; }
        .dropdown { position:absolute; top:calc(100% + 8px); left:0; background:#0d2240; border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:8px; min-width:320px; box-shadow:0 16px 48px rgba(0,0,0,0.4); z-index:200; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        .dropdown { animation: fadeIn 0.15s ease; }
        .drop-item { display:flex; align-items:center; justify-content:space-between; padding:10px 14px; border-radius:10px; text-decoration:none; transition:background 0.15s; gap:12px; }
        .drop-item:hover { background:rgba(255,255,255,0.06); }
        .drop-item-left { display:flex; flex-direction:column; gap:2px; }
        .drop-item-label { font-size:13px; font-weight:600; color:#f8f4ec; }
        .drop-item-sub { font-size:11px; color:rgba(248,244,236,0.4); }
        .hot-badge { font-size:9px; font-weight:800; background:#ef4444; color:#fff; padding:2px 7px; border-radius:100px; letter-spacing:0.5px; flex-shrink:0; }
        .lang-btn { font-size:11px; font-weight:700; padding:4px 10px; border-radius:20px; border:none; cursor:pointer; font-family:inherit; transition:all 0.2s; }
        .nav-cta { background:#0d9488; color:#fff; padding:9px 20px; border-radius:8px; font-size:13px; font-weight:600; font-family:inherit; transition:background 0.2s; text-decoration:none; display:inline-block; white-space:nowrap; }
        .nav-cta:hover { background:#0f766e; }
        .mob-link { display:flex; align-items:center; padding:14px 0; font-size:15px; font-weight:500; color:rgba(255,255,255,0.85); border-bottom:1px solid rgba(255,255,255,0.07); transition:color 0.2s; text-decoration:none; gap:10px; }
        .mob-link:hover { color:#fff; }
        .mob-link.hl { color:#14b8a6; font-weight:700; }
        .mob-jobs-header { display:flex; align-items:center; justify-content:space-between; padding:14px 0; border-bottom:1px solid rgba(255,255,255,0.07); cursor:pointer; }
        .mob-job-item { display:flex; align-items:center; gap:10px; padding:12px 16px; font-size:14px; color:rgba(255,255,255,0.75); text-decoration:none; border-bottom:1px solid rgba(255,255,255,0.04); transition:color 0.2s; }
        .mob-job-item:hover { color:#fff; }
        .mob-job-item:last-child { border-bottom:none; }
        .hamburger-btn { background:none; border:1px solid rgba(255,255,255,0.15); border-radius:8px; color:#fff; padding:8px 10px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background 0.2s; }
        .hamburger-btn:hover { background:rgba(255,255,255,0.1); }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        .mobile-menu { animation: slideDown 0.2s ease; }
        .chevron { transition:transform 0.2s; }
        .chevron.open { transform: rotate(180deg); }
      `}</style>

      {/* Top info bar */}
      {!isRemoteStaffing && (
      <div style={{background:'linear-gradient(90deg,#0f766e,#0d9488)',padding:'9px 16px',textAlign:'center'}}>
        <p style={{color:'#fff',fontSize:13,fontWeight:600,margin:0,lineHeight:1.4}}>
          {lang==='es' ? 'Nunca cobramos a candidatos — 100% gratis & MLC 2006 aligned · ' : 'We never charge candidates — 100% free & MLC 2006 aligned · '}
          <Link href="/is-selective-crew-legit" style={{color:'#ccfbf1',textDecoration:'underline',fontWeight:700}}>
            {lang==='es' ? 'Por que?' : 'Learn why ->'}
          </Link>
        </p>
      </div>
      )}

      <header style={{
        position:'sticky', top:0, zIndex:100,
        background: scrolled ? 'rgba(10,22,40,0.97)' : '#0a1628',
        borderBottom:'1px solid rgba(255,255,255,0.07)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition:'all 0.3s',
      }}>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 20px',display:'flex',alignItems:'center',justifyContent:'space-between',height:68}}>

          {/* Logo */}
          <Link href="/" style={{display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
            <img src="/selective-logo.png" alt="Selective Crew" style={{height:40,width:'auto',filter:'brightness(0) invert(1)'}} />
          </Link>

          {/* Desktop nav */}
          {mounted && !isMobile && (
            <nav style={{display:'flex',alignItems:'center',gap:24}}>

              {/* Jobs dropdown */}
              {!isRemoteStaffing && (
              <div ref={dropdownRef} style={{position:'relative'}}>
                <button
                  className={`jobs-trigger${jobsOpen?' open':''}`}
                  onClick={()=>setJobsOpen(o=>!o)}
                  aria-expanded={jobsOpen}>
                  {lang==='es'?'Empleos':'Jobs'}
                  <svg className={`chevron${jobsOpen?' open':''}`} width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4l4 4 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {jobsOpen && (
                  <div className="dropdown">
                    {JOB_LINKS.map(item => (
                      <Link key={item.href} href={item.href} className="drop-item" onClick={()=>setJobsOpen(false)}>
                        <div className="drop-item-left">
                          <span className="drop-item-label">{item.label}</span>
                          <span className="drop-item-sub">{item.sub}</span>
                        </div>
                        {item.hot && <span className="hot-badge">HOT</span>}
                      </Link>
                    ))}
                    <div style={{borderTop:'1px solid rgba(255,255,255,0.07)',margin:'8px 0 4px',padding:'8px 14px 0'}}>
                      <Link href="/apply" onClick={()=>setJobsOpen(false)}
                        style={{display:'block',background:'#0d9488',color:'#fff',padding:'10px 14px',borderRadius:8,fontSize:13,fontWeight:700,textAlign:'center',textDecoration:'none'}}>
                        {lang==='es' ? 'Aplicar Gratis' : 'Apply Free'} {'->'}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              )}

              {/* Regular links */}
              {TOP_LINKS.map(l => (
                <Link key={l.href} href={l.href} className={`nav-link${l.highlight?' hl':''}`}>{l.label}</Link>
              ))}
            </nav>
          )}

          {/* Desktop right */}
          {mounted && !isMobile && (
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{display:'flex',background:'rgba(255,255,255,0.08)',borderRadius:20,padding:3,gap:2}}>
                {['en','es'].map(l => (
                  <button key={l} className="lang-btn" onClick={()=>setLang(l)}
                    style={{background:lang===l?'#0d9488':'transparent',color:lang===l?'#fff':'rgba(255,255,255,0.5)'}}>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
              <Link href="/contact" className="nav-cta">{tx.nav_contact || 'Apply Free'}</Link>
            </div>
          )}

          {/* Mobile: lang + hamburger */}
          {mounted && isMobile && (
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{display:'flex',background:'rgba(255,255,255,0.08)',borderRadius:20,padding:3,gap:2}}>
                {['en','es'].map(l => (
                  <button key={l} className="lang-btn" onClick={()=>setLang(l)}
                    style={{background:lang===l?'#0d9488':'transparent',color:lang===l?'#fff':'rgba(255,255,255,0.5)'}}>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
              <button className="hamburger-btn" onClick={()=>setMenuOpen(o=>!o)}
                aria-label={menuOpen?'Close menu':'Open menu'} aria-expanded={menuOpen}>
                {menuOpen ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <line x1="4" y1="4" x2="16" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="16" y1="4" x2="4" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <line x1="2" y1="5" x2="18" y2="5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="2" y1="10" x2="18" y2="10" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="2" y1="15" x2="18" y2="15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {isMobile && menuOpen && (
          <div className="mobile-menu" style={{background:'#0a1628',borderTop:'1px solid rgba(255,255,255,0.08)',padding:'4px 24px 24px',boxShadow:'0 8px 32px rgba(0,0,0,0.4)'}}>

            {/* Jobs expandable section */}
            {!isRemoteStaffing && (
            <div>
              <div className="mob-jobs-header" onClick={()=>setJobsMobOpen(o=>!o)}>
                <span style={{fontSize:15,fontWeight:600,color:'#fff'}}>{lang==='es'?'Empleos':'Jobs'}</span>
                <svg className={`chevron${jobsMobOpen?' open':''}`} width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 5l4 4 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {jobsMobOpen && (
                <div style={{background:'rgba(255,255,255,0.03)',borderRadius:10,marginBottom:4}}>
                  {JOB_LINKS.map(item => (
                    <Link key={item.href} href={item.href} className="mob-job-item" onClick={()=>setMenuOpen(false)}>
                      <span style={{flex:1}}>{item.label}</span>
                      {item.hot && <span className="hot-badge">HOT</span>}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            )}

            {/* Other links */}
            {TOP_LINKS.map(l => (
              <Link key={l.href} href={l.href}
                className={`mob-link${l.highlight?' hl':''}`}
                onClick={()=>setMenuOpen(false)}>
                <span style={{flex:1}}>{l.label}</span>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{opacity:0.3}}>
                  <path d="M5 2l5 5-5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            ))}

            {!isRemoteStaffing && (
            <>
            {/* Apply CTA */}
            <Link href="/apply" onClick={()=>setMenuOpen(false)}
              style={{display:'block',marginTop:20,background:'#0d9488',color:'#fff',padding:'14px',borderRadius:10,fontSize:15,fontWeight:700,textAlign:'center',textDecoration:'none'}}>
              Apply Free {'->'}
            </Link>

            {/* Training CTA */}
            <Link href="/training" onClick={()=>setMenuOpen(false)}
              style={{display:'block',marginTop:10,background:'rgba(201,168,76,0.12)',border:'1px solid rgba(201,168,76,0.3)',color:'#c9a84c',padding:'13px',borderRadius:10,fontSize:14,fontWeight:600,textAlign:'center',textDecoration:'none'}}>
              Free Training Course {'->'}
            </Link>
            </>
            )}

            {/* Social footer */}
            <div style={{marginTop:20,paddingTop:16,borderTop:'1px solid rgba(255,255,255,0.07)',display:'flex',justifyContent:'center',gap:20}}>
              <a href="https://www.facebook.com/selectivecrew" target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:'rgba(255,255,255,0.35)',textDecoration:'none'}}>Facebook</a>
              <a href="https://www.instagram.com/selectivecrew" target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:'rgba(255,255,255,0.35)',textDecoration:'none'}}>Instagram</a>
              <a href="https://wa.me/573224849050" target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:'rgba(255,255,255,0.35)',textDecoration:'none'}}>WhatsApp</a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}







