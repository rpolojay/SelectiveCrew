'use client';
import Link from 'next/link';
import { useLang } from '../../lib/LanguageContext';

export default function AboutPage() {
  const { lang } = useLang();
  const es = lang === 'es';

  const stats = [
    { value:'2009', label:es?'Año de Fundación':'Year Founded' },
    { value:'2,000+', label:es?'Candidatos Colocados':'Candidates Placed' },
    { value:'10+', label:es?'Líneas de Cruceros':'Cruise Line Partners' },
    { value:'11', label:es?'Países en LATAM':'Countries in LATAM' },
  ];

  const values = [
    { icon:'🤝', title:es?'Honestidad Total':'Total Honesty', desc:es?'Nunca cobramos a los candidatos. Siempre hemos sido 100% gratuitos y MLC 2006 Standards desde el primer dia.':'We never charge candidates. We have been 100% free and MLC 2006 Standards since day one.' },
    { icon:'🎯', title:es?'Seleccion Rigurosa':'Rigorous Selection', desc:es?'No enviamos a cualquier candidato. Evaluamos el ingles, la personalidad y la actitud de ventas antes de recomendar.':'We do not send just anyone. We evaluate English, personality, and sales attitude before recommending.' },
    { icon:'🌎', title:es?'Enfoque Latinoamericano':'Latin American Focus', desc:es?'Somos expertos en el talento latinoamericano. Entendemos la cultura, los documentos y los procesos de cada pais.':'We are experts in Latin American talent. We understand the culture, documents, and processes of each country.' },
    { icon:'🚀', title:es?'Acompanamiento Completo':'Full Support', desc:es?'Te acompanamos desde la primera entrevista hasta que subes al barco. Nunca te dejamos sin una actualizacion.':'We guide you from the first interview until you board the ship. We never leave you without an update.' },
  ];

  const timeline = [
    { year:'2009', title:es?'Los Comienzos':'The Beginning', desc:es?'Selective Crew nace en Colombia con una mision clara: conectar el talento latinoamericano con las mejores lineas de cruceros del mundo, de forma gratuita y transparente.':'Selective Crew was born in Colombia with a clear mission: connect Latin American talent with the world\'s best cruise lines, for free and with full transparency.' },
    { year:'2010', title:es?'Primera Alianza con Starboard':'First Partnership with Starboard', desc:es?'Establecemos nuestra primera relacion directa con Starboard Cruise Services, uno de los operadores de tiendas a bordo mas grandes del mundo.':'We established our first direct relationship with Starboard Cruise Services, one of the world\'s largest onboard retail operators.' },
    { year:'2018', title:es?'Expansion a Toda LATAM':'Expansion Across LATAM', desc:es?'Expandimos nuestra operacion a 11 paises de America Latina, construyendo una red de talento sin igual en la industria maritima regional.':'We expanded our operation to 11 countries in Latin America, building an unmatched talent network in the regional maritime industry.' },
    { year:'2023', title:es?'Alianza con NCL':'Partnership with NCL', desc:es?'Anadimos a Norwegian Cruise Line como socio, abriendo nuevas oportunidades en fotografia y ventas para candidatos latinoamericanos.':'We added Norwegian Cruise Line as a partner, opening new opportunities in photography and sales for Latin American candidates.' },
    { year:'2024', title:es?'Alianza con Grand Circle':'Partnership with Grand Circle', desc:es?'Incorporamos a Grand Circle Cruise Line como socio oficial, ampliando oportunidades para candidatos latinoamericanos en cruceros de expedicion y cultura.':'We added Grand Circle Cruise Line as an official partner, expanding opportunities for Latin American candidates in expedition and cultural cruise environments.' },
    { year:'2026', title:es?'Hoy':'Today', desc:es?'Con mas de 2000 candidatos colocados y una plataforma digital moderna, seguimos siendo el puente mas confiable entre el talento latinoamericano y las oportunidades en alta mar.':'With over 2000 candidates placed and a modern digital platform, we remain the most trusted bridge between Latin American talent and opportunities at sea.', current:true },
  ];

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",color:'#0a1628'}}>
      <style>{`
        .val-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:28px;transition:all 0.25s;}
        .val-card:hover{border-color:#99f6e4;transform:translateY(-3px);box-shadow:0 12px 36px rgba(13,148,136,0.08);}
        .partner-card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:32px 40px;text-align:center;transition:all 0.25s;min-width:220px;}
        .partner-card:hover{border-color:#0d9488;transform:translateY(-3px);box-shadow:0 12px 36px rgba(13,148,136,0.1);}
      `}</style>

      <section style={{background:'linear-gradient(160deg,#0a1628 0%,#112240 55%,#0d4a6e 100%)',color:'#fff',padding:'88px 24px 100px',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(circle at 20% 60%, rgba(13,148,136,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(14,77,138,0.15) 0%, transparent 40%)'}}></div>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)',backgroundSize:'60px 60px'}}></div>
        <div className="container-main" style={{position:'relative',textAlign:'center',maxWidth:760}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(13,148,136,0.15)',border:'1px solid rgba(13,148,136,0.3)',borderRadius:100,padding:'6px 16px',marginBottom:24}}>
            <span style={{fontSize:16}}>⚓</span>
            <span style={{fontSize:12,fontWeight:600,color:'#5eead4',letterSpacing:1}}>{es?'QUIENES SOMOS':'ABOUT US'}</span>
          </div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(32px,6vw,52px)',fontWeight:700,lineHeight:1.2,marginBottom:20}}>
            {es?'Conectando el Talento Latinoamericano':'Connecting Latin American Talent'}{' '}
            <span style={{color:'#14b8a6'}}>{es?'con el Mundo':'with the World'}</span>
          </h1>
          <p style={{fontSize:17,color:'rgba(255,255,255,0.6)',lineHeight:1.8,marginBottom:48,maxWidth:560,margin:'0 auto 48px'}}>
            {es?'Desde 2009, Selective Crew ha sido la agencia de reclutamiento maritimo mas confiable de America Latina. 100% gratuita para candidatos. Siempre.':'Since 2009, Selective Crew has been Latin America\'s most trusted maritime recruitment agency. 100% free for candidates. Always.'}
          </p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,maxWidth:720,margin:'0 auto'}}>
            {stats.map(s=>(
              <div key={s.value} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:14,padding:'20px 12px'}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,color:'#14b8a6',marginBottom:4}}>{s.value}</div>
                <div style={{fontSize:12,color:'rgba(255,255,255,0.5)'}}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{position:'absolute',bottom:0,left:0,right:0,lineHeight:0}}>
          <svg viewBox="0 0 1440 50" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{display:'block',width:'100%',height:50}}>
            <path d="M0,25 C360,50 720,0 1080,30 C1260,45 1380,10 1440,25 L1440,50 L0,50 Z" fill="#f8fafc"/>
          </svg>
        </div>
      </section>

      <section style={{padding:'80px 24px',background:'#f8fafc'}}>
        <div className="container-main" style={{maxWidth:960}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:60,alignItems:'center'}}>
            <div>
              <span style={{fontSize:11,fontWeight:700,letterSpacing:2,color:'#0d9488',textTransform:'uppercase',marginBottom:12,display:'block'}}>{es?'Nuestra Mision':'Our Mission'}</span>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(24px,4vw,34px)',fontWeight:700,marginBottom:20,lineHeight:1.3}}>
                {es?'Abrir puertas que de otra forma estarian cerradas':'Opening doors that would otherwise be closed'}
              </h2>
              <p style={{fontSize:15,color:'#475569',lineHeight:1.9,marginBottom:16}}>
                {es?'En America Latina existe un talento extraordinario — personas con energia, bilinguismo, habilidades de ventas y una actitud de trabajo que el mundo necesita ver. El problema siempre ha sido el acceso.':'In Latin America there is extraordinary talent — people with energy, bilingual skills, sales abilities, and a work ethic the world needs to see. The problem has always been access.'}
              </p>
              <p style={{fontSize:15,color:'#475569',lineHeight:1.9,marginBottom:28}}>
                {es?'Selective Crew existe para eliminar esa barrera. Somos el puente directo entre candidatos latinoamericanos y las principales lineas de cruceros del mundo.':'Selective Crew exists to remove that barrier. We are the direct bridge between Latin American candidates and the world\'s leading cruise lines.'}
              </p>
              <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                {[es?'✓ 100% Gratuito':'✓ 100% Free','✓ MLC 2006 Standards',es?'✓ Contratacion Directa':'✓ Direct Hiring'].map(b=>(
                  <span key={b} style={{background:'#f0fdf9',color:'#0f766e',fontSize:13,fontWeight:600,padding:'6px 14px',borderRadius:20,border:'1px solid #99f6e4'}}>{b}</span>
                ))}
              </div>
            </div>
            <div style={{background:'linear-gradient(145deg,#0a1628,#0d4a6e)',borderRadius:20,padding:40,color:'#fff'}}>
              <div style={{width:56,height:56,borderRadius:'50%',background:'rgba(13,148,136,0.2)',border:'1px solid rgba(13,148,136,0.4)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,marginBottom:20}}>⚓</div>
              <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:600,color:'#14b8a6',marginBottom:16}}>{es?'Nuestra Promesa':'Our Promise'}</h3>
              <p style={{fontSize:15,color:'rgba(255,255,255,0.65)',lineHeight:1.9,fontStyle:'italic',marginBottom:24}}>
                {es?'"Nunca cobraremos a un candidato por una oportunidad de trabajo. Es un principio que no negociamos."':'"We will never charge a candidate for a job opportunity. It is a principle we do not negotiate."'}
              </p>
              <div style={{borderTop:'1px solid rgba(255,255,255,0.1)',paddingTop:20,display:'flex',alignItems:'center',gap:12}}>
                <div style={{width:44,height:44,borderRadius:'50%',background:'rgba(240,165,0,0.15)',border:'1px solid rgba(240,165,0,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>👤</div>
                <div>
                  <p style={{fontSize:14,fontWeight:700,color:'#fff'}}>Raul Polo Jay</p>
                  <p style={{fontSize:12,color:'#f0a500'}}>Founder & CEO, Selective Crew</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{padding:'80px 24px',background:'#fff'}}>
        <div className="container-main" style={{maxWidth:960}}>
          <div style={{textAlign:'center',marginBottom:52}}>
            <span style={{fontSize:11,fontWeight:700,letterSpacing:2,color:'#0d9488',textTransform:'uppercase',marginBottom:12,display:'block'}}>{es?'Nuestros Valores':'Our Values'}</span>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(24px,4vw,34px)',fontWeight:700}}>{es?'Por que los candidatos confian en nosotros':'Why candidates trust us'}</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
            {values.map(v=>(
              <div key={v.title} className="val-card">
                <div style={{fontSize:32,marginBottom:14}}>{v.icon}</div>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:600,marginBottom:10,color:'#0a1628'}}>{v.title}</h3>
                <p style={{fontSize:14,color:'#475569',lineHeight:1.8}}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:'80px 24px',background:'#f8fafc'}}>
        <div className="container-main" style={{maxWidth:680}}>
          <div style={{textAlign:'center',marginBottom:52}}>
            <span style={{fontSize:11,fontWeight:700,letterSpacing:2,color:'#0d9488',textTransform:'uppercase',marginBottom:12,display:'block'}}>{es?'Nuestra Historia':'Our Story'}</span>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(24px,4vw,34px)',fontWeight:700}}>{es?'17 anos conectando talento':'17 years connecting talent'}</h2>
          </div>
          <div style={{position:'relative'}}>
            <div style={{position:'absolute',left:25,top:0,bottom:0,width:2,background:'linear-gradient(180deg,#0d9488,rgba(13,148,136,0.1))'}}></div>
            {timeline.map((item)=>(
              <div key={item.year} style={{display:'flex',gap:24,marginBottom:40,position:'relative'}}>
                <div style={{width:52,height:52,borderRadius:'50%',background:item.current?'linear-gradient(135deg,#0d9488,#14b8a6)':'#0a1628',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,flexShrink:0,zIndex:1,boxShadow:item.current?'0 0 0 5px rgba(13,148,136,0.15),0 0 0 9px #f8fafc':'0 0 0 5px #f8fafc',fontFamily:"'DM Sans',sans-serif"}}>
                  {item.year}
                </div>
                <div style={{paddingTop:12}}>
                  <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:600,marginBottom:8,color:'#0a1628'}}>{item.title}</h3>
                  <p style={{fontSize:14,color:'#475569',lineHeight:1.8}}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:'80px 24px',background:'#fff'}}>
        <div className="container-main" style={{maxWidth:860,textAlign:'center'}}>
          <span style={{fontSize:11,fontWeight:700,letterSpacing:2,color:'#0d9488',textTransform:'uppercase',marginBottom:12,display:'block'}}>{es?'Nuestros Socios':'Our Partners'}</span>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(24px,4vw,34px)',fontWeight:700,marginBottom:12}}>{es?'Contratacion directa con los mejores':'Direct hiring with the best'}</h2>
          <p style={{fontSize:15,color:'#64748b',marginBottom:48}}>{es?'Trabajamos directamente con las lineas de cruceros — sin intermediarios, sin tarifas ocultas.':'We work directly with cruise lines — no middlemen, no hidden fees.'}</p>
          <div style={{display:'flex',justifyContent:'center',gap:24,flexWrap:'wrap'}}>
            {[{name:'Starboard Cruise Services',desc:es?'Socio Fundador':'Founding Partner',icon:'⭐',since:'2010'},{name:'Norwegian Cruise Line',desc:es?'Socio Oficial':'Official Partner',icon:'🚢',since:'2023'},{name:'Grand Circle Cruise Line',desc:es?'Socio Oficial':'Official Partner',icon:'🌍',since:'2024'}].map(p=>(
              <div key={p.name} className="partner-card">
                <div style={{width:64,height:64,borderRadius:'50%',background:'linear-gradient(135deg,#f0fdf9,#ccfbf1)',border:'2px solid #99f6e4',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,margin:'0 auto 16px'}}>{p.icon}</div>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600,color:'#0a1628',marginBottom:8}}>{p.name}</h3>
                <span style={{fontSize:11,background:'#f0fdf9',color:'#0f766e',padding:'4px 12px',borderRadius:20,fontWeight:600,border:'1px solid #99f6e4'}}>{p.desc}</span>
                <p style={{fontSize:12,color:'#94a3b8',marginTop:10}}>{es?`Socio desde ${p.since}`:`Partner since ${p.since}`}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:'80px 24px',background:'linear-gradient(160deg,#0a1628,#0d4a6e)',color:'#fff',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'radial-gradient(circle at 30% 50%, rgba(13,148,136,0.12) 0%, transparent 50%)'}}></div>
        <div className="container-main" style={{position:'relative',maxWidth:560}}>
          <div style={{fontSize:48,marginBottom:16}}>⚓</div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(28px,5vw,40px)',fontWeight:700,marginBottom:16}}>{es?'Listo para zarpar?':'Ready to set sail?'}</h2>
          <p style={{fontSize:16,color:'rgba(255,255,255,0.6)',marginBottom:36,lineHeight:1.8}}>
            {es?'Unete a los cientos de profesionales latinoamericanos que ya estan viajando el mundo gracias a Selective Crew.':'Join the hundreds of Latin American professionals already traveling the world thanks to Selective Crew.'}
          </p>
          <div style={{display:'flex',gap:14,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/jobs" style={{background:'#0d9488',color:'#fff',padding:'14px 32px',borderRadius:10,fontWeight:700,fontSize:15,textDecoration:'none',fontFamily:'inherit'}}>{es?'Ver Empleos':'View Jobs'}</Link>
            <Link href="/contact" style={{background:'rgba(255,255,255,0.08)',color:'#fff',border:'1px solid rgba(255,255,255,0.25)',padding:'14px 28px',borderRadius:10,fontWeight:600,fontSize:15,textDecoration:'none',fontFamily:'inherit'}}>{es?'Contactanos':'Contact Us'}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
