import React from "react";
import lvglogo from '../lvglogo/lvglogo.png'

const Header: React.FC<{ title: string, message: string }> = (props) => {
  return (
    <div>
      <header>
        <img src={lvglogo} />
        <h1>{props.title}</h1>
        <p>{props.message}</p>
      </header>
    </div>
  );
};

export default Header;
