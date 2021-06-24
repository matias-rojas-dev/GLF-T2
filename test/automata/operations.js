// prettier-ignore
export const unions = [
  {
    number: 1,
    description: "Unión 1: 2 AFDs",
    operation: "union",
    lhs: {
      isNFA: false,
      states: {
        all: ["A", "B", "C", "D"],
        initial: "A",
        final: ["C"],
      },
      alphabet: ["a", "b"],
      transitions: new Map([
        [
          "A",
          new Map([
            ["a", "B"],
            ["b", "D"],
          ]),
        ],
        [
          "B",
          new Map([
            ["a", "B"],
            ["b", "C"],
          ]),
        ],
        [
          "C",
          new Map([
            ["a", "B"],
            ["b", "C"],
          ]),
        ],
        [
          "D",
          new Map([
            ["a", "D"],
            ["b", "D"],
          ]),
        ],
      ]),
    },
    rhs: {
      isNFA: false,
      states: {
        all: ["A", "B", "C", "D"],
        initial: "A",
        final: ["C"],
      },
      alphabet: ["a", "b"],
      transitions: new Map([
        [
          "A",
          new Map([
            ["a", "D"],
            ["b", "B"],
          ]),
        ],
        [
          "B",
          new Map([
            ["a", "C"],
            ["b", "B"],
          ]),
        ],
        [
          "C",
          new Map([
            ["a", "C"],
            ["b", "B"],
          ]),
        ],
        [
          "D",
          new Map([
            ["a", "D"],
            ["b", "D"],
          ]),
        ],
      ]),
    },
    result: {
      isNFA: true,
      states: {
        all: ["q0", "q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"],
        initial: "q0",
        final: ["q3", "q7"],
      },
      alphabet: ["a", "b"],
      transitions: new Map([
        ["q0", new Map([["ε", ["q1", "q5"]]])],
        [
          "q1",
          new Map([
            ["a", "q2"],
            ["b", "q4"],
          ]),
        ],
        [
          "q2",
          new Map([
            ["a", "q2"],
            ["b", "q3"],
          ]),
        ],
        [
          "q3",
          new Map([
            ["a", "q2"],
            ["b", "q3"],
          ]),
        ],
        [
          "q4",
          new Map([
            ["a", "q4"],
            ["b", "q4"],
          ]),
        ],
        [
          "q5",
          new Map([
            ["a", "q8"],
            ["b", "q6"],
          ]),
        ],
        [
          "q6",
          new Map([
            ["a", "q7"],
            ["b", "q6"],
          ]),
        ],
        [
          "q7",
          new Map([
            ["a", "q7"],
            ["b", "q6"],
          ]),
        ],
        [
          "q8",
          new Map([
            ["a", "q8"],
            ["b", "q8"],
          ]),
        ],
      ]),
      minimal: {
        states: {
          all: ["A", "B", "C", "D", "E"],
          initial: "A",
          final: ["C", "E"],
        },
        alphabet: ["a", "b"],
        transitions: new Map([
          [
            "A",
            new Map([
              ["a", "D"],
              ["b", "B"],
            ]),
          ],
          [
            "B",
            new Map([
              ["a", "C"],
              ["b", "B"],
            ]),
          ],
          [
            "C",
            new Map([
              ["a", "C"],
              ["b", "B"],
            ]),
          ],
          [
            "D",
            new Map([
              ["a", "D"],
              ["b", "E"],
            ]),
          ],
          [
            "E",
            new Map([
              ["a", "D"],
              ["b", "E"],
            ]),
          ],
        ]),
      },
    },
  },
];

