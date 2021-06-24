import React, { useState, useEffect, useMemo } from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Collapse from '@material-ui/core/Collapse';
import TextField from "@material-ui/core/TextField";
import { Switch } from "@material-ui/core";
import { useStyles } from "../utils/makeStyle.js";
import { cloneDeep, difference, first, flatten, uniq } from "lodash-es";
import SimpleSelect from './SimpleSelect.js';
import InputDialog from './InputDialog.js';
import MultiSelect from './MultiSelect.js';
import Transitions from './Transitions.js';
import Content from './Content.js';
import Tabs from './Tabs.js';
import RadioButtonsGroup from './RadioButtonsGroup.js';
import { Debugout } from 'debugout.js';
import { DFA, NFA, Type, Epsilon } from "../lib/automata/automata.js";
import { getLinks, getNodesData } from '../lib/automata/utils.js';

function arrayToString(array) {
  return JSON.stringify(array, null, "  ");
}

function mapToString(map) {
  let flattened = new Map([...map]);

  for (const [key, value] of flattened) {
    flattened.set(key, [...value]);
  }

  return JSON.stringify([...flattened], null, "  ");
}

const types = [
  { value: Type.DFA, label: "AFD" },
  { value: Type.NFA, label: "AFND" },
];

const logs = new Debugout();
let today = new Date();

logs.info('----------BIENVENIDO A LA APP DE AUTÓMATAS---------')

// let defaults = null;

// let defaults = {
//   type: Type.DFA,
//   states: {
//     all: ["q0", "q1", "q2"],
//     initial: "q0",
//     final: ["q0", "q2"],
//   },
//   alphabet: ["a", "b"],
//   transitions: new Map([
//     ["q0", new Map([["a", "q2"], ["b", "q1"]])],
//     ["q1", new Map([["a", "q1"], ["b", "q1"]])],
//     ["q2", new Map([["a", "q0"], ["b", "q1"]])],
//   ])
// }

let defaults = {
  type: Type.NFA,
  states: {
    all: ["q0", "q1", "q2", "q3", "q4"],
    initial: "q0",
    final: ["q1"],
  },
  alphabet: ["a", "b"],
  transitions: new Map([
    ["q0", new Map([["a", "q2"], ["b", "q0"], ["ε", "q1"] ])],
    ["q1", new Map([["a", "q4"], ["b", "q1"] ])],
    ["q2", new Map([["a", "q0"]])],
    ["q3", new Map([["a", "q1"]])],
    ["q4", new Map([["a", "q3"]])],
  ]),
}

const secondDefaults = {
  type: Type.DFA,
  states: {
    all: ["1", "2", "3", "4", "5"],
    initial: "5",
    final: ["2", "3", "4", "5"],
  },
  alphabet: ["a", "b"],
  transitions: new Map([
    ["5", new Map([["a", "4"], ["b", "3"]])],
    ["4", new Map([["a", "4"], ["b", "2"]])],
    ["3", new Map([["a", "4"], ["b", "3"]])],
    ["2", new Map([["a", "4"], ["b", "1"]])],
    ["1", new Map([["a", "1"], ["b", "1"]])],
  ])
}

