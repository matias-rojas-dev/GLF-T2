import { DFA, NFA } from "../../src/lib/automata/automata.js";
import { nfas } from "./nfas.js";

for (const test of nfas) {
  const nfa = new NFA({ ...test });

  describe("Conversión AFND a AFD", () => {
    if (test.toDFA != null) {
      it(test.description, () => expect(DFA.from({ nfa })).toEqual(test.toDFA));
    }
  });
}
