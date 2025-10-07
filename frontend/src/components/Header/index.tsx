import React from "react";

import lvglogo from '../../assets/lvglogo.png'

import type { HeaderComponentProps } from "./types";

const Header: React.FC<HeaderComponentProps> = (props) => {
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <header className="header-content">
        <img src={lvglogo} className="header-logo" />
        <h1 className="header-title">{props.title}</h1>
        <p className="header-p">{props.message}</p>
      </header>
    </div>
  );
};

export default Header;
