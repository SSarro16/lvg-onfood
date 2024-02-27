import React from "react";

import lvglogo from '../../assets/lvglogo.png'

import type { HeaderComponentProps } from "./types";

const Header: React.FC<HeaderComponentProps> = (props) => {
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
