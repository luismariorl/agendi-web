import Head from 'next/head';

export default function Home() {
  return (
    <>
      <style>{`
        :root {
          --indigo: #534AB7;
          --indigo-light: #7F77DD;
          --indigo-pale: #EEEDFE;
          --lavender: #CECBF6;
          --lavender-dark: #3C3489;
          --white: #ffffff;
          --gray-50: #F8F8FC;
          --gray-100: #F1F0FA;
          --gray-200: #E2E1F5;
          --gray-400: #9896C8;
          --gray-900: #1A1834;
          --text: #1A1834;
          --text-muted: #6B69A0;
          --radius: 16px;
          --shadow: 0 4px 24px rgba(83,74,183,0.08);
          --shadow-md: 0 8px 40px rgba(83,74,183,0.12);
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', sans-serif; color: var(--text); background: var(--white); overflow-x: hidden; }
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap');

        nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 48px; height: 64px; background: rgba(255,255,255,0.9); backdrop-filter: blur(12px); border-bottom: 1px solid var(--gray-200); }
        .nav-logo { font-family: 'DM Serif Display', serif; font-size: 22px; color: var(--indigo); text-decoration: none; letter-spacing: -0.5px; }
        .nav-links { display: flex; align-items: center; gap: 32px; list-style: none; }
        .nav-links a { font-size: 15px; color: var(--text-muted); text-decoration: none; transition: color 0.2s; }
        .nav-links a:hover { color: var(--indigo); }
        .nav-cta { background: var(--indigo) !important; color: white !important; padding: 10px 22px; border-radius: 50px; font-size: 14px !important; font-weight: 500; }
        .nav-cta:hover { background: var(--lavender-dark) !important; }

        .hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; padding: 120px 24px 80px; background: linear-gradient(180deg, var(--gray-50) 0%, var(--white) 100%); position: relative; overflow: hidden; }
        .hero::before { content: ''; position: absolute; width: 600px; height: 600px; background: radial-gradient(circle, var(--indigo-pale) 0%, transparent 70%); top: -100px; left: 50%; transform: translateX(-50%); pointer-events: none; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: var(--indigo-pale); color: var(--indigo); font-size: 13px; font-weight: 500; padding: 8px 16px; border-radius: 50px; margin-bottom: 32px; border: 1px solid var(--lavender); animation: fadeUp 0.6s ease both; }
        .hero-badge span { width: 6px; height: 6px; background: var(--indigo); border-radius: 50%; display: inline-block; }
        .hero-title { font-family: 'DM Serif Display', serif; font-size: clamp(42px, 7vw, 80px); line-height: 1.05; letter-spacing: -2px; color: var(--gray-900); margin-bottom: 24px; animation: fadeUp 0.6s 0.1s ease both; max-width: 900px; }
        .hero-title em { font-style: italic; color: var(--indigo); }
        .hero-sub { font-size: 18px; color: var(--text-muted); line-height: 1.6; max-width: 520px; margin: 0 auto 40px; font-weight: 300; animation: fadeUp 0.6s 0.2s ease both; }
        .hero-actions { display: flex; align-items: center; gap: 16px; justify-content: center; flex-wrap: wrap; animation: fadeUp 0.6s 0.3s ease both; }
        .btn-primary { background: var(--indigo); color: white; padding: 16px 32px; border-radius: 50px; font-size: 16px; font-weight: 500; text-decoration: none; transition: all 0.2s; box-shadow: 0 4px 20px rgba(83,74,183,0.3); }
        .btn-primary:hover { background: var(--lavender-dark); transform: translateY(-2px); }
        .btn-secondary { color: var(--indigo); font-size: 15px; font-weight: 500; text-decoration: none; display: flex; align-items: center; gap: 6px; transition: gap 0.2s; }
        .btn-secondary:hover { gap: 10px; }

        .hero-mockup { margin-top: 64px; animation: fadeUp 0.6s 0.4s ease both; }
        .mockup-card { background: white; border-radius: 20px; box-shadow: var(--shadow-md), 0 0 0 1px var(--gray-200); padding: 24px; max-width: 720px; margin: 0 auto; text-align: left; }
        .mockup-header { display: flex; align-items: center; gap: 12px; padding-bottom: 16px; border-bottom: 1px solid var(--gray-100); margin-bottom: 16px; }
        .mockup-dot { width: 10px; height: 10px; border-radius: 50%; }
        .mockup-reservas { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .mockup-reserva { background: var(--gray-50); border-radius: 12px; padding: 14px; border: 1px solid var(--gray-200); }
        .mockup-reserva-hora { font-size: 11px; color: var(--text-muted); margin-bottom: 4px; }
        .mockup-reserva-nombre { font-size: 14px; font-weight: 500; color: var(--gray-900); margin-bottom: 8px; }
        .mockup-reserva-badge { display: inline-block; font-size: 11px; padding: 3px 10px; border-radius: 50px; background: var(--indigo-pale); color: var(--indigo); font-weight: 500; }
        .mockup-stat { display: flex; align-items: center; gap: 8px; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--gray-100); }
        .mockup-stat-icon { width: 36px; height: 36px; background: var(--indigo-pale); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; }

        section { padding: 96px 48px; }
        .section-label { display: inline-block; font-size: 12px; font-weight: 600; color: var(--indigo); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px; }
        .section-title { font-family: 'DM Serif Display', serif; font-size: clamp(32px, 4vw, 52px); line-height: 1.1; letter-spacing: -1.5px; color: var(--gray-900); margin-bottom: 16px; max-width: 680px; }
        .section-sub { font-size: 17px; color: var(--text-muted); line-height: 1.6; max-width: 540px; font-weight: 300; margin-bottom: 56px; }

        .como-funciona { background: var(--gray-50); }
        .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; max-width: 1100px; margin: 0 auto; }
        .step { background: white; border-radius: var(--radius); padding: 32px; border: 1px solid var(--gray-200); transition: box-shadow 0.3s, transform 0.3s; }
        .step:hover { box-shadow: var(--shadow-md); transform: translateY(-4px); }
        .step-num { font-family: 'DM Serif Display', serif; font-size: 48px; color: var(--indigo-pale); line-height: 1; margin-bottom: 16px; }
        .step h3 { font-size: 18px; font-weight: 500; color: var(--gray-900); margin-bottom: 10px; }
        .step p { font-size: 15px; color: var(--text-muted); line-height: 1.6; }

        .features { background: white; }
        .features-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .features-inner.reverse { direction: rtl; }
        .features-inner.reverse > * { direction: ltr; }
        .feature-list { display: flex; flex-direction: column; gap: 20px; }
        .feature-item { display: flex; gap: 16px; align-items: flex-start; padding: 20px; border-radius: 12px; border: 1px solid transparent; transition: all 0.2s; cursor: default; }
        .feature-item:hover { background: var(--indigo-pale); border-color: var(--lavender); }
        .feature-icon { width: 40px; height: 40px; background: var(--indigo-pale); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
        .feature-item:hover .feature-icon { background: white; }
        .feature-item h4 { font-size: 15px; font-weight: 500; color: var(--gray-900); margin-bottom: 4px; }
        .feature-item p { font-size: 14px; color: var(--text-muted); line-height: 1.5; }
        .feature-visual { background: var(--gray-50); border-radius: 20px; padding: 32px; border: 1px solid var(--gray-200); min-height: 360px; display: flex; align-items: center; justify-content: center; }

        .phone { width: 240px; background: white; border-radius: 32px; box-shadow: 0 20px 60px rgba(83,74,183,0.15), 0 0 0 8px var(--gray-200); overflow: hidden; padding: 24px 16px; }
        .phone-header { text-align: center; margin-bottom: 20px; }
        .phone-title { font-size: 14px; font-weight: 600; color: var(--gray-900); }
        .phone-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
        .phone-slots { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; }
        .slot { padding: 10px; border-radius: 10px; text-align: center; font-size: 13px; font-weight: 500; border: 1.5px solid var(--gray-200); color: var(--text-muted); }
        .slot.available { background: var(--indigo-pale); border-color: var(--lavender); color: var(--indigo); }
        .slot.taken { background: var(--gray-50); text-decoration: line-through; opacity: 0.5; font-size: 11px; }
        .slot.selected { background: var(--indigo); border-color: var(--indigo); color: white; }
        .phone-btn { width: 100%; background: var(--indigo); color: white; border: none; padding: 12px; border-radius: 12px; font-size: 14px; font-weight: 500; cursor: pointer; }

        .dashboard-mini { background: white; border-radius: 16px; padding: 20px; box-shadow: var(--shadow); border: 1px solid var(--gray-200); width: 100%; }
        .dash-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; font-size: 13px; font-weight: 500; color: var(--gray-900); }
        .dash-metrics { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 16px; }
        .dash-metric { background: var(--gray-50); border-radius: 10px; padding: 12px; text-align: center; }
        .dash-metric-val { font-family: 'DM Serif Display', serif; font-size: 22px; color: var(--indigo); display: block; }
        .dash-metric-label { font-size: 10px; color: var(--text-muted); margin-top: 2px; }
        .dash-bar-row { margin-bottom: 10px; }
        .dash-bar-label { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); margin-bottom: 4px; }
        .dash-bar-bg { background: var(--gray-100); border-radius: 4px; height: 6px; }
        .dash-bar-fill { height: 6px; border-radius: 4px; background: var(--indigo); }

        .pricing { background: var(--gray-50); }
        .pricing-inner { max-width: 1100px; margin: 0 auto; text-align: center; }
        .pricing-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 56px; }
        .pricing-card { background: white; border-radius: var(--radius); padding: 36px 28px; border: 1px solid var(--gray-200); text-align: left; position: relative; transition: transform 0.3s, box-shadow 0.3s; }
        .pricing-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-md); }
        .pricing-card.featured { background: var(--indigo); border-color: var(--indigo); color: white; }
        .pricing-card.featured .pricing-price { color: white; }
        .pricing-card.featured .pricing-period { color: var(--lavender); }
        .pricing-card.featured .pricing-desc { color: var(--lavender); }
        .pricing-card.featured .pricing-feature { color: rgba(255,255,255,0.85); }
        .pricing-card.featured .pricing-feature::before { color: var(--lavender); }
        .featured-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--lavender); color: var(--lavender-dark); font-size: 12px; font-weight: 600; padding: 4px 16px; border-radius: 50px; white-space: nowrap; }
        .pricing-plan { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: var(--text-muted); margin-bottom: 16px; }
        .pricing-card.featured .pricing-plan { color: var(--lavender); }
        .pricing-price { font-family: 'DM Serif Display', serif; font-size: 48px; letter-spacing: -2px; color: var(--gray-900); line-height: 1; }
        .pricing-period { font-size: 14px; color: var(--text-muted); margin-bottom: 8px; }
        .pricing-desc { font-size: 14px; color: var(--text-muted); line-height: 1.5; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--gray-200); }
        .pricing-card.featured .pricing-desc { border-bottom-color: rgba(255,255,255,0.15); }
        .pricing-features { list-style: none; display: flex; flex-direction: column; gap: 12px; margin-bottom: 32px; }
        .pricing-feature { font-size: 14px; color: var(--text-muted); display: flex; align-items: center; gap: 10px; }
        .pricing-feature::before { content: '✓'; color: var(--indigo); font-weight: 600; }
        .pricing-btn { display: block; text-align: center; padding: 14px; border-radius: 50px; font-size: 15px; font-weight: 500; text-decoration: none; transition: all 0.2s; }
        .pricing-btn-outline { border: 1.5px solid var(--gray-200); color: var(--indigo); }
        .pricing-btn-outline:hover { border-color: var(--indigo); background: var(--indigo-pale); }
        .pricing-btn-white { background: white; color: var(--indigo); }
        .pricing-btn-white:hover { background: var(--indigo-pale); }

        .cta-section { background: var(--indigo); padding: 96px 48px; text-align: center; position: relative; overflow: hidden; }
        .cta-section::before { content: ''; position: absolute; width: 400px; height: 400px; background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%); top: -100px; right: -100px; pointer-events: none; }
        .cta-title { font-family: 'DM Serif Display', serif; font-size: clamp(32px, 4vw, 52px); color: white; letter-spacing: -1.5px; margin-bottom: 16px; }
        .cta-sub { font-size: 17px; color: var(--lavender); margin-bottom: 40px; font-weight: 300; }
        .btn-white { background: white; color: var(--indigo); padding: 16px 36px; border-radius: 50px; font-size: 16px; font-weight: 500; text-decoration: none; display: inline-block; transition: all 0.2s; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
        .btn-white:hover { transform: translateY(-2px); }

        footer { background: var(--gray-900); padding: 48px; color: var(--gray-400); }
        .footer-inner { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 24px; }
        .footer-logo { font-family: 'DM Serif Display', serif; font-size: 22px; color: white; text-decoration: none; }
        .footer-links { display: flex; gap: 24px; list-style: none; }
        .footer-links a { font-size: 14px; color: var(--gray-400); text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: white; }
        .footer-copy { font-size: 13px; text-align: center; margin-top: 32px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.08); max-width: 1100px; margin: 32px auto 0; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.3s; }

        @media (max-width: 768px) {
          nav { padding: 0 24px; }
          .nav-links { display: none; }
          section { padding: 64px 24px; }
          .features-inner { grid-template-columns: 1fr; gap: 40px; }
          .features-inner.reverse { direction: ltr; }
          .pricing-cards { grid-template-columns: 1fr; }
          .mockup-reservas { grid-template-columns: 1fr 1fr; }
          footer { padding: 32px 24px; }
          .footer-inner { flex-direction: column; text-align: center; }
          .cta-section { padding: 64px 24px; }
        }
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />

      <nav>
        <a href="#" className="nav-logo">Agendi</a>
        <ul className="nav-links">
          <li><a href="#como-funciona">Cómo funciona</a></li>
          <li><a href="#funcionalidades">Funcionalidades</a></li>
          <li><a href="#precios">Precios</a></li>
          <li><a href="#contacto" className="nav-cta">Empezar gratis</a></li>
        </ul>
      </nav>

      <section className="hero">
        <div>
          <div className="hero-badge"><span></span>Sistema de reservas inteligente para Perú</div>
          <h1 className="hero-title">Gestiona <em>citas</em>,<br />no mensajes.</h1>
          <p className="hero-sub">Agendi automatiza las reservas de tu negocio. Tus clientes reservan solos, tú te concentras en atenderlos.</p>
          <div className="hero-actions">
            <a href="#precios" className="btn-primary">Empieza hoy →</a>
            <a href="#como-funciona" className="btn-secondary">Ver cómo funciona ↓</a>
          </div>
          <div className="hero-mockup">
            <div className="mockup-card">
              <div className="mockup-header">
                <div className="mockup-dot" style={{background:'#FF5F57'}}></div>
                <div className="mockup-dot" style={{background:'#FEBC2E'}}></div>
                <div className="mockup-dot" style={{background:'#28C840'}}></div>
                <span style={{fontSize:'13px',color:'var(--text-muted)',marginLeft:'8px'}}>Beauty Salon — Panel de hoy</span>
              </div>
              <div className="mockup-reservas">
                <div className="mockup-reserva"><div className="mockup-reserva-hora">9:00 am · Carmen</div><div className="mockup-reserva-nombre">María López</div><div className="mockup-reserva-badge">Uñas</div></div>
                <div className="mockup-reserva"><div className="mockup-reserva-hora">10:00 am · Laura</div><div className="mockup-reserva-nombre">Ana García</div><div className="mockup-reserva-badge">Pedicure</div></div>
                <div className="mockup-reserva"><div className="mockup-reserva-hora">11:00 am · Carmen</div><div className="mockup-reserva-nombre">Lucía Pérez</div><div className="mockup-reserva-badge">Corte + lavado</div></div>
              </div>
              <div className="mockup-stat">
                <div className="mockup-stat-icon">📅</div>
                <div>
                  <div style={{fontSize:'13px',fontWeight:'500',color:'var(--gray-900)'}}>8 reservas confirmadas hoy</div>
                  <div style={{fontSize:'12px',color:'var(--text-muted)'}}>S/ 320 en ingresos estimados</div>
                </div>
                <div style={{marginLeft:'auto',fontSize:'13px',fontWeight:'500',color:'var(--indigo)'}}>Ver todas →</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="como-funciona" id="como-funciona">
        <div style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div className="reveal">
            <span className="section-label">Cómo funciona</span>
            <h2 className="section-title">Reservas automáticas en 3 pasos simples</h2>
            <p className="section-sub">Sin llamadas, sin WhatsApp interminables. Tus clientes reservan solos y tú recibes la notificación.</p>
          </div>
          <div className="steps">
            <div className="step reveal reveal-delay-1"><div className="step-num">01</div><h3>Tu cliente entra al link</h3><p>Cada negocio tiene su propio link personalizado. El cliente elige servicio, especialista, día y hora disponible.</p></div>
            <div className="step reveal reveal-delay-2"><div className="step-num">02</div><h3>El sistema verifica y confirma</h3><p>Agendi consulta el calendario en tiempo real y confirma automáticamente si hay disponibilidad.</p></div>
            <div className="step reveal reveal-delay-3"><div className="step-num">03</div><h3>Todos reciben notificación</h3><p>El cliente recibe confirmación por WhatsApp. Tú recibes el detalle completo de la reserva al instante.</p></div>
          </div>
        </div>
      </section>

      <section className="features" id="funcionalidades">
        <div className="features-inner" style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div className="reveal">
            <span className="section-label">Para tus clientes</span>
            <h2 className="section-title">Reservar nunca fue tan fácil</h2>
            <p className="section-sub">Tu formulario muestra solo los horarios disponibles, en tiempo real. Sin confusión, sin llamadas de ida y vuelta.</p>
            <div className="feature-list">
              <div className="feature-item"><div className="feature-icon">🗓️</div><div><h4>Horarios en tiempo real</h4><p>Solo muestra los slots disponibles según el calendario de cada especialista.</p></div></div>
              <div className="feature-item"><div className="feature-icon">💬</div><div><h4>Confirmación por WhatsApp</h4><p>El cliente recibe su confirmación con link para cancelar si lo necesita.</p></div></div>
              <div className="feature-item"><div className="feature-icon">❌</div><div><h4>Cancelación con un clic</h4><p>El cliente cancela solo desde el link — sin llamar, sin escribir.</p></div></div>
            </div>
          </div>
          <div className="feature-visual reveal reveal-delay-1">
            <div className="phone">
              <div className="phone-header"><div className="phone-title">Beauty Salon</div><div className="phone-sub">Elige tu horario</div></div>
              <div className="phone-slots">
                <div className="slot taken">9:00 am</div>
                <div className="slot available">10:00 am</div>
                <div className="slot selected">11:00 am</div>
                <div className="slot available">12:00 pm</div>
                <div className="slot taken">1:00 pm</div>
                <div className="slot available">3:00 pm</div>
              </div>
              <button className="phone-btn">Confirmar reserva</button>
            </div>
          </div>
        </div>
      </section>

      <section className="features" style={{background:'var(--gray-50)'}}>
        <div className="features-inner reverse" style={{maxWidth:'1100px',margin:'0 auto'}}>
          <div className="reveal">
            <span className="section-label">Para ti como dueño</span>
            <h2 className="section-title">Tu negocio en un solo panel</h2>
            <p className="section-sub">Ve tus reservas, ingresos, clientes top y ocupación de cada especialista — todo en tiempo real.</p>
            <div className="feature-list">
              <div className="feature-item"><div className="feature-icon">📊</div><div><h4>Dashboard de ingresos</h4><p>Reservas del día, ingresos del mes y servicios más pedidos de un vistazo.</p></div></div>
              <div className="feature-item"><div className="feature-icon">👥</div><div><h4>Clientes top</h4><p>Identifica quiénes son tus mejores clientes por visitas y gasto acumulado.</p></div></div>
              <div className="feature-item"><div className="feature-icon">⚙️</div><div><h4>Gestión sin soporte</h4><p>Agrega especialistas, cambia precios y actualiza horarios tú mismo.</p></div></div>
            </div>
          </div>
          <div className="feature-visual reveal reveal-delay-1">
            <div className="dashboard-mini">
              <div className="dash-header"><span>Beauty Salon · Hoy</span><span style={{color:'var(--indigo)',fontSize:'12px'}}>Ver todo →</span></div>
              <div className="dash-metrics">
                <div className="dash-metric"><span className="dash-metric-val">8</span><div className="dash-metric-label">Reservas</div></div>
                <div className="dash-metric"><span className="dash-metric-val">S/320</span><div className="dash-metric-label">Ingresos</div></div>
                <div className="dash-metric"><span className="dash-metric-val">3</span><div className="dash-metric-label">Nuevos</div></div>
              </div>
              <div className="dash-bar-row"><div className="dash-bar-label"><span>Carmen</span><span>87%</span></div><div className="dash-bar-bg"><div className="dash-bar-fill" style={{width:'87%'}}></div></div></div>
              <div className="dash-bar-row"><div className="dash-bar-label"><span>Laura</span><span>62%</span></div><div className="dash-bar-bg"><div className="dash-bar-fill" style={{width:'62%',background:'var(--indigo-light)'}}></div></div></div>
              <div className="dash-bar-row"><div className="dash-bar-label"><span>Uñas</span><span>48%</span></div><div className="dash-bar-bg"><div className="dash-bar-fill" style={{width:'48%',background:'var(--lavender)'}}></div></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
<section className="pricing" id="precios">
  <div className="pricing-inner">
    <div className="reveal">
      <span className="section-label">Planes</span>
      <h2 className="section-title" style={{margin:'0 auto 16px'}}>Simple, sin sorpresas</h2>
      <p className="section-sub" style={{margin:'0 auto'}}>Elige el plan que se adapta a tu negocio. Cancela cuando quieras.</p>
    </div>
    <div className="pricing-cards">

      <div className="pricing-card reveal reveal-delay-1">
        <div className="pricing-plan">Básico</div>
        <div className="pricing-price">S/69</div>
        <div className="pricing-period">/mes</div>
        <div className="pricing-desc">Ideal para negocios que recién empiezan a automatizar sus reservas.</div>
        <ul className="pricing-features">
          <li className="pricing-feature">Hasta 400 reservas al mes</li>
          <li className="pricing-feature">Especialistas y servicios ilimitados</li>
          <li className="pricing-feature">Formulario de reservas online</li>
          <li className="pricing-feature">Confirmación automática al cliente y al dueño por WhatsApp</li>
          <li className="pricing-feature">Cancelación con link</li>
          <li className="pricing-feature">Google Calendar sincronizado</li>
          <li className="pricing-feature">Panel de administración completo</li>
          <li className="pricing-feature">Dashboard de ingresos y métricas</li>
        </ul>
        <a href="#contacto" className="pricing-btn pricing-btn-outline">Empezar →</a>
      </div>

      <div className="pricing-card featured reveal reveal-delay-2">
        <div className="featured-badge">Más popular</div>
        <div className="pricing-plan">Regular</div>
        <div className="pricing-price">S/129</div>
        <div className="pricing-period">/mes</div>
        <div className="pricing-desc">Para negocios en crecimiento que necesitan más control y automatización.</div>
        <ul className="pricing-features">
          <li className="pricing-feature">Hasta 1,200 reservas al mes</li>
          <li className="pricing-feature">Todo lo del plan Básico</li>
          <li className="pricing-feature">Recordatorio automático 24 horas antes</li>
          <li className="pricing-feature">Recordatorio automático 2 horas antes</li>
        </ul>
        <a href="#contacto" className="pricing-btn pricing-btn-white">Empezar →</a>
      </div>

      <div className="pricing-card reveal reveal-delay-3">
        <div className="pricing-plan">Pro</div>
        <div className="pricing-price">S/229</div>
        <div className="pricing-period">/mes</div>
        <div className="pricing-desc">El sistema completo para negocios que quieren automatizar todo.</div>
        <ul className="pricing-features">
          <li className="pricing-feature">Hasta 3,000 reservas al mes</li>
          <li className="pricing-feature">Todo lo del plan Regular</li>
          <li className="pricing-feature">Soporte prioritario en 24h hábiles</li>
        </ul>
        <a href="#contacto" className="pricing-btn pricing-btn-outline">Empezar →</a>
      </div>

    </div>
  </div>
</section>

      <section className="cta-section" id="contacto">
        <div className="reveal">
          <h2 className="cta-title">¿Listo para dejar de<br />gestionar por WhatsApp?</h2>
          <p className="cta-sub">Únete a los negocios que ya automatizan sus reservas con Agendi.</p>
          <a href="mailto:hola@agendi.pe" className="btn-white">Contáctanos hoy →</a>
        </div>
      </section>

      <footer>
  <div className="footer-inner">
    <a href="#" className="footer-logo">Agendi</a>
    <ul className="footer-links">
      <li><a href="#como-funciona">Cómo funciona</a></li>
      <li><a href="#precios">Precios</a></li>
      <li><a href="/politicas-de-privacidad">Privacidad</a></li>
      <li><a href="mailto:soporte@agendi.pe">Contacto</a></li>
    </ul>
  </div>
  <div className="footer-copy">
    © 2026 Agendi · Operado por ECO DRIVE PLUS S.A.C. · RUC 20613413228 · Hecho en Perú 🇵🇪
  </div>
</footer>

      <script dangerouslySetInnerHTML={{__html: `
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
          });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        const nav = document.querySelector('nav');
        window.addEventListener('scroll', () => {
          nav.style.boxShadow = window.scrollY > 20 ? '0 4px 24px rgba(83,74,183,0.08)' : 'none';
        });
      `}} />
    </>
  );
}