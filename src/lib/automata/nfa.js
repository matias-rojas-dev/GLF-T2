import { Error } from "../error.js";
import { isNFA } from "./utils.js";
import * as stateCallbacks from "./state.js";
import { bind, cloneDeep, flatten, range, uniq } from "lodash-es";


export const Epsilon = Object.freeze({
  symbol: "ε",
  value: "",
})

/**
 * @typedef {Object} States
 *   @property {string[]|number[]} all - Todos los estados.
 *   @property {string|number} initial - Estado inicial.
 *   @property {string[]|number[]} final - Estados finales.
 */

// TODO: resolver estados de salida simples (String en vez de Array).
/**
 * Representación de un autómata finito no determinístico.
 * @class
 */
export class NFA {
  /**
   * @constructor
   * @param {States} states - Estados totales, finales e inicial del autómata.
   * @param {string[]} alphabet - Alfabeto reconocido por el autómata.
   * @param {Map<string, Map<string, string[]>>} transitions - Tabla de
   * transiciones del autómata.
   *
   * @example
   * const states = {
   *   all: ["P", "I"],
   *   initial: "P",
   *   final: ["I"],
   * };
   *
   * const alphabet = ["a", "b"];
   *
   * // NOTE: a diferencia de los DFA, la salida de una transición es una lista.
   * // Estando en "P": leyendo una "a", pasar a cualquiera entre {"I", "P"}, o
   * //                 leyendo una "b", pasar a cualquiera entre {"P"}.
   * // Estando en "I": leyendo una "a", pasar a cualquiera entre {"P"}, o
   * //                 leyendo una "b", pasar a cualquiera entre {"I", "P"}.
   * const transitions = new Map([
   *   [ "P", new Map([["a", ["I", "P"]], ["b", ["P"]]]) ],
   *   [ "I", new Map([["a", ["P"]], ["b", ["I", "P"]]]) ],
   * ]);
   *
   * const nfa = new NFA({ states, alphabet, transitions });
   */
  constructor({ states, alphabet, transitions }) {
    // Determina si un arreglo es subconjunto de otro arreglo.
    function isSubset({ subset, set }) {
      return subset.every((e) => set.includes(e));
    }

    // Determina si las transiciones son válidas.
    function validTransitions({ states, alphabet, transitions }) {
      const validOutputs = ({ states, alphabet, outputs }) => {
        return [...outputs].every(([reading, output]) => {
          // Determina si el estado de salida es válido, independiente si es de
          // tipo AFD o AFND.
          const isValidOutput =
            (isNFA({ output }) && isSubset({ subset: output, set: states })) ||
            states.includes(output);

          // Determina si la lectura es vacía (epsilon) o si cada símbolo de
          // ella está incluido en el alfabeto del autómata.
          const isValidReading =
            reading === Epsilon.symbol ||
            isSubset({ subset: reading.split(""), set: alphabet });

          return isValidOutput && isValidReading;
        });
      };

      return [...transitions].every(
        ([input, outputs]) =>
          states.includes(input) && validOutputs({ states, alphabet, outputs })
      );
    }

    if ([states.all, states.initial, states.final].includes(undefined)) {
      throw new Error({
        msg:
          "El autómata debe ser construido con los estados totales, " +
          "finales y el estado inicial.",
        context: { states },
      });
    } else if (alphabet.length === 0) {
      throw new Error({
        msg: "El alfabeto de entrada del autómata no puede ser vacío.",
        context: { alphabet },
      });
    } else if (!isSubset({ subset: states.final, set: states.all })) {
      throw new Error({
        msg:
          "El conjunto de estados finales debe ser un subconjunto del " +
          "conjunto total de estados.",
        context: { states },
      });
    } else if (!states.all.includes(states.initial)) {
      throw new Error({
        msg:
          "El estado inicial debe estar contenido en el conjunto total de " +
          "estados.",
        context: { states },
      });
    } else if (
      !validTransitions({ states: states.all, alphabet, transitions })
    ) {
      throw new Error({
        msg:
          "Al menos una de las transiciones no es válida, debido a que el " +
          "estado de entrada o salida de la transición no pertenece al " +
          "conjunto total de estados, o, la lectura de la transición no " +
          "pertenece al alfabeto de entrada del autómata.",
        context: { states, alphabet, transitions },
      });
    }

    // Ignora los duplicados del conjunto de total de estados y del conjunto de
    // estados finales.
    this.states = {
      all: uniq(states.all).sort(),
      initial: states.initial,
      final: uniq(states.final).sort(),
    };

    // Asigna funciones de utilidad al objeto `this.states`, con el `this` de un
    // objeto de la clase `NFA` bindeado a dichas funciones. Además, las
    // establece como no enumerables (no aparecen al inspeccionar un objeto
    // `this.states`, o un objeto de la clase `NFA`, por extensión).
    // NOTE: esto implica que un objeto de la clase `NFA` o cualquiera que la
    // extienda, no puede ser clonado con `cloneDeep` de lodash.
    // Ver `NFA.clone` o `DFA.clone`.
    Object.defineProperties(this.states, {
      isInitial: { value: bind(stateCallbacks.isInitial, this) },
      isFinal: { value: bind(stateCallbacks.isFinal, this) },
      replace: { value: bind(stateCallbacks.replace, this) },
      normalize: { value: bind(stateCallbacks.normalize, this) },
      common: { value: bind(stateCallbacks.common, this) },
    });

    this.alphabet = alphabet;
    this.transitions = new Map([...transitions].sort());
  }

