import { DFA } from "../../src/lib/automata/dfa.js";
import { dfas } from "./dfas.js";

for (const test of dfas) {
  const dfa = new DFA({ ...test });

  describe("Simplificación", () => {
    if (test.minimal != null) {
      it(test.description, () => expect(dfa.minimal()).toEqual(test.minimal));
    }
  });
}