const Optional = () => {
  const classes = useStyles();

  const [checked, setChecked] = useState(true);

  // Automata 1
  const [specialSequences, setSpecialSequences] = useState([]);
  const [status, setStatus] = useState({ valid: false, reason: "" });
  const [type, setType] = useState(defaults?.type ?? Type.DFA);
  const [allStates, setAllStates] = useState(defaults?.states.all ?? []);
  const [initialState, setInitialState] = useState(defaults?.states.initial ?? "");
  const [finalStates, setFinalStates] = useState(defaults?.states.final ?? []);
  const [alphabet, setAlphabet] = useState(defaults?.alphabet ?? []);
  const [transitions, setTransitions] = useState(defaults?.transitions ?? new Map());
  // Automata 2
  const [secondSpecialSequences, setSecondSpecialSequences] = useState([]);
  const [secondStatus, setSecondStatus] = useState({ valid: false, reason: "" });
  const [secondType, setSecondType] = useState(secondDefaults?.type ?? Type.DFA);
  const [secondAllStates, setSecondAllStates] = useState(secondDefaults?.states.all ?? []);
  const [secondInitialState, setSecondInitialState] = useState(secondDefaults?.states.initial ?? "");
  const [secondFinalStates, setSecondFinalStates] = useState(secondDefaults?.states.final ?? []);
  const [secondAlphabet, setSecondAlphabet] = useState(secondDefaults?.alphabet ?? []);
  const [secondTransitions, setSecondTransitions] = useState(secondDefaults?.transitions ?? new Map());

  const [toggleState, setToggleState] = useState(1);

  // Construye el autómata, si están las condiciones necesarias (determinadas
  // por el constructor del autómata). Si no, retorna `undefined`.
  // Automata 1 :
  const automaton = useMemo(() => {
    try {
      const args = {
        states: { all: allStates, initial: initialState, final: finalStates },
        alphabet,
        transitions
      };

      const automaton = type === Type.NFA ? new NFA(args) : new DFA(args);
      setStatus({ valid: true });
      return automaton;
    } catch (error) {
      setStatus({ valid: false, reason: error.msg });
      return null;
    }
  }, [allStates, initialState, finalStates, alphabet, transitions]);

  // Automata 2 :
  const secondAutomaton = useMemo(() => {
    try {
      const args = {
        states: { all: secondAllStates, initial: secondInitialState, final: secondFinalStates },
        alphabet: secondAlphabet,
        transitions: secondTransitions
      };

      const secondAutomaton = secondType === Type.NFA ? new NFA(args) : new DFA(args);
      setSecondStatus({ valid: true });
      return secondAutomaton;
    } catch (error) {
      setSecondStatus({ valid: false, reason: error.msg });
      return null;
    }
  }, [secondAllStates, secondInitialState, secondFinalStates, secondAlphabet, secondTransitions]);

  const toggleTab = (index) => {
    setToggleState(index);
  };

  function handleSpecialSequencesChange(value) {
    setSpecialSequences(
      uniq(
        value
          .replace(/\s+/g, "")
          .split(",")
          .filter((special) => special.length > 0)
      )
    );
    logs.info(`[${today.getFullYear()}/${today.getDay()}/${today.getDate()} - ${today.getHours()}:${today.getMinutes()}]`, 'Cambio en las secuencias especiales del autómata 1')
  }

  function handleSecondSpecialSequencesChange(value) {
    setSecondSpecialSequences(
      uniq(
        value
          .replace(/\s+/g, "")
          .split(",")
          .filter((special) => special.length > 0)
      )
    );
    logs.info(`[${today.getFullYear()}/${today.getDay()}/${today.getDate()} - ${today.getHours()}:${today.getMinutes()}]`, 'Cambio en las secuencias especiales del autómata 2')
  }


  /////////////////////////////////////////////////////////////////
  //! HANDLE ALL STATES CHANGES
  function handleAllStatesChange(value) {
    setAllStates(
      uniq(
        value
          .replace(/\s+/g, "")
          .split(",")
          .filter((symbol) => symbol.length > 0)
      )
    );
    logs.info(`[${today.getFullYear()}/${today.getDay()}/${today.getDate()} - ${today.getHours()}:${today.getMinutes()}]`, 'Cambio en los estados del autómata 1')

  };
  function handleAllSecondStatesChange(value) {
    setSecondAllStates(
      uniq(
        value
          .replace(/\s+/g, "")
          .split(",")
          .filter((symbol) => symbol.length > 0)
       )
    );
    logs.info(`[${today.getFullYear()}/${today.getDay()}/${today.getDate()} - ${today.getHours()}:${today.getMinutes()}]`, 'Cambio en los estados del autómata 2')
  };
  /////////////////////////////////////////////////////////////////
  //! HANDLE INITIAL STATE CHANGES
  function handleInitialStateChange(event) {
    setInitialState(event.target.value);
    logs.info(`[${today.getFullYear()}/${today.getDay()}/${today.getDate()} - ${today.getHours()}:${today.getMinutes()}]`, 'Cambio en el estado inicial del autómata 1')
  };
  function handleSecondInitialStateChange(event) {
    setSecondInitialState(event.target.value);
    logs.info(`[${today.getFullYear()}/${today.getDay()}/${today.getDate()} - ${today.getHours()}:${today.getMinutes()}]`, 'Cambio en el estado inicial del autómata 2')
  };
  /////////////////////////////////////////////////////////////////
  //! HANDLE FINAL STATE CHANGES
  function handleFinalStatesChange(event) {
    setFinalStates(event.target.value);
    logs.info(`[${today.getFullYear()}/${today.getDay()}/${today.getDate()} - ${today.getHours()}:${today.getMinutes()}]`, 'Cambio en los estados finales del autómata 1')
  };
  function handleSecondFinalStatesChange(event) {
    setSecondFinalStates(event.target.value);
    logs.info(`[${today.getFullYear()}/${today.getDay()}/${today.getDate()} - ${today.getHours()}:${today.getMinutes()}]`, 'Cambio en los estados finales del autómata 2')
  };
  /////////////////////////////////////////////////////////////////
  //! HANDLE ALPHABET CHANGES
  function handleAlphabetChange(value) {
    setAlphabet(uniq(value.split("")));
    logs.info(`[${today.getFullYear()}/${today.getDay()}/${today.getDate()} - ${today.getHours()}:${today.getMinutes()}]`, 'Cambio en el alfabeto del autómata 1')
  }
  function handleSecondAlphabetChange(value) {
    setSecondAlphabet(uniq(value.split("")));
    logs.info(`[${today.getFullYear()}/${today.getDay()}/${today.getDate()} - ${today.getHours()}:${today.getMinutes()}]`, 'Cambio en el alfabeto del autómata 2')
  }
  /////////////////////////////////////////////////////////////////
  //! HANDLE TRANSITION CHANGES
  function handleTransitionsChange(state, reading, event) {
    logs.info(`[${today.getFullYear()}/${today.getDay()}/${today.getDate()} - ${today.getHours()}:${today.getMinutes()}]`, 'Cambio en las transiciones del autómata 1')
    let copy = cloneDeep(transitions);

    const value = flatten([event.target.value]).filter((e) => e != null);
    const output = value.length === 1 ? first(value) : value;

    if (value.length > 0) {
      copy.set(
        state,
        new Map([...(copy.get(state) ?? []), [reading, output]])
      );
    } else {
      copy.get(state)?.delete(reading);

      if (copy.has(state) && copy.get(state).size === 0) {
        copy.delete(state);
      }
    }

    setTransitions(copy);
  }

  function handleTransitionsChangeSecond(state, reading, event) {
    logs.info(`[${today.getFullYear()}/${today.getDay()}/${today.getDate()} - ${today.getHours()}:${today.getMinutes()}]`, 'Cambio en las transiciones del autómata 2')
    let copy = cloneDeep(secondTransitions);

    const value = flatten([event.target.value]).filter((e) => e != null);
    const output = value.length === 1 ? first(value) : value;

    if (value.length > 0) {
      copy.set(
        state,
        new Map([...(copy.get(state) ?? []), [reading, output]])
      );
    } else {
      copy.get(state)?.delete(reading);

      if (copy.has(state) && copy.get(state).size === 0) {
        copy.delete(state);
      }
    }

    setSecondTransitions(copy);
  }

  useEffect(() => {
    // Si el estado inicial ya no está contenido en el conjunto de estados,
    // asignarle un estado existente.
    if (!allStates.includes(initialState)) {
      setInitialState(first(allStates));
    }

    const removedFinal = finalStates.filter((state) => !allStates.includes(state));
    if (removedFinal.length > 0) {
      setFinalStates(difference(finalStates, removedFinal));
    }
  }, [allStates]);

  useEffect(() => {
    if (!secondAllStates.includes(secondInitialState)) {
      setSecondInitialState(first(secondAllStates));
    }

    const removedFinal = secondFinalStates.filter((state) => !secondAllStates.includes(state));
    if (removedFinal.length > 0) {
      setSecondFinalStates(difference(secondFinalStates, removedFinal));
    }
  }, [secondAllStates]);

  useEffect(() => {
    let copy = cloneDeep(transitions);

    for (const [input, outputs] of copy) {
      if (!allStates.includes(input)) {
        copy.delete(input);
        continue;
      }

      for (const [reading, output] of outputs) {
        // Elimina la salida que contenga un símbolo que no esté en el alfabeto.
        if (![...alphabet, ...(type === Type.NFA ? [Epsilon.symbol] : [])].includes(reading) || !allStates.includes(output)) {
          copy.get(input).delete(reading);
        }
      }

      // Elimina las transiciones vacías.
      if (copy.get(input).size === 0) {
        copy.delete(input);
      }
    }

    setTransitions(copy);
  }, [allStates, alphabet]);

  useEffect(() => {
    let copy = cloneDeep(secondTransitions);

    for (const [input, outputs] of copy) {
      if (!secondAllStates.includes(input)) {
        copy.delete(input);
        continue;
      }

      for (const [reading, output] of outputs) {
        // Elimina la salida que contenga un símbolo que no esté en el alfabeto.
        if (![...secondAlphabet, ...(secondType === Type.NFA ? [Epsilon.symbol] : [])].includes(reading) || !secondAllStates.includes(output)) {
          copy.get(input).delete(reading);
        }
      }

      // Elimina las transiciones vacías.
      if (copy.get(input).size === 0) {
        copy.delete(input);
      }
    }

    setSecondTransitions(copy);
  }, [secondAllStates, secondAlphabet]);



  function handleChange() {
    setChecked((prev) => !prev);
  };
  // Cambios en el tipo del autómata
  // Automata 1 :
  function handleTypeChange(type) {
    // Forzar la actualización de los props del componente.
    function forceUpdate() {
      setAllStates([...allStates]);
      setInitialState(initialState);
      setFinalStates([...finalStates]);
      setAlphabet([...alphabet]);
      setTransitions(cloneDeep(transitions));
    }

    switch (type) {
      // Conversión AFND a AFD.
      case Type.DFA: {
        // Si el NFA es válido, realizar la conversión utilizando `DFA.from`.
        if (automaton != null) {
          const dfa = DFA.from({ nfa: automaton }).minimal();
          setAllStates(dfa.states.all);
          setInitialState(dfa.states.initial);
          setFinalStates(dfa.states.final);
          setAlphabet(dfa.alphabet);
          setTransitions(dfa.transitions);
          setSpecialSequences([]);
        }

        // Si no, forzar la actualización de los datos. A diferencia de la
        // conversión AFD => AFND, un AFND inválido es un AFD inválido.
        else {
          forceUpdate();
        }

        break;
      }

      // Conversión AFD a AFND.
      // Forzar la actualización de todos los campos, para a su vez, forzar la
      // creación de un nuevo NFA (un AFD no válido transformado a AFND puede
      // que sea válido).
      case Type.NFA:
        forceUpdate();
        break;
    }

    setType(type);
  }

  // Automata 2 :
  function handleSecondTypeChange(secondType) {
    // Forzar la actualización de los props del componente.
    function forceUpdate() {
      setSecondAllStates([...secondAllStates]);
      setSecondInitialState(secondInitialState);
      setSecondFinalStates([...secondFinalStates]);
      setSecondAlphabet([...secondAlphabet]);
      setSecondTransitions(cloneDeep(secondTransitions));
    }

    switch (secondType) {
      // Conversión AFND a AFD.
      case Type.DFA: {
        // Si el NFA es válido, realizar la conversión utilizando `DFA.from`.
        if (secondAutomaton != null) {
          const dfa = DFA.from({ nfa: secondAutomaton }).minimal();
          setSecondAllStates(dfa.states.all);
          setSecondInitialState(dfa.states.initial);
          setSecondFinalStates(dfa.states.final);
          setSecondAlphabet(dfa.alphabet);
          setSecondTransitions(dfa.transitions);
          setSecondSpecialSequences([]);
        }

        // Si no, forzar la actualización de los datos. A diferencia de la
        // conversión AFD => AFND, un AFND inválido es un AFD inválido.
        else {
          forceUpdate();
        }

        break;
      }

      // Conversión AFD a AFND.
      // Forzar la actualización de todos los campos, para a su vez, forzar la
      // creación de un nuevo NFA (un AFD no válido transformado a AFND puede
      // que sea válido).
      case Type.NFA:
        forceUpdate();
        break;
    }

    setSecondType(secondType);
  }

  const setValues = () => {
    setAllStates([]);
    setInitialState('');
    setFinalStates([]);
    setAlphabet([]);
    setTransitions(new Map());
    setSpecialSequences([]);
    setStatus({ valid: false, msg: "" });

    setSecondAllStates([]);
    setSecondInitialState('');
    setSecondFinalStates([]);
    setSecondAlphabet([]);
    setSecondTransitions(new Map());
    setSecondSpecialSequences([]);
    setSecondStatus({ valid: false, msg: "" });
  }

  function renderAutomaton() {
    let minimal;

    if (type === Type.NFA && automaton != null) {
      minimal = DFA.from({ nfa: automaton }).minimal();
    }

    return (
      <>
        <Content
          data={getNodesData(allStates, finalStates, initialState)}
          linksData={getLinks(automaton?.transitions ?? transitions)}
          isDirected={true}
        />
        {type === Type.NFA && status.valid && (
          <>
            <h3>AFD equivalente, simplificado:</h3>
            <Content
              data={getNodesData(minimal?.states.all, minimal?.states.final, minimal?.states.initial)}
              linksData={getLinks(minimal?.transitions)}
              isDirected={true}
            />
          </>
        )}
      </>
    );
  }

  function renderSecondAutomaton() {
    let minimal;

    if (secondType === Type.NFA && secondAutomaton != null) {
      minimal = DFA.from({ nfa: secondAutomaton }).minimal();
    }

    return (
      <>
        <Content
          data={getNodesData(secondAllStates, secondFinalStates, secondInitialState)}
          linksData={getLinks(secondAutomaton?.transitions ?? secondTransitions)}
          isDirected={true}
        />
        {secondType === Type.NFA && secondStatus.valid && (
          <>
            <h3>AFD equivalente, simplificado:</h3>
            <Content
              data={getNodesData(minimal.states.all, minimal.states.final, minimal.states.initial)}
              linksData={getLinks(minimal.transitions)}
              isDirected={true}
            />
          </>
        )}
      </>
    );
  }

  function renderData() {
    return (
      <>
        Datos autómata 1:
        <div> - Tipo: {type}</div>
        <div> - Estados: {arrayToString(allStates)}</div>
        <div> - Estado inicial: {initialState}</div>
        <div> - Estados finales: {arrayToString(finalStates)}</div>
        <div> - Alfabeto: {arrayToString(alphabet)}</div>
        <div> - Transiciones: {mapToString(transitions)}</div>
        <div> - Secuencias especiales: {arrayToString(specialSequences)}</div>
        <div> - Estado: {status.valid ? "Autómata válido" : "Autómata inválido: " + status.reason}</div>
        Datos autómata 2:
        <div> - Tipo: {secondType}</div>
        <div> - Estados: {arrayToString(secondAllStates)}</div>
        <div> - Estado inicial: {secondInitialState}</div>
        <div> - Estados finales: {arrayToString(secondFinalStates)}</div>
        <div> - Alfabeto: {arrayToString(secondAlphabet)}</div>
        <div> - Transiciones: {mapToString(secondTransitions)}</div>
        <div> - Secuencias especiales: {arrayToString(specialSequences)}</div>
        <div> - Estado: {secondStatus.valid ? "Autómata válido" : "Autómata inválido: " + secondStatus.reason}</div>
      </>
    );
  }

  if (type === 'dfa') {
    console.log(automaton + 'es DFA');
  } else console.log(automaton + ' es NFA')

  if (secondType === 'dfa') {
    console.log(secondAutomaton + ' es DFA')
  } else console.log(secondAutomaton + ' es NFA')

  return (
    <>
      <div className='container'>
        <div className='automata-header-container'>
          <button
            className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
            onClick={() => toggleTab(1)}
          > Automata 1
          </button>
          <button
            className={toggleState === 2 ? "tabs active-tabs" : "tabs"}
            onClick={() => toggleTab(2)}
          > Automata 2
          </button>
        </div>
        <div>
          {/* {renderData()} */}
        </div>
        <div>
          <FormControlLabel
            className={classes.container}
            control={<Switch checked={checked} onChange={handleChange} />}
            label={checked === true ? 'Ocultar' : 'Mostrar'}
          />
          <Collapse in={checked} >
            <div className='collapse-container'>
              <div className={toggleState === 1 ? "content-tabs  active-content-tabs" : "content-tabs"}>
                <form className={classes.root} noValidate autoComplete="off" aria-readonly={true}>
                  <h2 className='title-sectiion'>Automata 1</h2>
                  <div className={classes.container}>
                    <div>
                      <div style={{ marginLeft: 10 }}>
                        <RadioButtonsGroup
                          options={types}
                          value={type}
                          onChange={handleTypeChange}
                        >
                          Tipo de autómata
                        </RadioButtonsGroup>
                      </div>
                      <div>
                        <InputDialog
                          values={allStates}
                          label="Estados"
                          join=", "
                          onChange={handleAllStatesChange}
                        >
                          <p style={{ marginTop: 0, fontSize: "0.9rem" }}>
                            Ingrese los estados del autómata, separados por comas.
                          </p>
                          <p style={{ paddingBottom: 10, fontSize: "0.9rem" }}>
                            Espacios y estados duplicados son ignorados.
                          </p>
                        </InputDialog>
                      </div>
                      <div>
                        <SimpleSelect
                          options={allStates}
                          value={initialState}
                          onChange={handleInitialStateChange}
                          nullable={false}
                          helperText="Seleccione el estado inicial."
                          minWidth={200}
                        >
                          Estado inicial
                        </SimpleSelect>
                      </div>
                      <div>
                        <MultiSelect
                          options={allStates}
                          value={finalStates}
                          onChange={handleFinalStatesChange}
                          helperText="Seleccione los estados finales."
                          minWidth={200}
                        >
                          Estados finales
                        </MultiSelect>
                      </div>
                      <div>
                        <InputDialog
                          values={alphabet}
                          label="Alfabeto de entrada"
                          join=""
                          onChange={handleAlphabetChange}
                        >
                          <p style={{ marginTop: 0, fontSize: "0.9rem" }}>
                            Ingrese los símbolos del alfabeto de entrada,
                          </p>
                          <p style={{ paddingBottom: 10, fontSize: "0.9rem" }}>
                            Espacios y símbolos duplicados son ignorados.
                          </p>
                        </InputDialog>
                      </div>
                      <div>
                        {type === Type.NFA &&
                        	(
                            <InputDialog
                              values={specialSequences}
                              label="Secuencias especiales"
                              join=", "
                              onChange={handleSpecialSequencesChange}
                              isError={
                                (value) =>
                                  value
                                    .split("")
                                    .filter((e) => ![" ", ","].includes(e))
                                    .some((e) => !alphabet.includes(e))
                              }
                              helpers={{ error: "Uno de los carácteres no pertenece al alfabeto." }}
                            >
                              <p style={{ marginTop: 0, fontSize: "0.9rem" }}>
                                Ingrese las secuencias de lectura especiales del autómata,
                              </p>
                              <p style={{ marginTop: 0, fontSize: "0.9rem" }}>
                                separadas por comas. Espacios y secuencias duplicadas
                              </p>
                              <p style={{ paddingBottom: 10, fontSize: "0.9rem" }}>
                                son ignoradas.
                              </p>
                            </InputDialog>
                          )
                        }
                      </div>
                      <div>
                        <TextField
                          id="status"
                          label="Estado"
                          multiline
                          error={!status.valid}
                          value={status.reason?.length > 0 ? `Inválido: ${status.reason}` : "Válido."}
                          InputProps={{
                            readOnly: true,
                          }}
                          variant="outlined"
                        />
                      </div>
                    </div>
                    <div>
                      {type === Type.NFA ? (
                        <Transitions
                          type={type}
                          transitions={transitions}
                          alphabet={[...alphabet, Epsilon.symbol, ...specialSequences]}
                          states={allStates}
                          onChange={handleTransitionsChange}
                        />
                      ) : (
                        <Transitions
                          type={type}
                          transitions={transitions}
                          alphabet={alphabet}
                          states={allStates}
                          onChange={handleTransitionsChange}
                        />
                      )}
                    </div>
                  </div>
                </form>
              </div>
              <div className={toggleState === 2 ? "content-tabs  active-content-tabs" : "content-tabs"}>
                <form className={classes.root} noValidate autoComplete="off">
                  <h2 className='title-sectiion'>Automata 2</h2>
                  <div className={classes.container}>
                    <div>
                      <div style={{ marginLeft: 10 }}>
                      <RadioButtonsGroup
                          options={types}
                          value={secondType}
                          onChange={handleSecondTypeChange}
                        >
                          Tipo de autómata
                        </RadioButtonsGroup>
                      </div>
                      <div>
                        <InputDialog
                          values={secondAllStates}
                          label="Estados"
                          join=", "
                          onChange={handleAllSecondStatesChange}
                        >
                          <p style={{ marginTop: 0, fontSize: "0.9rem" }}>
                            Ingrese los estados del autómata, separados por comas.
                          </p>
                          <p style={{ paddingBottom: 10, fontSize: "0.9rem" }}>
                            Espacios y estados duplicados son ignorados.
                          </p>
                        </InputDialog>
                      </div>
                      <div>
                        <SimpleSelect
                          options={secondAllStates}
                          value={secondInitialState}
                          onChange={handleSecondInitialStateChange}
                          helperText="Seleccione el estado inicial."
                          minWidth={200}
                        >
                          Estado inicial
                        </SimpleSelect>
                      </div>
                      <div>
                        <MultiSelect
                          options={secondAllStates}
                          value={secondFinalStates}
                          onChange={handleSecondFinalStatesChange}
                          helperText="Seleccione los estados finales."
                          minWidth={200}
                        >
                          Estados finales
                        </MultiSelect>
                      </div>
                      <div>
                        <InputDialog
                          values={secondAlphabet}
                          label="Alfabeto de entrada"
                          join=""
                          onChange={handleSecondAlphabetChange}
                        >
                          <p style={{ marginTop: 0, fontSize: "0.9rem" }}>
                            Ingrese los símbolos del alfabeto de entrada.
                          </p>
                          <p style={{ paddingBottom: 10, fontSize: "0.9rem" }}>
                            Espacios y símbolos duplicados son ignorados.
                          </p>
                        </InputDialog>
                      </div>
                      <div>
                        {secondType === Type.NFA &&
                        	(
                            <InputDialog
                              values={secondSpecialSequences}
                              label="Secuencias especiales"
                              join=", "
                              onChange={handleSecondSpecialSequencesChange}
                              isError={
                                (value) =>
                                  value
                                    .split("")
                                    .filter((e) => ![" ", ","].includes(e))
                                    .some((e) => !alphabet.includes(e))
                              }
                              helpers={{ error: "Uno de los carácteres no pertenece al alfabeto." }}
                            >
                              <p style={{ marginTop: 0, fontSize: "0.9rem" }}>
                                Ingrese las secuencias de lectura especiales del autómata,
                              </p>
                              <p style={{ marginTop: 0, fontSize: "0.9rem" }}>
                                separadas por comas. Espacios y secuencias duplicadas
                              </p>
                              <p style={{ paddingBottom: 10, fontSize: "0.9rem" }}>
                                son ignoradas.
                              </p>
                            </InputDialog>
                          )
                        }
                      </div>
                      <div>
                        <TextField
                          id="status"
                          label="Estado"
                          multiline
                          error={!secondStatus.valid}
                          value={secondStatus.reason?.length > 0 ? `Inválido: ${secondStatus.reason}` : "Válido."}
                          InputProps={{
                            readOnly: true,
                          }}
                          variant="outlined"
                        />
                      </div>
                    </div>
                    <div>
                      {secondType === Type.NFA ? (
                        <Transitions
                          type={secondType}
                          transitions={secondTransitions}
                          alphabet={[...secondAlphabet, Epsilon.symbol, ...secondSpecialSequences]}
                          states={secondAllStates}
                          onChange={handleTransitionsChangeSecond}
                        />
                      ) : (
                        <Transitions
                          type={secondType}
                          transitions={secondTransitions}
                          alphabet={secondAlphabet}
                          states={secondAllStates}
                          onChange={handleTransitionsChangeSecond}
                        />
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className='collapse-container margin'>
              <button onClick={setValues} className='button-logs'>
                Limpiar campos
              </button>
            </div>
          </Collapse>
          <div style={{ width: "100%", textAlign: "center" }}>
            <div style={{ display: "inline-block", fontFamily: "Roboto" }}>
              Los estados con color naranjo son finales y los blancos no finales.
              El estado inicial se denota por el nombre del estado entre corchetes (por ej, {"{q0}"}).
            </div>
          </div>
        </div>
      </div>
      <div className='collapse-container'>
        <div className='initial-automaton-text-center'>
          <h2>Automata 1 inicial</h2>
          {renderAutomaton()}
        </div>
        <div className='initial-automaton-text-center'>
          <h2>Automata 2 inicial</h2>
          {renderSecondAutomaton()}
        </div>
        <div>

        </div>
      </div>
      <Tabs
        lhs={automaton}
        rhs={secondAutomaton}
        lhsType={type}
        rhsType={secondType}
      />
      <div className='collapse-container'>
        <button className='button-logs' onClick={() => logs.downloadLog()}>
          Descargar logs
        </button>
      </div>
    </>
  )
}

export default Optional;
