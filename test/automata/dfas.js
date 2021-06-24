/**
 * @typedef {Object} TestAutomata
 *   @property {number} number - Número de la prueba.
 *   @property {string} description - Descripción del grafo de prueba.
 *   @property {string} link - Link del grafo de prueba en la página
 *   graphonline.ru.
 *   @property {States} states - Estados totales, finales y estado inicial.
 *   @property {string} alphabet - Alfabeto reconocido por el autómata.
 *   @property {Map<string, any>} transitions - Tabla de transiciones del
 *   autómata.
 *   @property {Object} minimal - Autómata equivalente simplificado.
 */

/* @type {TestAutomata} */
export const dfas = [
  {
    number: 1,
    description: "AFD 1, cantidad impar de 'a'",
    link: "",
    states: {
      all: ["P", "I"],
      initial: "P",
      final: ["I"],
    },
    alphabet: ["a", "b"],
    transitions: new Map([
      [
        "P",
        new Map([
          ["a", "I"],
          ["b", "P"],
        ]),
      ],
      [
        "I",
        new Map([
          ["a", "P"],
          ["b", "I"],
        ]),
      ],
    ]),
    complement: {
      states: {
        final: ["P"],
      },
    },
  },
  {
    number: 2,
    description: "AFD 2, palabras que no comiencen con 00",
    states: {
      all: ["q0", "q1", "q2", "qS"],
      initial: "q0",
      final: ["q0", "qS"],
    },
    alphabet: ["0", "1"],
    transitions: new Map([
      [
        "q0",
        new Map([
          ["0", "q1"],
          ["1", "qS"],
        ]),
      ],
      [
        "q1",
        new Map([
          ["0", "q2"],
          ["1", "qS"],
        ]),
      ],
      [
        "q2",
        new Map([
          ["0", "q2"],
          ["1", "q2"],
        ]),
      ],
      [
        "qS",
        new Map([
          ["0", "qS"],
          ["1", "qS"],
        ]),
      ],
    ]),
    complement: {
      states: {
        final: ["q1", "q2"],
      },
    },
  },
  {
    number: 3,
    description: "AFD 3, no simplificado",
    states: {
      all: ["q0", "q1", "q2"],
      initial: "q0",
      final: ["q0", "q2"],
    },
    alphabet: ["a", "b"],
    transitions: new Map([
      [
        "q0",
        new Map([
          ["a", "q2"],
          ["b", "q1"],
        ]),
      ],
      [
        "q1",
        new Map([
          ["a", "q1"],
          ["b", "q1"],
        ]),
      ],
      [
        "q2",
        new Map([
          ["a", "q0"],
          ["b", "q1"],
        ]),
      ],
    ]),
    minimal: {
      states: {
        all: ["q1", "q2"],
        initial: "q2",
        final: ["q2"],
      },
      alphabet: ["a", "b"],
      transitions: new Map([
        [
          "q1",
          new Map([
            ["a", "q1"],
            ["b", "q1"],
          ]),
        ],
        [
          "q2",
          new Map([
            ["a", "q2"],
            ["b", "q1"],
          ]),
        ],
      ]),
    },
  },
  {
    number: 4,
    description: "AFD 4, no simplificado",
    states: {
      all: ["1", "2", "3", "4", "5"],
      initial: "5",
      final: ["2", "3", "4", "5"],
    },
    alphabet: ["a", "b"],
    transitions: new Map([
      [
        "5",
        new Map([
          ["a", "4"],
          ["b", "3"],
        ]),
      ],
      [
        "4",
        new Map([
          ["a", "4"],
          ["b", "2"],
        ]),
      ],
      [
        "3",
        new Map([
          ["a", "4"],
          ["b", "1"],
        ]),
      ],
      [
        "2",
        new Map([
          ["a", "4"],
          ["b", "1"],
        ]),
      ],
      [
        "1",
        new Map([
          ["a", "1"],
          ["b", "1"],
        ]),
      ],
    ]),
    minimal: {
      states: {
        all: ["1", "3", "5"],
        initial: "5",
        final: ["3", "5"],
      },
      alphabet: ["a", "b"],
      transitions: new Map([
        [
          "5",
          new Map([
            ["a", "5"],
            ["b", "3"],
          ]),
        ],
        [
          "3",
          new Map([
            ["a", "5"],
            ["b", "1"],
          ]),
        ],
        [
          "1",
          new Map([
            ["a", "1"],
            ["b", "1"],
          ]),
        ],
      ]),
    },
  },
  {
    number: 5,
    description: "AFD 5, no simplificado (por clases)",
    states: {
      all: ["q0", "q1", "q2", "q3", "q4"],
      initial: "q0",
      final: ["q1", "q3"],
    },
    alphabet: ["a", "b"],
    transitions: new Map([
      [
        "q0",
        new Map([
          ["a", "q1"],
          ["b", "q3"],
        ]),
      ],
      [
        "q1",
        new Map([
          ["a", "q2"],
          ["b", "q1"],
        ]),
      ],
      [
        "q2",
        new Map([
          ["a", "q1"],
          ["b", "q2"],
        ]),
      ],
      [
        "q3",
        new Map([
          ["a", "q4"],
          ["b", "q3"],
        ]),
      ],
      [
        "q4",
        new Map([
          ["a", "q3"],
          ["b", "q4"],
        ]),
      ],
    ]),
    minimal: {
      states: { all: ["q0", "q3", "q4"], initial: "q0", final: ["q3"] },
      alphabet: ["a", "b"],
      transitions: new Map([
        [
          "q0",
          new Map([
            ["a", "q3"],
            ["b", "q3"],
          ]),
        ],
        [
          "q3",
          new Map([
            ["a", "q4"],
            ["b", "q3"],
          ]),
        ],
        [
          "q4",
          new Map([
            ["a", "q3"],
            ["b", "q4"],
          ]),
        ],
      ]),
    },
  },
];
