import lvglogo from "../lvglogo/lvglogo.png";

export default function Header(title: string, message: string) {
  return (
    <div>
      <header>
        <img src={lvglogo} />
        <h1>{title}</h1>
        <p>{message}</p>
      </header>
    </div>
  );
}
