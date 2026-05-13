'use client';
import { useState } from 'react';
import { useLang } from '../../lib/LanguageContext';

const navy = "#0a1628";
const ocean = "#0e4d8a";
const gold = "#f0a500";

const posts = [
  {
    id: "how-to-get-cruise-ship-job",
    icon: "Ship",
    category_en: "Getting Started",
    category_es: "Primeros Pasos",
    date: "March 10, 2026",
    readTime: "6 min",
    title_en: "How to Get a Cruise Ship Job: The Complete Guide for Latin Americans",
    title_es: "Como Conseguir un Trabajo en un Crucero: La Guia Completa para Latinoamericanos",
    summary_en: "Everything you need to know to land your first cruise ship job — from requirements to your first day on board.",
    summary_es: "Todo lo que necesitas saber para conseguir tu primer trabajo en un crucero — desde los requisitos hasta tu primer dia a bordo.",
    content_en: [
      { type: "p", text: "Getting a job on a cruise ship is one of the best career decisions a Latin American professional can make. With salaries of $900-$1,000/month plus commissions, free accommodation, free meals, and the chance to travel the world — it is an opportunity unlike any other." },
      { type: "h3", text: "Who Can Apply?" },
      { type: "p", text: "To work on a cruise ship with Selective Crew, you need to meet these basic requirements:" },
      { type: "li", text: "Minimum age: 21 years old" },
      { type: "li", text: "Intermediate to advanced English (conversational level minimum)" },
      { type: "li", text: "Clean criminal record" },
      { type: "li", text: "Valid passport (or ability to obtain one)" },
      { type: "li", text: "No visible tattoos on face, neck, or hands" },
      { type: "li", text: "Outgoing, service-oriented personality" },
      { type: "h3", text: "The Application Process" },
      { type: "p", text: "1. Apply Online — Fill out our digital interview form at selectivecrew.com/apply. This is your first impression, so take it seriously." },
      { type: "p", text: "2. Video Interview — You will record 3 short videos answering questions about your personality, sales skills, and resilience. Record in a quiet place with good lighting. Dress professionally." },
      { type: "p", text: "3. Document Review — If selected, we will request your passport, criminal background check, and medical certificate." },
      { type: "p", text: "4. Pre-Employment Training — Before boarding, you may receive product knowledge and sales techniques training from the concessionaire." },
      { type: "p", text: "5. Fly to the Ship — Your flight is paid by the company. You will receive joining instructions with your ship name, port, and date." },
      { type: "h3", text: "Pro Tips for a Successful Application" },
      { type: "li", text: "Record your videos in English. Even if your English is not perfect, the effort shows confidence." },
      { type: "li", text: "Smile in your videos. Personality matters as much as experience." },
      { type: "li", text: "Be specific in your sales roleplay. Show actual techniques — do not just say you would be friendly." },
      { type: "li", text: "Have your passport ready. Candidates who already have valid passports move through the process faster." },
      { type: "p", text: "The opportunity is real. Over 2,000 Latin Americans have launched their careers at sea with Selective Crew since 2009. Your turn." },
    ],
    content_es: [
      { type: "p", text: "Conseguir un trabajo en un crucero es una de las mejores decisiones profesionales que puede tomar un latinoamericano. Con salarios de $900-$1,000/mes mas comisiones, alojamiento gratis, comidas gratis y la oportunidad de conocer el mundo — es una oportunidad sin igual." },
      { type: "h3", text: "Quien Puede Aplicar?" },
      { type: "p", text: "Para trabajar en un crucero con Selective Crew, debes cumplir estos requisitos basicos:" },
      { type: "li", text: "Edad minima: 21 anos" },
      { type: "li", text: "Ingles intermedio a avanzado (nivel conversacional minimo)" },
      { type: "li", text: "Antecedentes penales limpios" },
      { type: "li", text: "Pasaporte vigente (o capacidad para obtenerlo)" },
      { type: "li", text: "Sin tatuajes visibles en cara, cuello o manos" },
      { type: "li", text: "Personalidad extrovertida y orientada al servicio" },
      { type: "h3", text: "El Proceso de Aplicacion" },
      { type: "p", text: "1. Aplica en Linea — Llena nuestro formulario de entrevista digital en selectivecrew.com/apply. Esta es tu primera impresion, tomala en serio." },
      { type: "p", text: "2. Entrevista en Video — Grabaras 3 videos cortos respondiendo preguntas sobre tu personalidad, habilidades de ventas y resiliencia. Graba en un lugar tranquilo con buena iluminacion. Vistete profesionalmente." },
      { type: "p", text: "3. Revision de Documentos — Si eres seleccionado, solicitaremos tu pasaporte, antecedentes penales y certificado medico." },
      { type: "p", text: "4. Capacitacion Pre-Empleo — Antes de abordar, podrias recibir entrenamiento en conocimiento de productos y tecnicas de ventas." },
      { type: "p", text: "5. Vuelo al Barco — Tu vuelo es pagado por la empresa. Recibiras instrucciones con el nombre del barco, puerto y fecha." },
      { type: "h3", text: "Consejos para una Aplicacion Exitosa" },
      { type: "li", text: "Graba tus videos en ingles. Aunque no sea perfecto, el esfuerzo demuestra confianza." },
      { type: "li", text: "Sonrie en tus videos. La personalidad importa tanto como la experiencia." },
      { type: "li", text: "Se especifico en el roleplay de ventas. Muestra tecnicas reales." },
      { type: "li", text: "Ten tu pasaporte listo. Los candidatos con pasaporte vigente avanzan mas rapido." },
      { type: "p", text: "La oportunidad es real. Mas de 2,000 latinoamericanos han lanzado sus carreras en el mar con Selective Crew desde 2009. Ahora es tu turno." },
    ],
  },
  {
    id: "life-on-cruise-ship",
    icon: "Wave",
    category_en: "Life On Board",
    category_es: "Vida a Bordo",
    date: "March 5, 2026",
    readTime: "7 min",
    title_en: "What Is Life Really Like on a Cruise Ship? An Honest Guide",
    title_es: "Como Es Realmente la Vida en un Crucero? Una Guia Honesta",
    summary_en: "The truth about living and working on a cruise ship — the good, the challenging, and everything in between.",
    summary_es: "La verdad sobre vivir y trabajar en un crucero — lo bueno, lo dificil y todo lo que esta en medio.",
    content_en: [
      { type: "p", text: "We believe in being honest with our candidates. Life on a cruise ship is extraordinary — but it is also demanding. Here is what you can really expect." },
      { type: "h3", text: "Your Schedule" },
      { type: "p", text: "You will work 10-12 hours per day, 7 days a week, for a contract of 6-8 months. There are no full days off. On sea days, your shift is longer and busier. On port days, you may have a few hours of lighter activity." },
      { type: "h3", text: "Your Cabin" },
      { type: "p", text: "You will share a cabin with one or two coworkers. The cabin is small — similar to a college dorm room. Keep your cabin organized. Respect your cabin mate's schedule. Cleanliness and order are part of your professional image on board." },
      { type: "h3", text: "Food and Meals" },
      { type: "p", text: "All meals are provided for free in the crew mess. Food quality varies by ship, but there is always enough to eat. You will find familiar Latin American dishes on many ships, especially on those with large Latin crews." },
      { type: "h3", text: "The Ports" },
      { type: "p", text: "Depending on your itinerary, you may visit the Caribbean, Alaska, Europe, the Mediterranean, or Southeast Asia. You will not always have time to explore — but when you do, the experience is unforgettable." },
      { type: "h3", text: "The Challenges" },
      { type: "li", text: "Homesickness is real. You will miss your family, friends, and food from home." },
      { type: "li", text: "Conflict with coworkers in a confined space can be stressful. Emotional maturity is essential." },
      { type: "li", text: "The work is physically demanding — you will be on your feet all day." },
      { type: "li", text: "Internet is limited and expensive on many ships." },
      { type: "h3", text: "Who Thrives on a Cruise Ship?" },
      { type: "p", text: "People who thrive are those who are adaptable, positive, hardworking, and genuinely enjoy meeting people from all over the world. If you go in with the right attitude, a cruise ship contract can change your life." },
    ],
    content_es: [
      { type: "p", text: "Creemos en ser honestos con nuestros candidatos. La vida en un crucero es extraordinaria — pero tambien es exigente. Esto es lo que puedes esperar realmente." },
      { type: "h3", text: "Tu Horario" },
      { type: "p", text: "Trabajaras 10-12 horas al dia, 7 dias a la semana, durante un contrato de 6-8 meses. No hay dias libres completos. En los dias de mar, tu turno es mas largo y ocupado." },
      { type: "h3", text: "Tu Cabina" },
      { type: "p", text: "Compartieras una cabina con uno o dos companeros de trabajo. La cabina es pequena — similar a un dormitorio universitario. Mantena tu cabina organizada. Respeta el horario de tu companero." },
      { type: "h3", text: "Comida y Comidas" },
      { type: "p", text: "Todas las comidas se proporcionan gratis en el comedor de tripulacion. La calidad varia segun el barco, pero siempre hay suficiente para comer." },
      { type: "h3", text: "Los Desafios" },
      { type: "li", text: "La nostalgia es real. Extranaras a tu familia, amigos y comida de casa." },
      { type: "li", text: "Los conflictos con companeros en un espacio pequeno pueden ser estresantes." },
      { type: "li", text: "El trabajo es fisicamente exigente — estaras de pie todo el dia." },
      { type: "li", text: "El internet es limitado y costoso en muchos barcos." },
      { type: "h3", text: "Quien Triunfa en un Crucero?" },
      { type: "p", text: "Las personas que triunfan son las adaptables, positivas, trabajadoras y que genuinamente disfrutan conocer gente de todo el mundo." },
    ],
  },
  {
    id: "cruise-ship-salary-guide",
    icon: "Dollar",
    category_en: "Salary & Benefits",
    category_es: "Salario y Beneficios",
    date: "February 28, 2026",
    readTime: "5 min",
    title_en: "Cruise Ship Salary Guide 2026: How Much Can You Really Earn?",
    title_es: "Guia de Salarios en Cruceros 2026: Cuanto Puedes Ganar Realmente?",
    summary_en: "A transparent breakdown of cruise ship salaries, commissions, and total earning potential for Latin American candidates.",
    summary_es: "Un desglose transparente de salarios, comisiones y potencial de ganancias totales para candidatos latinoamericanos.",
    content_en: [
      { type: "h3", text: "Base Salaries" },
      { type: "li", text: "Retail Sales Associate — $900/month base" },
      { type: "li", text: "Fine Jewelry Specialist — $900/month base" },
      { type: "li", text: "Assistant Retail Sales Manager — $900/month base" },
      { type: "li", text: "Photographer (NCL) — $1,000/month base" },
      { type: "h3", text: "Commissions" },
      { type: "p", text: "The real earning potential comes from commissions. Top performers consistently earn an additional $500-$1,500/month on top of their base salary." },
      { type: "h3", text: "Total Monthly Earning Potential" },
      { type: "li", text: "Average performer: $900-$1,200/month" },
      { type: "li", text: "Good performer: $1,200-$1,800/month" },
      { type: "li", text: "Top performer: $1,800-$2,500+/month" },
      { type: "h3", text: "What Your Employer Covers (Zero Cost to You)" },
      { type: "li", text: "Round-trip flights to and from the ship" },
      { type: "li", text: "Accommodation on board (cabin)" },
      { type: "li", text: "All meals (crew cafeteria)" },
      { type: "li", text: "Work uniforms" },
      { type: "li", text: "Full medical insurance" },
      { type: "li", text: "Visa and medical certificate costs reimbursed" },
      { type: "h3", text: "What This Means in Real Terms" },
      { type: "p", text: "Because your accommodation and food are fully covered, almost everything you earn goes directly into your savings. Over a 6-month contract, a good performer can save $6,000-$10,000." },
    ],
    content_es: [
      { type: "h3", text: "Salarios Base" },
      { type: "li", text: "Asociado de Ventas — $900/mes base" },
      { type: "li", text: "Especialista en Joyeria Fina — $900/mes base" },
      { type: "li", text: "Asistente de Gerente de Ventas — $900/mes base" },
      { type: "li", text: "Fotografo (NCL) — $1,000/mes base" },
      { type: "h3", text: "Comisiones" },
      { type: "p", text: "El verdadero potencial de ganancias viene de las comisiones. Los mejores vendedores consistentemente ganan $500-$1,500/mes adicionales sobre su salario base." },
      { type: "h3", text: "Potencial de Ganancias Totales Mensuales" },
      { type: "li", text: "Rendimiento promedio: $900-$1,200/mes" },
      { type: "li", text: "Buen rendimiento: $1,200-$1,800/mes" },
      { type: "li", text: "Rendimiento alto: $1,800-$2,500+/mes" },
      { type: "h3", text: "Lo que Cubre tu Empleador (Sin Costo para Ti)" },
      { type: "li", text: "Vuelos de ida y vuelta al barco" },
      { type: "li", text: "Alojamiento a bordo (cabina)" },
      { type: "li", text: "Todas las comidas (cafeteria de tripulacion)" },
      { type: "li", text: "Uniformes de trabajo" },
      { type: "li", text: "Seguro medico completo" },
      { type: "li", text: "Costos de visa y certificado medico reembolsados" },
      { type: "h3", text: "Lo que Esto Significa en Terminos Reales" },
      { type: "p", text: "Dado que tu alojamiento y comida estan completamente cubiertos, casi todo lo que ganas va directamente a tus ahorros. En un contrato de 6 meses, un buen empleado puede ahorrar $6,000-$10,000." },
    ],
  },
  {
    id: "video-interview-tips",
    icon: "Camera",
    category_en: "Interview Tips",
    category_es: "Consejos de Entrevista",
    date: "February 20, 2026",
    readTime: "5 min",
    title_en: "How to Ace Your Selective Crew Video Interview: 7 Proven Tips",
    title_es: "Como Aprobar tu Entrevista en Video de Selective Crew: 7 Consejos Probados",
    summary_en: "The exact tips our recruitment team uses to evaluate video interviews — and how to make yours stand out.",
    summary_es: "Los consejos exactos que usa nuestro equipo de reclutamiento para evaluar entrevistas en video — y como hacer que la tuya destaque.",
    content_en: [
      { type: "p", text: "Your video interview is the most important part of your application. It is your chance to show us not just what you know — but who you are." },
      { type: "h3", text: "1. Set Up Your Environment" },
      { type: "p", text: "Record in a quiet room with good natural light facing you. Use a clean, neutral background. Avoid recording in your bedroom with clothes visible, in a noisy cafe, or outside in the wind." },
      { type: "h3", text: "2. Dress Professionally" },
      { type: "p", text: "You do not need a suit, but dress as if you are going to a job interview. A clean collared shirt or blouse is ideal." },
      { type: "h3", text: "3. Speak in English" },
      { type: "p", text: "All 3 videos must be recorded in English. We understand your English may not be perfect — and that is okay. Speak slowly and clearly." },
      { type: "h3", text: "4. Look at the Camera" },
      { type: "p", text: "Look directly at the camera lens — not at your own image on the screen. This creates the impression of eye contact, which is critical in sales and hospitality." },
      { type: "h3", text: "5. Smile and Show Energy" },
      { type: "p", text: "We recruit salespeople. Energy, warmth, and enthusiasm are non-negotiable. Take a deep breath before recording and let your personality show." },
      { type: "h3", text: "6. Be Specific in the Sales Roleplay" },
      { type: "p", text: "Do not just say you would be friendly and helpful. Actually act it out. Use specific sales techniques — acknowledge the guest's concern, highlight value over price, ask for the sale." },
      { type: "h3", text: "7. Keep It Concise" },
      { type: "p", text: "Each video should be 60-90 seconds. Practice your answer before recording. You can record multiple takes — only send your best one." },
      { type: "h3", text: "Common Mistakes to Avoid" },
      { type: "li", text: "Recording in portrait mode on your phone (use landscape/horizontal)" },
      { type: "li", text: "Bad lighting that makes your face hard to see" },
      { type: "li", text: "Background noise (TV, family, traffic)" },
      { type: "li", text: "Reading from a script (it looks unnatural)" },
    ],
    content_es: [
      { type: "p", text: "Tu entrevista en video es la parte mas importante de tu aplicacion. Es tu oportunidad de mostrarnos no solo lo que sabes — sino quien eres." },
      { type: "h3", text: "1. Prepara tu Entorno" },
      { type: "p", text: "Graba en una habitacion tranquila con buena luz natural frente a ti. Usa un fondo limpio y neutro. Evita grabar en tu dormitorio, en un cafe ruidoso o afuera con viento." },
      { type: "h3", text: "2. Vistete Profesionalmente" },
      { type: "p", text: "No necesitas un traje, pero vistete como si fueras a una entrevista de trabajo. Una camisa o blusa limpia con cuello es ideal." },
      { type: "h3", text: "3. Habla en Ingles" },
      { type: "p", text: "Los 3 videos deben grabarse en ingles. Entendemos que tu ingles puede no ser perfecto — y eso esta bien. Habla despacio y con claridad." },
      { type: "h3", text: "4. Mira a la Camara" },
      { type: "p", text: "Mira directamente al lente de la camara — no a tu propia imagen en la pantalla. Esto crea la impresion de contacto visual, fundamental en ventas y hospitalidad." },
      { type: "h3", text: "5. Sonrie y Muestra Energia" },
      { type: "p", text: "Reclutamos vendedores. La energia, calidez y entusiasmo son innegociables. Respira profundo antes de grabar y deja que tu personalidad brille." },
      { type: "h3", text: "6. Se Especifico en el Roleplay de Ventas" },
      { type: "p", text: "No solo digas que serias amable. Actualo realmente. Usa tecnicas especificas de ventas — reconoce la preocupacion del cliente, resalta el valor sobre el precio, pide la venta." },
      { type: "h3", text: "7. Se Conciso" },
      { type: "p", text: "Cada video debe durar 60-90 segundos. Practica tu respuesta antes de grabar. Puedes hacer multiples tomas — solo envia la mejor." },
      { type: "h3", text: "Errores Comunes a Evitar" },
      { type: "li", text: "Grabar en modo retrato en tu telefono (usa paisaje/horizontal)" },
      { type: "li", text: "Mala iluminacion que dificulta ver tu rostro" },
      { type: "li", text: "Ruido de fondo (TV, familia, trafico)" },
      { type: "li", text: "Leer de un guion (se ve poco natural)" },
    ],
  },
  {
    id: "retail-sales-cruise-ship",
    icon: "Bag",
    category_en: "Job Guides",
    category_es: "Guias de Empleo",
    date: "February 12, 2026",
    readTime: "6 min",
    title_en: "Retail Sales on Cruise Ships: What the Job is Really Like",
    title_es: "Ventas al por Menor en Cruceros: Como Es el Trabajo Realmente",
    summary_en: "A day in the life of a retail sales associate on a cruise ship — duties, challenges, and why it is one of the best entry-level jobs at sea.",
    summary_es: "Un dia en la vida de un asociado de ventas en un crucero — responsabilidades, desafios y por que es uno de los mejores trabajos de nivel inicial en el mar.",
    content_en: [
      { type: "h3", text: "What You Will Be Selling" },
      { type: "li", text: "Duty-free liquor, perfume, and cosmetics" },
      { type: "li", text: "Fine jewelry (gold, diamonds, tanzanite, gemstones)" },
      { type: "li", text: "Logo merchandise and cruise line souvenirs" },
      { type: "li", text: "Sunglasses, watches, and accessories" },
      { type: "h3", text: "A Typical Day" },
      { type: "p", text: "Your day starts with setting up the shop — arranging displays, cleaning glass counters, restocking shelves. When the shop opens, your job is to engage guests actively. This is not passive retail where you wait for customers to approach you. You approach them, start conversations, build rapport, and guide them toward a purchase." },
      { type: "h3", text: "The Sales Culture" },
      { type: "p", text: "This is a high-performance sales environment. Daily, weekly, and monthly sales targets are tracked. Your commission is directly tied to your performance. The best associates love competition, love people, and treat every guest interaction as an opportunity." },
      { type: "h3", text: "Skills That Make You Stand Out" },
      { type: "li", text: "Genuine warmth and ability to build trust quickly" },
      { type: "li", text: "Knowledge of luxury goods (jewelry, perfume, spirits)" },
      { type: "li", text: "Persistence without being pushy" },
      { type: "li", text: "Strong English communication skills" },
      { type: "h3", text: "Career Path" },
      { type: "p", text: "Retail Sales Associate → Senior Sales Associate → Assistant Retail Manager → Retail Manager → Area Manager. Many of our candidates who started as Sales Associates are now Retail Managers earning $2,500+/month after 3-4 contracts." },
    ],
    content_es: [
      { type: "h3", text: "Que Venderars" },
      { type: "li", text: "Licores, perfumes y cosmeticos duty-free" },
      { type: "li", text: "Joyeria fina (oro, diamantes, tanzanita, gemas)" },
      { type: "li", text: "Mercancia con logo y recuerdos de la linea de cruceros" },
      { type: "li", text: "Gafas de sol, relojes y accesorios" },
      { type: "h3", text: "Un Dia Tipico" },
      { type: "p", text: "Tu dia comienza preparando la tienda — organizando vitrinas, limpiando mostradores de vidrio, reabasteciendo estantes. Cuando la tienda abre, tu trabajo es involucrar activamente a los huespedes. No es venta pasiva donde esperas que los clientes se acerquen. Tu te acercas a ellos, inicias conversaciones y los guias hacia una compra." },
      { type: "h3", text: "La Cultura de Ventas" },
      { type: "p", text: "Este es un entorno de ventas de alto rendimiento. Las metas diarias, semanales y mensuales son monitoreadas. Tu comision esta directamente vinculada a tu desempeno." },
      { type: "h3", text: "Habilidades que te Hacen Destacar" },
      { type: "li", text: "Calidez genuina y capacidad para generar confianza rapidamente" },
      { type: "li", text: "Conocimiento de articulos de lujo (joyeria, perfumes, licores)" },
      { type: "li", text: "Persistencia sin ser agresivo" },
      { type: "li", text: "Fuertes habilidades de comunicacion en ingles" },
      { type: "h3", text: "Trayectoria Profesional" },
      { type: "p", text: "Asociado de Ventas → Asociado Senior → Asistente de Gerente → Gerente de Ventas → Gerente de Area. Muchos de nuestros candidatos que comenzaron como Asociados ahora son Gerentes ganando $2,500+/mes." },
    ],
  },
  {
    id: "photographer-cruise-ship",
    icon: "Photo",
    category_en: "Job Guides",
    category_es: "Guias de Empleo",
    date: "February 1, 2026",
    readTime: "5 min",
    title_en: "Cruise Ship Photographer: The Job That Combines Photography and Sales",
    title_es: "Fotografo en Crucero: El Trabajo que Combina Fotografia y Ventas",
    summary_en: "Why cruise ship photography is the perfect job for photographers who want to travel the world and earn great money.",
    summary_es: "Por que la fotografia en cruceros es el trabajo perfecto para fotografos que quieren viajar por el mundo y ganar buen dinero.",
    content_en: [
      { type: "h3", text: "What Does a Cruise Ship Photographer Do?" },
      { type: "li", text: "Photograph guests at the gangway (embarkation and port arrivals)" },
      { type: "li", text: "Cover formal night portrait sessions in the atrium" },
      { type: "li", text: "Photograph specialty dining and entertainment events" },
      { type: "li", text: "Capture sea day activities and guest candids" },
      { type: "li", text: "Sell photo packages in the Photo Gallery" },
      { type: "p", text: "The last point is critical — you are a salesperson with a camera. Your income depends not just on taking great photos, but on selling them to guests." },
      { type: "h3", text: "Equipment" },
      { type: "p", text: "All professional equipment is provided — cameras, lenses, lighting, computers, and printers. You do not need to bring your own gear." },
      { type: "h3", text: "The Earning Potential" },
      { type: "p", text: "Base salary is $1,000/month. With commissions on photo package sales, strong performers earn $1,500-$2,500/month." },
      { type: "h3", text: "What Makes a Great Cruise Ship Photographer?" },
      { type: "li", text: "They approach guests confidently and naturally" },
      { type: "li", text: "They make guests feel comfortable and excited to be photographed" },
      { type: "li", text: "They upsell photo packages with genuine enthusiasm" },
      { type: "li", text: "They handle rejection gracefully and move on to the next guest" },
      { type: "h3", text: "Career Path" },
      { type: "p", text: "Photographer → Senior Photographer → Assistant Photo Manager → Photo Manager. Photo Managers on large ships can earn $3,000+/month." },
    ],
    content_es: [
      { type: "h3", text: "Que Hace un Fotografo de Crucero?" },
      { type: "li", text: "Fotografiar huespedes en la pasarela (embarque y llegadas a puerto)" },
      { type: "li", text: "Cubrir sesiones de retratos en noches formales" },
      { type: "li", text: "Fotografiar eventos de cenas especiales y entretenimiento" },
      { type: "li", text: "Vender paquetes de fotos en la Galeria de Fotos" },
      { type: "p", text: "El ultimo punto es fundamental — eres un vendedor con camara. Tus ingresos dependen no solo de tomar excelentes fotos, sino de venderlas a los huespedes." },
      { type: "h3", text: "Equipo" },
      { type: "p", text: "Todo el equipo profesional es proporcionado — camaras, lentes, iluminacion, computadoras e impresoras. No necesitas traer tu propio equipo." },
      { type: "h3", text: "El Potencial de Ganancias" },
      { type: "p", text: "El salario base es $1,000/mes. Con comisiones en ventas de paquetes de fotos, los que tienen buen rendimiento ganan $1,500-$2,500/mes." },
      { type: "h3", text: "Trayectoria Profesional" },
      { type: "p", text: "Fotografo → Fotografo Senior → Asistente de Gerente de Foto → Gerente de Foto. Los Gerentes de Foto en barcos grandes pueden ganar $3,000+/mes." },
    ],
  },
];

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
          {es ? "Leer mas →" : "Read more →"}
        </span>
      </div>
    </div>
  );
}

