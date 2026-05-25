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

        #cursor-glow { position: fixed; top: 0; left: 0; width: 700px; height: 700px; border-radius: 50%; background: radial-gradient(circle, rgba(83,74,183,0.13) 0%, rgba(206,203,246,0.08) 35%, transparent 70%); pointer-events: none; z-index: 0; transform: translate(-50%, -50%); transition: left 0.18s ease, top 0.18s ease; will-change: left, top; }
        #cursor-glow-2 { position: fixed; top: 0; left: 0; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(circle, rgba(127,119,221,0.10) 0%, rgba(206,203,246,0.05) 40%, transparent 70%); pointer-events: none; z-index: 0; transform: translate(-50%, -50%); transition: left 0.35s ease, top 0.35s ease; will-change: left, top; }

        nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 48px; height: 64px; background: rgba(255,255,255,0.85); backdrop-filter: blur(16px); border-bottom: 1px solid var(--gray-200); transition: box-shadow 0.3s; }
        .nav-logo { font-family: 'DM Serif Display', serif; font-size: 22px; color: var(--indigo); text-decoration: none; letter-spacing: -0.5px; }
        .nav-links { display: flex; align-items: center; gap: 32px; list-style: none; }
        .nav-links a { font-size: 15px; color: var(--text-muted); text-decoration: none; transition: color 0.2s; }
        .nav-links a:hover { color: var(--indigo); }
        .nav-cta { background: var(--indigo) !important; color: white !important; padding: 10px 22px; border-radius: 50px; font-size: 14px !important; font-weight: 500; transition: all 0.2s !important; }
        .nav-cta:hover { background: var(--lavender-dark) !important; transform: translateY(-1px); }

        .hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; padding: 120px 24px 80px; background: transparent; position: relative; overflow: hidden; }
        .hero::before { content: ''; position: absolute; width: 800px; height: 800px; background: radial-gradient(circle, rgba(238,237,254,0.7) 0%, transparent 65%); top: -150px; left: 50%; transform: translateX(-50%); pointer-events: none; animation: breathe 6s ease-in-out infinite; }
        .hero::after { content: ''; position: absolute; width: 400px; height: 400px; background: radial-gradient(circle, rgba(206,203,246,0.3) 0%, transparent 70%); bottom: 0; right: 10%; pointer-events: none; animation: breathe 8s ease-in-out infinite reverse; }

        @keyframes breathe { 0%, 100% { transform: translateX(-50%) scale(1); opacity: 1; } 50% { transform: translateX(-50%) scale(1.08); opacity: 0.8; } }

        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: var(--indigo-pale); color: var(--indigo); font-size: 13px; font-weight: 500; padding: 8px 16px; border-radius: 50px; margin-bottom: 32px; border: 1px solid var(--lavender); animation: fadeUp 0.7s ease both; }
        .hero-badge span { width: 6px; height: 6px; background: var(--indigo); border-radius: 50%; display: inline-block; animation: pulse 2s ease-in-out infinite; }
        .hero-title { font-family: 'DM Serif Display', serif; font-size: clamp(42px, 7vw, 80px); line-height: 1.05; letter-spacing: -2px; color: var(--gray-900); margin-bottom: 24px; animation: fadeUp 0.7s 0.1s ease both; max-width: 900px; }
        .hero-title em { font-style: italic; color: var(--indigo); }
        .hero-sub { font-size: 18px; color: var(--text-muted); line-height: 1.6; max-width: 520px; margin: 0 auto 40px; font-weight: 300; animation: fadeUp 0.7s 0.2s ease both; }
        .hero-actions { display: flex; align-items: center; gap: 16px; justify-content: center; flex-wrap: wrap; animation: fadeUp 0.7s 0.3s ease both; }
        .btn-primary { background: var(--indigo); color: white; padding: 16px 32px; border-radius: 50px; font-size: 16px; font-weight: 500; text-decoration: none; transition: all 0.25s; box-shadow: 0 4px 20px rgba(83,74,183,0.3); }
        .btn-primary:hover { background: var(--lavender-dark); transform: translateY(-3px); box-shadow: 0 8px 30px rgba(83,74,183,0.4); }
        .btn-secondary { color: var(--indigo); font-size: 15px; font-weight: 500; text-decoration: none; display: flex; align-items: center; gap: 6px; transition: gap 0.25s; }
        .btn-secondary:hover { gap: 12px; }

        .hero-mockup { margin-top: 64px; animation: fadeUp 0.7s 0.4s ease both; position: relative; z-index: 1; }
        .mockup-card { background: rgba(255,255,255,0.92); backdrop-filter: blur(12px); border-radius: 20px; box-shadow: var(--shadow-md), 0 0 0 1px var(--gray-200); padding: 24px; max-width: 720px; margin: 0 auto; text-align: left; transition: transform 0.4s ease, box-shadow 0.4s ease; }
        .mockup-card:hover { transform: translateY(-6px); box-shadow: 0 20px 60px rgba(83,74,183,0.15), 0 0 0 1px var(--gray-200); }
        .mockup-header { display: flex; align-items: center; gap: 12px; padding-bottom: 16px; border-bottom: 1px solid var(--gray-100); margin-bottom: 16px; }
        .mockup-dot { width: 10px; height: 10px; border-radius: 50%; }
        .mockup-reservas { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .mockup-reserva { background: var(--gray-50); border-radius: 12px; padding: 14px; border: 1px solid var(--gray-200); transition: transform 0.2s, border-color 0.2s; }
        .mockup-reserva:hover { transform: translateY(-2px); border-color: var(--lavender); }
        .mockup-reserva-hora { font-size: 11px; color: var(--text-muted); margin-bottom: 4px; }
        .mockup-reserva-nombre { font-size: 14px; font-weight: 500; color: var(--gray-900); margin-bottom: 8px; }
        .mockup-reserva-badge { display: inline-block; font-size: 11px; padding: 3px 10px; border-radius: 50px; background: var(--indigo-pale); color: var(--indigo); font-weight: 500; }
        .mockup-stat { display: flex; align-items: center; gap: 8px; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--gray-100); }
        .mockup-stat-icon { width: 36px; height: 36px; background: var(--indigo-pale); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; }

        section { padding: 96px 48px; position: relative; z-index: 1; }
        .section-label { display: inline-block; font-size: 12px; font-weight: 600; color: var(--indigo); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px; }
        .section-title { font-family: 'DM Serif Display', serif; font-size: clamp(32px, 4vw, 52px); line-height: 1.1; letter-spacing: -1.5px; color: var(--gray-900); margin-bottom: 16px; max-width: 680px; }
        .section-sub { font-size: 17px; color: var(--text-muted); line-height: 1.6; max-width: 540px; font-weight: 300; margin-bottom: 56px; }

        .como-funciona { background: rgba(248,248,252,0.8); backdrop-filter: blur(8px); }
        .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; max-width: 1100px; margin: 0 auto; }
        .step { background: white; border-radius: var(--radius); padding: 32px; border: 1px solid var(--gray-200); transition: box-shadow 0.35s, transform 0.35s, border-color 0.35s; position: relative; overflow: hidden; }
        .step::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, var(--indigo-pale) 0%, transparent 60%); opacity: 0; transition: opacity 0.35s; }
        .step:hover { box-shadow: var(--shadow-md); transform: translateY(-6px); border-color: var(--lavender); }
        .step:hover::before { opacity: 1; }
        .step-num { font-family: 'DM Serif Display', serif; font-size: 48px; color: var(--indigo-pale); line-height: 1; margin-bottom: 16px; position: relative; transition: color 0.35s; }
        .step:hover .step-num { color: var(--lavender); }
        .step h3 { font-size: 18px; font-weight: 500; color: var(--gray-900); margin-bottom: 10px; position: relative; }
        .step p { font-size: 15px; color: var(--text-muted); line-height: 1.6; position: relative; }

        .features { background: transparent; }
        .features-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .features-inner.reverse { direction: rtl; }
        .features-inner.reverse > * { direction: ltr; }
        .feature-list { display: flex; flex-direction: column; gap: 16px; }
        .feature-item { display: flex; gap: 16px; align-items: flex-start; padding: 20px; border-radius: 12px; border: 1px solid transparent; transition: all 0.25s; cursor: default; }
        .feature-item:hover { background: var(--indigo-pale); border-color: var(--lavender); transform: translateX(4px); }
        .feature-icon { width: 40px; height: 40px; background: var(--indigo-pale); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; transition: background 0.25s, transform 0.25s; }
        .feature-item:hover .feature-icon { background: white; transform: scale(1.1) rotate(-4deg); }
        .feature-item h4 { font-size: 15px; font-weight: 500; color: var(--gray-900); margin-bottom: 4px; }
        .feature-item p { font-size: 14px; color: var(--text-muted); line-height: 1.5; }
        .feature-visual { background: rgba(248,248,252,0.8); border-radius: 20px; padding: 32px; border: 1px solid var(--gray-200); min-height: 360px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); }

        .phone { width: 240px; background: white; border-radius: 32px; box-shadow: 0 20px 60px rgba(83,74,183,0.15), 0 0 0 8px var(--gray-200); overflow: hidden; padding: 24px 16px; }
        .phone-header { text-align: center; margin-bottom: 20px; }
        .phone-title { font-size: 14px; font-weight: 600; color: var(--gray-900); }
        .phone-sub { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
        .phone-slots { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; }
        .slot { padding: 10px; border-radius: 10px; text-align: center; font-size: 13px; font-weight: 500; border: 1.5px solid var(--gray-200); color: var(--text-muted); transition: all 0.2s; }
        .slot:hover { border-color: var(--lavender); }
        .slot.available { background: var(--indigo-pale); border-color: var(--lavender); color: var(--indigo); }
        .slot.taken { background: var(--gray-50); text-decoration: line-through; opacity: 0.5; font-size: 11px; }
        .slot.selected { background: var(--indigo); border-color: var(--indigo); color: white; }
        .phone-btn { width: 100%; background: var(--indigo); color: white; border: none; padding: 12px; border-radius: 12px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .phone-btn:hover { background: var(--lavender-dark); transform: translateY(-1px); }

        .dashboard-mini { background: white; border-radius: 16px; padding: 20px; box-shadow: var(--shadow); border: 1px solid var(--gray-200); width: 100%; }
        .dash-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; font-size: 13px; font-weight: 500; color: var(--gray-900); }
        .dash-metrics { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 16px; }
        .dash-metric { background: var(--gray-50); border-radius: 10px; padding: 12px; text-align: center; transition: all 0.2s; }
        .dash-metric:hover { background: var(--indigo-pale); transform: translateY(-2px); }
        .dash-metric-val { font-family: 'DM Serif Display', serif; font-size: 22px; color: var(--indigo); display: block; }
        .dash-metric-label { font-size: 10px; color: var(--text-muted); margin-top: 2px; }
        .dash-bar-row { margin-bottom: 10px; }
        .dash-bar-label { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); margin-bottom: 4px; }
        .dash-bar-bg { background: var(--gray-100); border-radius: 4px; height: 6px; overflow: hidden; }
        .dash-bar-fill { height: 6px; border-radius: 4px; background: var(--indigo); transform-origin: left; }

        .pricing { background: rgba(248,248,252,0.8); backdrop-filter: blur(8px); }
        .pricing-inner { max-width: 680px; margin: 0 auto; text-align: center; }
        .pricing-card-fundador { background: var(--indigo); border-radius: var(--radius); padding: 48px 40px 32px; border: 1px solid var(--indigo); text-align: left; position: relative; margin-top: 56px; transition: transform 0.35s, box-shadow 0.35s; }
        .pricing-card-fundador:hover { transform: translateY(-8px); box-shadow: 0 20px 60px rgba(83,74,183,0.35); }
        .fundador-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: var(--lavender); color: var(--lavender-dark); font-size: 12px; font-weight: 600; padding: 5px 20px; border-radius: 50px; white-space: nowrap; letter-spacing: 0.5px; }
        .fundador-plan { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: var(--lavender); margin-bottom: 16px; }
        .fundador-price { font-family: 'DM Serif Display', serif; font-size: 64px; letter-spacing: -2px; color: white; line-height: 1; }
        .fundador-period { font-size: 16px; color: var(--lavender); margin-bottom: 8px; }
        .fundador-limit { display: inline-block; font-size: 13px; color: var(--lavender); background: rgba(255,255,255,0.1); padding: 4px 14px; border-radius: 50px; margin-bottom: 24px; }
        .fundador-desc { font-size: 15px; color: var(--lavender); line-height: 1.5; margin-bottom: 28px; padding-bottom: 28px; border-bottom: 1px solid rgba(255,255,255,0.15); }
        .fundador-features { list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 12px 24px; margin-bottom: 36px; }
        .fundador-feature { font-size: 14px; color: rgba(255,255,255,0.85); display: flex; align-items: flex-start; gap: 8px; line-height: 1.4; }
        .fundador-feature::before { content: '✓'; color: var(--lavender); font-weight: 600; flex-shrink: 0; margin-top: 1px; }
        .fundador-btn { display: block; text-align: center; padding: 16px; border-radius: 50px; font-size: 16px; font-weight: 500; text-decoration: none; transition: all 0.25s; background: white; color: var(--indigo); }
        .fundador-btn:hover { background: var(--indigo-pale); transform: translateY(-1px); }
        .fundador-disclaimer { font-size: 11px; color: rgba(206,203,246,0.6); text-align: center; margin-top: 20px; line-height: 1.5; }

        .cta-section { background: var(--indigo); padding: 96px 48px; text-align: center; position: relative; overflow: hidden; }
        .cta-section::before { content: ''; position: absolute; width: 600px; height: 600px; background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%); top: -200px; right: -100px; pointer-events: none; animation: breathe 7s ease-in-out infinite; }
        .cta-section::after { content: ''; position: absolute; width: 400px; height: 400px; background: radial-gradient(circle, rgba(206,203,246,0.1) 0%, transparent 70%); bottom: -100px; left: -100px; pointer-events: none; animation: breathe 5s ease-in-out infinite reverse; }
        .cta-title { font-family: 'DM Serif Display', serif; font-size: clamp(32px, 4vw, 52px); color: white; letter-spacing: -1.5px; margin-bottom: 16px; position: relative; z-index: 1; }
        .cta-sub { font-size: 17px; color: var(--lavender); margin-bottom: 40px; font-weight: 300; position: relative; z-index: 1; }
        .btn-white { background: white; color: var(--indigo); padding: 16px 36px; border-radius: 50px; font-size: 16px; font-weight: 500; text-decoration: none; display: inline-block; transition: all 0.25s; box-shadow: 0 4px 20px rgba(0,0,0,0.15); position: relative; z-index: 1; }
        .btn-white:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.2); }

        footer { background: var(--gray-900); padding: 48px; color: var(--gray-400); position: relative; z-index: 1; }
        .footer-inner { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 24px; }
        .footer-logo { font-family: 'DM Serif Display', serif; font-size: 22px; color: white; text-decoration: none; }
        .footer-links { display: flex; gap: 24px; list-style: none; }
        .footer-links a { font-size: 14px; color: var(--gray-400); text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: white; }
        .footer-copy { font-size: 13px; text-align: center; margin-top: 32px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.08); max-width: 1100px; margin: 32px auto 0; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.6; transform: scale(0.8); } }
        @keyframes barGrow { from { transform: scaleX(0); } to { transform: scaleX(1); } }

        .reveal { opacity: 0; transform: translateY(36px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        .reveal-delay-1 { transition-delay: 0.12s; }
        .reveal-delay-2 { transition-delay: 0.24s; }
        .reveal-delay-3 { transition-delay: 0.36s; }
        .bar-animated { animation: barGrow 1s ease both; }

        @media (max-width: 768px) {
          nav { padding: 0 24px; }
          .nav-links { display: none; }
          section { padding: 64px 24px; }
          .features-inner { grid-template-columns: 1fr; gap: 40px; }
          .features-inner.reverse { direction: ltr; }
          .mockup-reservas { grid-template-columns: 1fr 1fr; }
          .fundador-features { grid-template-columns: 1fr; }
          .pricing-card-fundador { padding: 40px 24px 28px; }
          footer { padding: 32px 24px; }
          .footer-inner { flex-direction: column; text-align: center; }
          .cta-section { padding: 64px 24px; }
        }
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />

      <div id="cursor-glow"></div>
      <div id="cursor-glow-2"></div>

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
        <div style={{position:'relative',zIndex:1}}>
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

      <section className="features" style={{background:'rgba(248,248,252,0.8)',backdropFilter:'blur(8px)'}}>
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
              <div className="dash-bar-row"><div className="dash-bar-label"><span>Carmen</span><span>87%</span></div><div className="dash-bar-bg"><div className="dash-bar-fill bar-animated" style={{width:'87%'}}></div></div></div>
              <div className="dash-bar-row"><div className="dash-bar-label"><span>Laura</span><span>62%</span></div><div className="dash-bar-bg"><div className="dash-bar-fill bar-animated" style={{width:'62%',background:'var(--indigo-light)',animationDelay:'0.15s'}}></div></div></div>
              <div className="dash-bar-row"><div className="dash-bar-label"><span>Uñas</span><span>48%</span></div><div className="dash-bar-bg"><div className="dash-bar-fill bar-animated" style={{width:'48%',background:'var(--lavender)',animationDelay:'0.3s'}}></div></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING — Plan Fundador */}
      <section className="pricing" id="precios">
        <div className="pricing-inner">
          <div className="reveal">
            <span className="section-label">Acceso anticipado</span>
            <h2 className="section-title" style={{margin:'0 auto 16px'}}>Únete antes que todos</h2>
            <p className="section-sub" style={{margin:'0 auto'}}>Por tiempo limitado, accede a Agendi completamente gratis con todas las funcionalidades del plan más completo.</p>
          </div>

          <div className="pricing-card-fundador reveal">
            <div className="fundador-badge">🎉 Plan Fundador — Acceso gratuito</div>
            <div className="fundador-plan">Plan Fundador</div>
            <div className="fundador-price">Gratis</div>
            <div className="fundador-period">sin costo mensual</div>
            <div className="fundador-limit">Hasta 300 reservas al mes</div>
            <div className="fundador-desc">
              Acceso completo a todas las funcionalidades de Agendi sin pagar nada. Ideal para negocios que quieren modernizar su gestión de reservas desde el primer día.
            </div>
            <ul className="fundador-features">
              <li className="fundador-feature">Formulario de reservas online personalizado</li>
              <li className="fundador-feature">Confirmación automática por WhatsApp al cliente y al dueño</li>
              <li className="fundador-feature">Recordatorio automático horas antes</li>
              <li className="fundador-feature">Cancelación con link directo</li>
              <li className="fundador-feature">Google Calendar sincronizado en tiempo real</li>
              <li className="fundador-feature">Panel de administración completo</li>
              <li className="fundador-feature">Dashboard de ingresos y métricas</li>
              <li className="fundador-feature">Especialistas y servicios ilimitados</li>
              <li className="fundador-feature">Color de marca personalizado en tu formulario</li>
              <li className="fundador-feature">Soporte prioritario en 24h hábiles</li>
              <li className="fundador-feature">Múltiples sucursales</li>
            </ul>
            <a href="#contacto" className="fundador-btn">Quiero mi acceso gratuito →</a>
            <p className="fundador-disclaimer">
              Disponible hasta el 30 de agosto de 2026 o al llegar a 50 negocios registrados, lo que ocurra primero.
            </p>
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
        const g1 = document.getElementById('cursor-glow');
        const g2 = document.getElementById('cursor-glow-2');
        document.addEventListener('mousemove', (e) => {
          g1.style.left = e.clientX + 'px';
          g1.style.top = e.clientY + 'px';
          g2.style.left = e.clientX + 'px';
          g2.style.top = e.clientY + 'px';
        });
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
