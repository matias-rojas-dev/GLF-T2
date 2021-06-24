import { DFA, NFA } from "../src/lib/automata/automata.js";
import { nfas } from "./automata/nfas.js";
import { normalizations } from "./automata/operations.js";

function displayUnary(operation, test) {
  let nfa = new NFA({
    states: test.states,
    alphabet: test.alphabet,
    transitions: test.transitions,
  });

  console.log(nfa);
  console.log(nfa[operation]());
}

function displayBinary(operation, test) {
  const lhs = new DFA({
    states: test.lhs.states,
    alphabet: test.lhs.alphabet,
    transitions: test.lhs.transitions,
  });

  const rhs = new DFA({
    states: test.rhs.states,
    alphabet: test.rhs.alphabet,
    transitions: test.rhs.transitions,
  });

  console.log(lhs);
  console.log(rhs);
  console.log(lhs[operation](rhs));
}

// displayBinary("intersection", intersections[0]);
displayUnary("normalize", normalizations[0]);

function mapToString(map) {
  let flattened = new Map([...map]);

  for (const [key, value] of flattened) {
    flattened.set(key, [...value]);
  }

  return JSON.stringify([...flattened], null, "  ");
}

// console.log(nfa);
// console.log(nfa.toDFA());