function BlogPost({ post, lang, onBack }) {
  const es = lang === 'es';
  const Icon = ICONS[post.icon];
  const content = es ? post.content_es : post.content_en;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px", fontFamily: "system-ui, sans-serif" }}>
      <button onClick={onBack} style={{ background: "#f0f4fb", border: "none", borderRadius: 10, padding: "10px 20px", fontSize: 13, fontWeight: 600, color: "#555", cursor: "pointer", marginBottom: 32 }}>
        {es ? "← Volver al Blog" : "← Back to Blog"}
      </button>
      <div style={{ background: "linear-gradient(135deg, " + navy + " 0%, " + ocean + " 100%)", borderRadius: 20, padding: "48px 40px", marginBottom: 32, color: "#fff", textAlign: "center" }}>
        <div style={{ marginBottom: 16 }}><Icon /></div>
        <div style={{ fontSize: 11, fontWeight: 700, color: gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>
          {es ? post.category_es : post.category_en}
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.3, marginBottom: 16 }}>
          {es ? post.title_es : post.title_en}
        </h1>
        <div style={{ fontSize: 13, color: "#b8d0f0" }}>{post.date} &bull; {post.readTime} read</div>
      </div>
      <div style={{ background: "#fff", borderRadius: 20, padding: "40px", boxShadow: "0 4px 24px rgba(14,77,138,0.08)", marginBottom: 32 }}>
        {renderContent(content)}
      </div>
      <div style={{ background: "linear-gradient(135deg, " + navy + " 0%, " + ocean + " 100%)", borderRadius: 20, padding: 32, textAlign: "center", color: "#fff" }}>
        <p style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
          {es ? "Listo para Aplicar?" : "Ready to Apply?"}
        </p>
        <p style={{ fontSize: 14, color: "#b8d0f0", marginBottom: 24 }}>
          {es ? "Mas de 2,000 latinoamericanos han lanzado sus carreras con nosotros." : "Over 2,000 Latin Americans have launched their careers with us."}
        </p>
        <a href="/apply" style={{ display: "inline-block", background: gold, color: navy, borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 800, textDecoration: "none" }}>
          {es ? "Aplicar Ahora →" : "Apply Now →"}
        </a>
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
            {es ? "Aplicar Ahora →" : "Apply Now →"}
          </a>
        </div>
      </section>
    </div>
  );
}
