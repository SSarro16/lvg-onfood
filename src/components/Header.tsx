import lvglogo from "../lvglogo/lvglogo.png";

export default function Header() {
  return (
    <div>
      <header>
        <img src={lvglogo} />
        <h1>titolo</h1>
        <p>messagge</p>
      </header>
    </div>
  );
}
