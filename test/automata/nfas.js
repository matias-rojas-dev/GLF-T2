// prettier-ignore
export const nfas = [
  {
    number: 1,
    description: "AFND 1, equivalencia (libro de TALF, fig. 2.28)",
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
    toDFA: {
      states: {
        all: [
          "q0q1", "q0q1q3", "q0q1q3q4",
          "q1", "q1q2q3q4", "q1q2q4",
          "q2q4", "q3", "q4", "qS",
        ],
        initial: "q0q1",
        final: ["q0q1", "q0q1q3", "q0q1q3q4", "q1", "q1q2q3q4", "q1q2q4"],
      },
      alphabet: ["a", "b"],
      transitions: new Map([
        [ "q0q1",     new Map([["a", "q2q4"],     ["b", "q0q1"] ])],
        [ "q0q1q3",   new Map([["a", "q1q2q4"],   ["b", "q0q1"] ])],
        [ "q0q1q3q4", new Map([["a", "q1q2q3q4"], ["b", "q0q1"] ])],
        [ "q1",       new Map([["a", "q4"],       ["b", "q1"]   ])],
        [ "q1q2q4",   new Map([["a", "q0q1q3q4"], ["b", "q1"]   ])],
        [ "q1q2q3q4", new Map([["a", "q0q1q3q4"], ["b", "q1"]   ])],
        [ "q2q4",     new Map([["a", "q0q1q3"],   ["b", "qS"]   ])],
        [ "q3",       new Map([["a", "q1"],       ["b", "qS"]   ])],
        [ "q4",       new Map([["a", "q3"],       ["b", "qS"]   ])],
        [ "qS",       new Map([["a", "qS"],       ["b", "qS"]   ])],
      ]),
    },
  },
];
