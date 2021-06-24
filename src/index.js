import React from "react";
import ReactDOM from "react-dom";
import "./assets/styles/index.css";
import Header from "./components/Header.js";
import Optional from "./components/Optional";

export function AutomataForm() {
  return (
    <>
      <Header />
      <Optional />
    </>
  );
}

ReactDOM.render(<AutomataForm />, document.getElementById("root"));
