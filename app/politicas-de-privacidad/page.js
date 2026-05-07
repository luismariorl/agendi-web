"use client"
import Link from "next/link"

export default function PoliticasPrivacidad() {
  return (
    <>
      <style>{`
        :root {
          --indigo: #534AB7;
          --indigo-pale: #EEEDFE;
          --lavender: #CECBF6;
          --lavender-dark: #3C3489;
          --gray-50: #F8F8FC;
          --gray-100: #F1F0FA;
          --gray-200: #E2E1F5;
          --gray-400: #9896C8;
          --gray-900: #1A1834;
          --text: #1A1834;
          --text-muted: #6B69A0;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; color: var(--text); background: white; }

        .nav-bar {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 48px; height: 64px;
          background: rgba(255,255,255,0.95); backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--gray-200);
        }
        .nav-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 22px; color: var(--indigo);
          text-decoration: none; letter-spacing: -0.5px;
        }
        .back-link {
          font-size: 14px; color: var(--text-muted);
          text-decoration: none; transition: color 0.2s;
        }
        .back-link:hover { color: var(--indigo); }

        .container {
          max-width: 820px; margin: 0 auto;
          padding: 64px 32px 96px;
        }

        .header {
          text-align: center; margin-bottom: 56px;
          padding-bottom: 40px; border-bottom: 1px solid var(--gray-200);
        }
        .header-label {
          display: inline-block; font-size: 12px; font-weight: 600;
          color: var(--indigo); text-transform: uppercase;
          letter-spacing: 2px; margin-bottom: 12px;
        }
        .header h1 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(32px, 5vw, 48px);
          line-height: 1.1; letter-spacing: -1.5px;
          color: var(--gray-900); margin-bottom: 16px;
        }
        .header p { color: var(--text-muted); font-size: 15px; }

        section.policy { margin-bottom: 40px; }
        section.policy h2 {
          font-family: 'DM Serif Display', serif;
          font-size: 24px; color: var(--gray-900);
          margin-bottom: 16px; letter-spacing: -0.5px;
        }
        section.policy h3 {
          font-size: 16px; font-weight: 600;
          color: var(--gray-900);
          margin: 20px 0 8px;
        }
        section.policy p {
          font-size: 15px; line-height: 1.7;
          color: var(--text); margin-bottom: 12px;
        }
        section.policy ul {
          padding-left: 20px; margin-bottom: 16px;
        }
        section.policy li {
          font-size: 15px; line-height: 1.7;
          color: var(--text); margin-bottom: 6px;
        }
        section.policy strong { color: var(--gray-900); font-weight: 600; }

        .info-box {
          background: var(--indigo-pale);
          border-left: 4px solid var(--indigo);
          padding: 20px 24px; border-radius: 8px;
          margin: 16px 0;
        }
        .info-box p { margin: 0; }

        .contact-card {
          background: var(--gray-50);
          border: 1px solid var(--gray-200);
          border-radius: 16px;
          padding: 28px 32px;
          margin-top: 24px;
        }
        .contact-card h3 { margin-top: 0; }
        .contact-card a {
          color: var(--indigo); text-decoration: none;
          font-weight: 500;
        }
        .contact-card a:hover { text-decoration: underline; }

        footer {
          background: var(--gray-900);
          padding: 40px 48px;
          color: var(--gray-400);
          text-align: center;
          font-size: 13px;
        }
        footer a { color: var(--gray-400); text-decoration: none; }
        footer a:hover { color: white; }

        @media (max-width: 768px) {
          .nav-bar { padding: 0 24px; }
          .container { padding: 40px 20px 64px; }
          footer { padding: 32px 24px; }
        }
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      <nav className="nav-bar">
        <Link href="/" className="nav-logo">Agendi</Link>
        <a href="/" className="back-link">← Volver al inicio</a>
      </nav>

      <div className="container">
        <div className="header">
          <span className="header-label">Documento legal</span>
          <h1>Política de Privacidad</h1>
          <p>Última actualización: 6 de mayo de 2026</p>
        </div>

        <section className="policy">
          <h2>1. Identidad del responsable</h2>
          <p>
            En cumplimiento de la <strong>Ley N° 29733 - Ley de Protección de Datos Personales</strong> del Perú y su reglamento,
            le informamos que el responsable del tratamiento de sus datos personales es:
          </p>
          <div className="info-box">
            <p><strong>Razón social:</strong> ECO DRIVE PLUS S.A.C.</p>
            <p><strong>RUC:</strong> 20613413228</p>
            <p><strong>Domicilio fiscal:</strong> Sec. Santa Fe, Mz A Lote 18 Dpto 401, Huanchaco, Trujillo, La Libertad, Perú</p>
            <p><strong>Marca comercial:</strong> Agendi (agendi.pe)</p>
            <p><strong>Correo de contacto:</strong> soporte@agendi.pe</p>
          </div>
        </section>

        <section className="policy">
          <h2>2. Datos personales que recolectamos</h2>
          <p>Agendi recolecta y trata los siguientes datos según el tipo de usuario:</p>

          <h3>2.1. De los negocios contratantes (dueños de cuenta)</h3>
          <ul>
            <li>Nombre del negocio</li>
            <li>Correo electrónico (Gmail) del administrador</li>
            <li>Número de WhatsApp del responsable del negocio</li>
            <li>Sucursales, especialistas, servicios y precios configurados</li>
            <li>ID del Google Calendar autorizado para gestión de horarios</li>
            <li>Información de plan contratado y uso de la plataforma</li>
          </ul>

          <h3>2.2. De los clientes finales (personas que reservan)</h3>
          <ul>
            <li>Nombre completo</li>
            <li>Número de WhatsApp / teléfono</li>
            <li>Notas o detalles voluntarios sobre la reserva</li>
            <li>Historial de reservas (servicio, fecha, hora, especialista, sucursal, estado)</li>
          </ul>
        </section>

        <section className="policy">
          <h2>3. Finalidad del tratamiento</h2>
          <p>Sus datos son tratados exclusivamente para los siguientes fines:</p>
          <ul>
            <li>Crear y gestionar su cuenta en Agendi</li>
            <li>Permitir el agendamiento, confirmación y cancelación de reservas</li>
            <li>Sincronizar reservas con Google Calendar</li>
            <li>Enviar confirmaciones, recordatorios y notificaciones por WhatsApp</li>
            <li>Mostrar métricas y reportes en el panel de administración</li>
            <li>Brindar soporte técnico cuando sea solicitado</li>
            <li>Cumplir con obligaciones legales aplicables</li>
          </ul>
          <p>
            <strong>No vendemos, alquilamos ni cedemos sus datos a terceros con fines comerciales.</strong>
          </p>
        </section>

        <section className="policy">
          <h2>4. Base legal</h2>
          <p>El tratamiento de sus datos se realiza sobre las siguientes bases legales:</p>
          <ul>
            <li><strong>Consentimiento</strong> otorgado al registrarse o realizar una reserva</li>
            <li><strong>Ejecución contractual</strong> cuando el tratamiento es necesario para prestar el servicio</li>
            <li><strong>Cumplimiento legal</strong> cuando alguna norma así lo exija</li>
          </ul>
        </section>

        <section className="policy">
          <h2>5. Conservación de datos</h2>
          <p>
            Conservamos sus datos personales <strong>desde el momento de creación de la cuenta y hasta 6 meses</strong> después
            de su eliminación o cancelación. Pasado este plazo, los datos son eliminados de forma segura
            de nuestros sistemas, salvo que una obligación legal exija conservarlos por mayor tiempo.
          </p>
        </section>

        <section className="policy">
          <h2>6. Encargados del tratamiento (terceros)</h2>
          <p>
            Para prestar el servicio, Agendi utiliza proveedores tecnológicos que actúan como encargados del tratamiento.
            Estos proveedores cumplen con sus propios estándares internacionales de seguridad y privacidad:
          </p>
          <ul>
            <li><strong>Google LLC</strong> — autenticación, almacenamiento (Google Sheets), calendarios (Google Calendar)</li>
            <li><strong>Vercel Inc.</strong> — hosting de la plataforma web</li>
            <li><strong>Railway Corporation</strong> — automatizaciones backend</li>
            <li><strong>Meta Platforms Inc.</strong> — envío de mensajes mediante WhatsApp Cloud API</li>
          </ul>
          <p>
            Estos proveedores acceden únicamente a los datos estrictamente necesarios para cumplir su función
            y están sujetos a sus respectivas políticas de privacidad.
          </p>
        </section>

        <section className="policy">
          <h2>7. Sus derechos (Derechos ARCO)</h2>
          <p>
            Como titular de sus datos personales, usted tiene los siguientes derechos garantizados por la Ley N° 29733:
          </p>
          <ul>
            <li><strong>Acceso:</strong> conocer qué datos suyos tratamos</li>
            <li><strong>Rectificación:</strong> corregir datos inexactos o incompletos</li>
            <li><strong>Cancelación:</strong> solicitar la eliminación de sus datos</li>
            <li><strong>Oposición:</strong> oponerse al tratamiento de sus datos por causa legítima</li>
            <li><strong>Información:</strong> conocer los detalles del tratamiento</li>
            <li><strong>Revocación del consentimiento</strong> en cualquier momento</li>
          </ul>
          <p>
            Para ejercer cualquiera de estos derechos, puede escribirnos a <a href="mailto:soporte@agendi.pe">soporte@agendi.pe</a> indicando
            su solicitud. Responderemos en un plazo máximo de 20 días hábiles conforme a la ley peruana.
          </p>
          <p>
            Si considera que sus derechos no han sido atendidos, puede presentar una denuncia ante la
            <strong> Autoridad Nacional de Protección de Datos Personales (ANPDP)</strong> del Ministerio de Justicia y Derechos Humanos del Perú.
          </p>
        </section>

        <section className="policy">
          <h2>8. Seguridad de los datos</h2>
          <p>
            Implementamos medidas técnicas y organizativas razonables para proteger sus datos contra acceso no autorizado,
            pérdida o alteración, incluyendo:
          </p>
          <ul>
            <li>Conexiones cifradas (HTTPS/TLS) en toda la plataforma</li>
            <li>Autenticación segura mediante Google OAuth</li>
            <li>Acceso restringido a la base de datos por cuentas de servicio</li>
            <li>Monitoreo de errores y accesos sospechosos</li>
          </ul>
          <p>
            Sin embargo, ningún sistema es 100% infalible. En caso de detectar una vulneración de datos, notificaremos
            a los afectados conforme a lo dispuesto por la ley.
          </p>
        </section>

        <section className="policy">
          <h2>9. Cookies y tecnologías similares</h2>
          <p>
            Agendi utiliza cookies estrictamente necesarias para el funcionamiento del servicio (sesión de usuario,
            preferencias). No usamos cookies de publicidad ni rastreo de terceros.
          </p>
        </section>

        <section className="policy">
          <h2>10. Transferencias internacionales</h2>
          <p>
            Algunos de nuestros proveedores tecnológicos (Google, Vercel, Meta) almacenan datos en servidores ubicados
            fuera del Perú. Estas transferencias se realizan bajo cláusulas contractuales que garantizan un nivel
            adecuado de protección, conforme a la legislación aplicable.
          </p>
        </section>

        <section className="policy">
          <h2>11. Cambios a esta política</h2>
          <p>
            Podemos actualizar esta política para reflejar cambios en nuestros servicios o en la regulación aplicable.
            La fecha de última actualización aparece al inicio del documento. Si los cambios son significativos,
            le notificaremos por correo electrónico o a través de la plataforma.
          </p>
        </section>

        <section className="policy">
          <h2>12. Contacto</h2>
          <div className="contact-card">
            <h3>¿Tienes dudas sobre esta política?</h3>
            <p>
              Escríbenos a <a href="mailto:soporte@agendi.pe">soporte@agendi.pe</a> y responderemos a la brevedad.
            </p>
            <p style={{ marginTop: 12 }}>
              <strong>ECO DRIVE PLUS S.A.C.</strong> — RUC 20613413228<br />
              Operador de la plataforma Agendi.
            </p>
          </div>
        </section>
      </div>

      <footer>
        <p>© 2026 Agendi · Operado por ECO DRIVE PLUS S.A.C. · <a href="/">Volver al inicio</a></p>
      </footer>
    </>
  )
}