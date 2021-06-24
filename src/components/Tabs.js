import React, { useState } from "react";
import { DFA, Type } from "../lib/automata/automata.js";
import { getLinks, getNodesData } from "../lib/automata/utils";
import Content from "./Content";

function checkNull(lhs, rhs) {
  if (lhs == null || rhs == null) {
    return (
      <h3 className="text-error">
        El autómata resultante es inválido dado que alguno de los componentes
        iniciales es inválido
      </h3>
    );
  }
}

function forceDFA(automaton) {
  if (automaton == null) {
    return null;
  }

  if (automaton instanceof DFA) {
    return automaton;
  }

  return DFA.from({ nfa: automaton }).minimal();
}

function status(type) {
  if (type === Type.DFA) {
    return "inicial";
  }

  return "(convertido a AFD y simplificado)";
}

function statuses(lhsType, rhsType) {
  if (lhsType === Type.NFA && rhsType === Type.NFA) {
    return "autómatas 1 y 2 transformados a AFD y simplificados";
  } else if (lhsType === Type.NFA) {
    return "autómata 1 transformado a AFD y simplificado";
  } else if (rhsType === Type.NFA) {
    return "autómata 2 transformado a AFD y simplificado";
  } else {
    return "resultado";
  }
}

const Tabs = ({ lhs, rhs, lhsType, rhsType }) => {

  const [toggleState, setToggleState] = useState(1);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  function renderAutomaton(automaton) {
    return (
      <Content
        data={getNodesData(
          automaton?.states.all,
          automaton?.states.final,
          automaton?.states.initial
        )}
        linksData={getLinks(automaton?.transitions)}
        isDirected={true}
      />
    );
  }
  return (
    <div className="container-tabs">
      <div className="bloc-tabs">
        {["Simplificación", "Complementos", "Unión", "Concatenación", "Intersección"].map((value, index) => (
          <button
            className={toggleState === index + 1 ? "tabs active-tabs" : "tabs"}
            onClick={() => toggleTab(index + 1)}
          >
            {value}
          </button>
        ))}
      </div>

      <div className="content-fg-tabs">
        <div
          className={
            toggleState === 1
              ? "content-tabs  active-content-tabs"
              : "content-tabs"
          }
        >
          <div className="flex-diagrama-content">
            {checkNull(lhs, rhs)}
            <div className='aux-flex'>
              <div className='aux-flex-child'>
                <h2 className='text-child'>Automata 1 {status(lhsType)}</h2>
                {renderAutomaton(forceDFA(lhs)?.minimal())}
              </div>
              <div className='aux-flex-child'>
                <h2 className='text-child'>Automata 2 {status(rhsType)}</h2>
                {renderAutomaton(forceDFA(rhs)?.minimal())}
              </div>
            </div>
          </div>
        </div>

        <div
          className={
            toggleState === 2
              ? "content-tabs  active-content-tabs"
              : "content-tabs"
          }
        >
          <div className="flex-diagrama-content">
            {checkNull(lhs, rhs)}

            <div className='aux-flex'>
              <div className='aux-flex-child'>
                <h2 className='text-child'>Automata 1 {status(lhsType)}</h2>
                {renderAutomaton(forceDFA(lhs)?.complement())}
              </div>
              <div className='aux-flex-child'>
                <h2 className='text-child'>Automata 2 {status(rhsType)}</h2>
                {renderAutomaton(forceDFA(rhs)?.complement())}
              </div>

            </div>
          </div>
        </div>

        <div
          className={
            toggleState === 3
              ? "content-tabs  active-content-tabs"
              : "content-tabs"
          }
        >
          <div className="flex-diagrama-content">
            {checkNull(lhs, rhs)}

            <div className='aux-container-flex'>
              {renderAutomaton(lhs?.union(rhs))}
              <h2 className='text-child-2'>Unión convertida a AFD y simplificada</h2>
              {renderAutomaton(forceDFA(lhs?.union(rhs)))}
            </div>
          </div>
        </div>

        <div
          className={
            toggleState === 4
              ? "content-tabs  active-content-tabs"
              : "content-tabs"
          }
        >
          <div className="flex-diagrama-content">
            {checkNull(lhs, rhs)}

            <div className='aux-container-flex'>
              {renderAutomaton(lhs?.concatenation(rhs))}
              <h2 className='text-child-2'>Concatenación convertida a AFD y simplificada</h2>
              {renderAutomaton(forceDFA(lhs?.concatenation(rhs)))}
            </div>
          </div>
        </div>

        <div
          className={
            toggleState === 5
              ? "content-tabs  active-content-tabs"
              : "content-tabs"
          }
        >
          <div className="flex-diagrama-content">
            {checkNull(lhs, rhs)}

            <div className='aux-flex-2'>
              <div className='aux-flex-child-2'>
                <h2 className='text-child'>Intersección ({statuses(lhsType, rhsType)})</h2>
                {renderAutomaton(forceDFA(lhs)?.intersection(forceDFA(rhs)))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
