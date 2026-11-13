import React from "react";

const contactCards = [
  {
    icon: "pi pi-phone",
    title: "Telefono",
    value: "+39 091 000 0000",
    text: "Per disponibilita e informazioni sul banco.",
    href: "tel:+390910000000",
  },
  {
    icon: "pi pi-envelope",
    title: "Email",
    value: "info@lvgonfood.it",
    text: "Richieste, assistenza e gestione prodotti.",
    href: "mailto:info@lvgonfood.it",
  },
  {
    icon: "pi pi-map-marker",
    title: "Sede",
    value: "Palermo, Sicilia",
    text: "Lo Verde Gastronomy · ritiro in sede.",
  },
];

export default function ContactPage() {
  return (
    <section className="lvg-contact-page">
      <div className="lvg-page-hero">
        <span className="lvg-hero__badge">
          <i className="pi pi-send" aria-hidden="true" />
          Contatti
        </span>
        <h1>Parla con la gastronomia</h1>
        <p>
          Una pagina contatti chiara, calda e coerente col nuovo brand:
          telefono, email, posizione e orari del banco.
        </p>
      </div>

      <div className="lvg-contact-layout">
        <div className="lvg-contact-stack">
          {contactCards.map((card) => {
            const content = (
              <>
                <i className={card.icon} aria-hidden="true" />
                <span>{card.title}</span>
                <strong>{card.value}</strong>
                <p>{card.text}</p>
              </>
            );

            return card.href ? (
              <a className="lvg-contact-card" href={card.href} key={card.title}>
                {content}
              </a>
            ) : (
              <div className="lvg-contact-card" key={card.title}>
                {content}
              </div>
            );
          })}
        </div>

        <form className="lvg-form-card lvg-contact-form">
          <div className="lvg-field">
            <label htmlFor="contact-name">Nome</label>
            <input id="contact-name" name="name" type="text" placeholder="Il tuo nome" />
          </div>
          <div className="lvg-field">
            <label htmlFor="contact-email">Email</label>
            <input id="contact-email" name="email" type="email" placeholder="nome@email.it" />
          </div>
          <div className="lvg-field">
            <label htmlFor="contact-message">Messaggio</label>
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              placeholder="Scrivi il tuo messaggio"
            />
          </div>
          <button className="lvg-cta lvg-cta--primary" type="button">
            <i className="pi pi-send" aria-hidden="true" />
            Invia messaggio
          </button>
        </form>
      </div>

      <div className="lvg-map-placeholder">
        <i className="pi pi-map" aria-hidden="true" />
        <div>
          <strong>Mappa / indicazioni</strong>
          <p>Box placeholder per embed Google Maps.</p>
        </div>
      </div>
    </section>
  );
}
