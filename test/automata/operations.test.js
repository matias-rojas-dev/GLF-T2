import { upperFirst } from "lodash-es";
import { DFA, NFA } from "../../src/lib/automata/automata.js";
import { dfas } from "./dfas.js";
import { unions, concatenations, intersections, normalizations } from "./operations.js";

function construct(automaton) {
  if (automaton.isNFA) {
    return new NFA({ ...automaton });
  }

  return new DFA({ ...automaton });
}

const descriptions = { union: "Unión", concatenation: "Concatenación", intersection: "Intersección" };

function complement(test) {
  return new DFA({
    ...test,
    states: { ...test.states, final: test.complement.states.final },
  });
}

for (const test of [...unions, ...concatenations, ...intersections]) {
  const lhs = construct(test.lhs);
  const rhs = construct(test.rhs);
  const result = construct(test.result);

  describe(descriptions[test.operation], () => {
    if (test.result != null) {
      it(test.description, () =>
        expect(lhs[test.operation](rhs)).toEqual(result)
      );
    }
  });
}

for (const test of [...normalizations]) {
  const operand = construct(test.operand);

  describe("Complemento", () => {
    if (test.complement != null) {
      it(test.description, () =>
        expect(operand.complement()).toEqual(complement(test))
      );
    }
  });

  describe("Normalización de transiciones", () => {
    if (test.normalized != null) {
      it(test.description, () =>
        expect(operand.normalized()).toEqual(construct(test.normalized))
      );
    }
  });
}
