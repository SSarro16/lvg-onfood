import lvglogo from "../lvglogo/lvglogo.png";

export default function Header() {
  return (
    <div>
      <header>
        <img src={lvglogo} />
        <h1>Benvenuti al LVG Online Food</h1>
        <p>
          Qui potrai prenotare e visionare tutti i prodotti offerti dal nostro
          servizio di gastronomia e sarai aggiornato anche sui prodotti che sono
          in lavorazione
        </p>
      </header>
    </div>
  );
}