export const concatenations = [
  {
    number: 1,
    description: "Concatenación 1: 2 AFDs",
    operation: "concatenation",
    lhs: {
      isNFA: false,
      states: {
        all: ["1"],
        initial: "1",
        final: ["1"],
      },
      alphabet: ["a", "b"],
      transitions: new Map([
        [
          "1",
          new Map([
            ["a", "1"],
            ["b", "1"],
          ]),
        ],
      ]),
    },
    rhs: {
      isNFA: false,
      states: {
        all: ["2"],
        initial: "2",
        final: ["2"],
      },
      alphabet: ["a", "b"],
      transitions: new Map([
        [
          "2",
          new Map([
            ["a", "2"],
            ["b", "2"],
          ]),
        ],
      ]),
    },
    result: {
      isNFA: true,
      states: {
        all: ["1", "2"],
        initial: "1",
        final: ["2"],
      },
      alphabet: ["a", "b"],
      transitions: new Map([
        [
          "1",
          new Map([
            ["a", "1"],
            ["b", "1"],
            ["ε", "2"],
          ]),
        ],
        [
          "2",
          new Map([
            ["a", "2"],
            ["b", "2"],
          ]),
        ],
      ]),
    },
  },
];

export const intersections = [
  {
    number: 1,
    description: "Intersección 1: 2 AFDs (libro de TALF, fig. 2.32)",
    operation: "intersection",
    lhs: {
      isNFA: false,
      states: {
        all: ["q0", "q1"],
        initial: "q0",
        final: ["q0"],
      },
      alphabet: ["a", "b"],
      transitions: new Map([
        [
          "q0",
          new Map([
            ["a", "q1"],
            ["b", "q1"],
          ]),
        ],
        [
          "q1",
          new Map([
            ["a", "q0"],
            ["b", "q0"],
          ]),
        ],
      ]),
    },
    rhs: {
      isNFA: false,
      states: {
        all: ["q2", "q3"],
        initial: "q2",
        final: ["q2"],
      },
      alphabet: ["a", "b"],
      transitions: new Map([
        [
          "q2",
          new Map([
            ["a", "q3"],
            ["b", "q2"],
          ]),
        ],
        [
          "q3",
          new Map([
            ["a", "q2"],
            ["b", "q3"],
          ]),
        ],
      ]),
    },
    result: {
      isNFA: false,
      states: {
        all: ["q1q3", "q1q4", "q2q3", "q2q4"],
        initial: "q1q3",
        final: ["q1q3"],
      },
      alphabet: ["a", "b"],
      transitions: new Map([
        [
          "q1q3",
          new Map([
            ["a", "q2q4"],
            ["b", "q2q3"],
          ]),
        ],
        [
          "q1q4",
          new Map([
            ["a", "q2q3"],
            ["b", "q2q4"],
          ]),
        ],
        [
          "q2q3",
          new Map([
            ["a", "q1q4"],
            ["b", "q1q3"],
          ]),
        ],
        [
          "q2q4",
          new Map([
            ["a", "q1q3"],
            ["b", "q1q4"],
          ]),
        ],
      ]),
    },
  },
];

export const normalizations = [
  {
    number: 1,
    description: "Normalización 1 (TALF, fig. 2.30)",
    operand: {
      isNFA: true,
      states: {
        all: ["q0", "q1"],
        initial: "q0",
        final: ["q1"],
      },
      alphabet: ["a", "b"],
      transitions: new Map([
        ["q0", new Map([["aa",  "q0"], ["b", "q0"], ["ε", "q1"]])],
        ["q1", new Map([["aaa", "q1"], ["b", "q1"]])],
      ]),
    },
    normalized: {
      isNFA: true,
      states: {
        all: ["q0", "q1", "t0", "t1", "t2"],
        initial: "q0",
        final: ["q1"],
      },
      alphabet: ["a", "b"],
      transitions: new Map([
        ["q0", new Map([["ε", "q1"], ["a", "t0"], ["b", "q0"]])],
        ["t0", new Map([["a", "q0"]])],
        ["q1", new Map([["a", "t1"], ["b", "q1"]])],
        ["t1", new Map([["a", "t2"]])],
        ["t2", new Map([["a", "q1"]])],
      ]),
    }
  }
];