  /**
   * Asigna una transición en la tabla.
   *
   * @param {string} from - Estado de entrada.
   * @param {string} to - Estado de salida.
   * @param {string} reading - Lectura de la transición.
   */
  setTransition({ from, to, reading }) {
    if (!this.states.all.includes(from)) {
      this.states.all.push(from);
    }

    if (!this.states.all.includes(to)) {
      this.states.all.push(to);
    }

    if (this.transitions.has(from)) {
      const output = this.transitions.get(from).get(reading);
      this.transitions
        .get(from)
        .set(reading, isNFA({ output }) ? flatten([...output, to]) : to);
    } else {
      this.transitions.set(from, new Map([[reading, to]]));
    }
  }

  /**
   * Normaliza las transiciones cuya lectura es de más de un carácter.
   *
   * @returns {NFA} AFND normalizado.
   */
  normalized() {
    let normalized = this.clone();
    normalized.states.normalize({ suffix: 0 });

    const prefix = "t";
    let count = 0;

    for (const [input, outputs] of this.transitions) {
      for (const [reading, output] of outputs) {
        const size = reading?.length ?? 0;

        if (size < 1) {
          continue;
        }

        normalized.transitions.get(input)?.delete(reading);

        // Determina la lista de estados transitorios.
        const intermediaries = range(count, (count += size - 1)).map(
          (n) => prefix + n
        );

        const chain = [input, ...intermediaries, output];

        for (let i = 0; i < chain.length - 1; i++) {
          normalized.setTransition({
            from: chain[i],
            to: chain[i + 1],
            reading: reading[i],
          });
        }
      }
    }

    return normalized;
  }

  /**
   * Crea una copia recursiva del autómata.
   *
   * @returns {NFA} Autómata.
   *
   * Se debe usar esta función en lugar de `cloneDeep` de `lodash`, ya que ésta
   * última clona el autómata sin rebindear `this` a los callbacks del objeto
   * `this.states`.
   */
  clone() {
    return new NFA({
      states: cloneDeep(this.states),
      alphabet: [...this.alphabet],
      transitions: cloneDeep(this.transitions),
    });
  }

  /**
   * Retorna la unión entre el autómata `this` y el autómata `other`.
   *
   * @param {NFA} other - Autómata a unir.
   * @returns {?NFA} AFND correspondiente de la unión de los autómatas, o `null`
   * si `other` es `null`.
   */
  union(other) {
    if (other == null) {
      return null;
    }

    let lhs = this.clone();
    let rhs = other.clone();

    let initial = {
      // El formato de los nombres de los estados del nuevo autómata es "qx",
      // donde x es es el número del estado en orden de ocurrencia.
      state: "q0",
    };

    // Si entre los dos autómatas existe al menos un nombre de estado en común,
    // o alguno de ellos contiene un estado con el mismo nombre del nuevo estado
    // inicial, normalizar los nombres de sus estados.
    if (
      lhs.states.common(rhs).length > 0 ||
      [...lhs.states.all, ...rhs.states.all].includes(initial.state)
    ) {
      // El sufijo 0 está reservado para el nuevo estado inicial.
      lhs.states.normalize({ suffix: 1 });
      rhs.states.normalize({ suffix: lhs.states.all.length + 1 });
    }

    // Transición inicial.
    initial.output = new Map([
      [Epsilon.symbol, [lhs.states.initial, rhs.states.initial]],
    ]);

    return new NFA({
      states: {
        all: [initial.state, ...lhs.states.all, ...rhs.states.all],
        initial: initial.state,
        final: [...lhs.states.final, ...rhs.states.final],
      },
      alphabet: uniq([...lhs.alphabet, ...rhs.alphabet]),
      transitions: new Map([
        [initial.state, initial.output],
        ...lhs.transitions,
        ...rhs.transitions,
      ]),
    });
  }

  /**
   * Retorna la concatenación entre el autómata `this` y el autómata `other`.
   *
   * @param {NFA} other - Autómata a concatenar.
   * @returns {?NFA} AFND que representa la concatenación de los autómatas, o
   * `null` si `other` es `null`.
   */
  concatenation(other) {
    if (other == null) {
      return null;
    }

    let lhs = this.clone();
    let rhs = other.clone();

    // Si entre los dos autómatas existe al menos un nombre de estado en común,
    // normalizar los nombres de sus estados.
    if (lhs.states.common(rhs).length > 0) {
      lhs.states.normalize({ suffix: 0 });
      rhs.states.normalize({ suffix: lhs.states.all.length });
    }

    // Conectar los estados finales del primer autómata con el estado inicial
    // del segundo, con lectura vacía (epsilon).
    for (const final of lhs.states.final) {
      lhs.transitions.get(final)?.set(Epsilon.symbol, rhs.states.initial);
    }

    return new NFA({
      states: {
        all: [...lhs.states.all, ...rhs.states.all],
        initial: lhs.states.initial,
        final: rhs.states.final,
      },
      alphabet: uniq([...lhs.alphabet, ...rhs.alphabet]),
      transitions: new Map([...lhs.transitions, ...rhs.transitions]),
    });
  }
}
