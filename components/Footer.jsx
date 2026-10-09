'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '../lib/LanguageContext';
import { t } from '../lib/translations';

export default function Footer() {
  const { lang } = useLang();
  const tx = t[lang];
  const es = lang === 'es';
  const pathname = usePathname();

  if (pathname && pathname.startsWith('/portal')) return null;

  // /remote-staffing is for U.S. businesses: own tagline, no MLC lines, trimmed links.
  const isRemoteStaffing = pathname?.startsWith('/remote-staffing');
  const tagline = isRemoteStaffing
    ? (es ? 'Selective Crew Remote Staffing — talento bilingüe latinoamericano para empresas en EE.UU. desde 2009' : 'Selective Crew Remote Staffing — bilingual Latin American talent for U.S. businesses since 2009')
    : tx.footer_tagline;
  const columns = isRemoteStaffing
    ? [
        { title: tx.footer_company, links: [{href:'/about',label:tx.footer_about},{href:'/contact',label:tx.footer_contact}] },
        { title: tx.footer_legal, links: [{href:'/privacy',label:tx.footer_privacy},{href:'/terms',label:tx.footer_terms}] },
      ]
    : [
        { title: tx.footer_candidates, links: [{href:'/jobs',label:tx.footer_find_jobs},{href:'/talent-pool',label:tx.footer_create_profile},{href:'/training',label:'Training'},{href:'/apply',label:es?'Aplicar':'Apply Now'}] },
        { title: tx.footer_company, links: [{href:'/about',label:tx.footer_about},{href:'/contact',label:tx.footer_contact},{href:'/blog',label:'Blog'},{href:'/employers',label:tx.footer_employers}] },
        { title: tx.footer_legal, links: [{href:'/privacy',label:tx.footer_privacy},{href:'/grievance',label:es?'Política de Quejas':'Grievance Policy'},{href:'/terms',label:tx.footer_terms}] },
      ];

  return (
    <footer style={{background:'#060e1a',color:'#fff',position:'relative',overflow:'hidden'}}>
      <div style={{lineHeight:0,background:'#f8fafc'}}>
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{display:'block',width:'100%',height:60}}>
          <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#060e1a"/>
        </svg>
      </div>
      <div style={{position:'absolute',right:-60,top:60,opacity:0.03,pointerEvents:'none'}}>
        <svg width="360" height="360" viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="200" r="190" stroke="white" strokeWidth="2"/>
          <circle cx="200" cy="200" r="140" stroke="white" strokeWidth="1"/>
          <line x1="200" y1="10" x2="200" y2="390" stroke="white" strokeWidth="1"/>
          <line x1="10" y1="200" x2="390" y2="200" stroke="white" strokeWidth="1"/>
          <polygon points="200,30 190,200 200,185 210,200" fill="white"/>
        </svg>
      </div>
      <div className="container-main" style={{padding:'64px 24px 40px',position:'relative'}}>
        <div style={{display:'grid',gridTemplateColumns:isRemoteStaffing?'2fr 1fr 1fr':'2fr 1fr 1fr 1fr',gap:40,marginBottom:56}}>
          <div>
            <img src="/selective-logo.png" alt="Selective Crew" style={{height:38,width:'auto',filter:'brightness(0) invert(1)',marginBottom:16,opacity:0.9}}/>
            <p style={{fontSize:14,color:'rgba(255,255,255,0.4)',lineHeight:1.8,marginBottom:20,maxWidth:260}}>{tagline}</p>
            <div style={{display:'flex',gap:10}}>
              {[
                {href:'https://www.facebook.com/selectivecrew',label:'f'},
                {href:'https://www.instagram.com/selectivecrew',label:'ig'},
              ].map(s=>(
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  style={{width:36,height:36,borderRadius:8,background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.5)',fontSize:12,fontWeight:700,transition:'all 0.2s',textDecoration:'none'}}
                  onMouseOver={e=>{e.currentTarget.style.background='#0d9488';e.currentTarget.style.color='#fff';}}
                  onMouseOut={e=>{e.currentTarget.style.background='rgba(255,255,255,0.07)';e.currentTarget.style.color='rgba(255,255,255,0.5)';}}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          {columns.map(col=>(
            <div key={col.title}>
              <h4 style={{fontSize:12,fontWeight:700,letterSpacing:1.5,textTransform:'uppercase',color:'#0d9488',marginBottom:18}}>{col.title}</h4>
              <ul style={{listStyle:'none',display:'flex',flexDirection:'column',gap:10}}>
                {col.links.map(l=>(
                  <li key={l.href}>
                    <Link href={l.href} style={{fontSize:14,color:'rgba(255,255,255,0.4)',transition:'color 0.2s'}}
                      onMouseOver={e=>e.currentTarget.style.color='#fff'}
                      onMouseOut={e=>e.currentTarget.style.color='rgba(255,255,255,0.4)'}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{height:1,background:'rgba(255,255,255,0.07)',marginBottom:24}}></div>
        <div style={{display:'flex',flexWrap:'wrap',justifyContent:'space-between',alignItems:'center',gap:16}}>
          <p style={{fontSize:12,color:'rgba(255,255,255,0.25)'}}>© 2026 Selective Crew. All rights reserved. Operado por Raul Enrique Polo Jay.</p>
          {!isRemoteStaffing && (
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:6,height:6,borderRadius:'50%',background:'#0d9488'}}></div>
            <p style={{fontSize:12,color:'rgba(255,255,255,0.25)'}}>MLC 2006 Standards · Licensed Maritime Recruiter · Colombia</p>
          </div>
          )}
        </div>
        {!isRemoteStaffing && (
        <p style={{fontSize:11,color:'rgba(255,255,255,0.15)',marginTop:12}}>{tx.footer_disclaimer}</p>
        )}
      </div>
    </footer>
  );
}
