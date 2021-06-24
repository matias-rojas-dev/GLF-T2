import { NFA, Epsilon } from "./nfa.js";
import { Error } from "../error.js";
import {
  cloneDeep,
  compact,
  difference,
  flatten,
  intersection,
  isEqual,
  minBy,
  union,
  uniq,
} from "lodash-es";

/**
 * Representación de un autómata finito determinístico.
 * @class
 */
export class DFA extends NFA {
  /**
   * @constructor
   * @param {States} states - Estados totales, finales e inicial del autómata.
   * @param {string[]} alphabet - Alfabeto reconocido por el autómata.
   * @param {Map<string, Map<string, string>>} transitions - Tabla de
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
   * // Estando en "P": leyendo una "a", pasar a "I", o
   * //                 leyendo una "b", pasar a "P".
   * // Estando en "I": leyendo una "a", pasar a "P", o
   * //                 leyendo una "b", pasar a "I".
   * const transitions = new Map([
   *   [ "P", new Map([["a", "I"], ["b", "P"]]) ],
   *   [ "I", new Map([["a", "P"], ["b", "I"]]) ],
   * ]);
   *
   * const dfa = new DFA({ states, alphabet, transitions });
   */
  constructor({ states, alphabet, transitions }) {
    // Determina la cantidad de transiciones del autómata.
    function size({ transitions }) {
      return [...transitions.values()].reduce(
        (accumulator, outputs) => accumulator + outputs.size,
        0
      );
    }

    // Determina si las lecturas de las transiciones tienen exactamente 1
    // carácter.
    function validReadings({ transitions }) {
      return [...transitions.values()].every(
        ([reading]) => reading.length === 1
      );
    }

    if (validReadings({ transitions })) {
      throw new Error({
        msg:
          "Las lecturas en la tabla de transiciones deben tener exactamente 1 " +
          "cáracter.",
        context: { transitions },
      });
    }

    if (states.all.length * alphabet.length !== size({ transitions })) {
      throw new Error({
        msg:
          "La cantidad de transiciones no coincide con la cantidad " +
          "de estados y el número de carácteres del alfabeto del autómata.",
        context: { states, alphabet, transitions },
      });
    }

    super({ states, alphabet, transitions });
  }

  /**
   * Construye un AFD a partir de un AFND.
   *
   * @param {NFA} nfa - AFND.
   * @returns {DFA} AFD equivalente al AFND.
   */
  static from({ nfa }) {
    const reading = {
      // Obtiene el conjunto de estados a los que se puede llegar partiendo
      // desde `state` pasando sólo leyendo epsilon.
      epsilon: ({ state }) => {
        let output = [];

        // Recorre la tabla de transiciones, desde el `state` hasta el último
        // estado accesible solo leyendo epsilon.
        for (
          let next = state;
          next != null;
          next = nfa.transitions.get(next)?.get(Epsilon.symbol)
        ) {
          output.push(...flatten([next]));
        }

        return uniq(output).sort();
      },

      // Obtiene los estados de salida de `state`, leyendo `symbol` o epsilon.
      includingEpsilon: ({ state, symbol }) => {
        // Para cada estado de `reduced`, obtener estado de salida leyendo
        // `symbol`.
        const states = reduceUnion({
          reduced: reading.epsilon({ state }),
          add: (state) => {
            const output = nfa.transitions.get(state)?.get(symbol);
            return [...flatten(compact([output]))];
          },
        });

        // Por cada estado del conjunto anterior, obtener `reading.epsilon`.
        return reduceUnion({
          reduced: states,
          add: (state) => reading.epsilon({ state }),
        });
      },
    };

    const reduceUnion = ({ reduced, add }) => {
      return reduced
        .reduce((accumulator, e) => union(accumulator, add(e)), [])
        .sort();
    };

    // Agrega el sumidero, si ya no ha sido agregado.
    const addSink = ({ transitions, states }) => {
      if (transitions.has(sink)) {
        return;
      }

      // El sumidero consume todos los símbolos del alfabeto hacia él mismo.
      transitions.set(
        sink,
        new Map(nfa.alphabet.map((symbol) => [symbol, sink]))
      );

      states.all.push(sink);
    };

    // Establece la transición entre la entrada, salida y símbolo.
    const setTransition = ({ input, symbol, output, transitions, states }) => {
      if (transitions.has(input.state)) {
        transitions.get(input.state).set(symbol, output);
        return;
      }

      transitions.set(input.state, new Map([[symbol, output]]));
      states.all.push(input.state);

      // Si uno de los estados dentro del conjunto de estados es final, el
      // nuevo estado es final.
      if (input.isFinal) {
        states.final.push(input.state);
      }
    };

    const normalized = nfa.normalized();
    const initial = reading.epsilon({ state: normalized.states.initial });
    const sink = "qS";

    let transitions = new Map([]);
    let set = [initial];
    let states = { all: [], final: [] };

    for (const current of set) {
      for (const symbol of normalized.alphabet) {
        // Por cada estado del conjunto `current`, obtener
        // `reading.includingEpsilon`.
        let next = reduceUnion({
          reduced: current,
          add: (state) => reading.includingEpsilon({ state, symbol }),
        });

        // El conjunto de estados `current` no tiene transiciones para `symbol`.
        // Agregarlas a un sumidero.
        if (next.length === 0) {
          next = [sink];
          addSink({ transitions, states });
        }

        // Agregar el nuevo conjunto de estados, si no ha sido agregado antes.
        else if (set.every((current) => !isEqual(current, next))) {
          set.push(next);
        }

        setTransition({
          input: {
            state: current.join(""),
            isFinal: current.some((state) =>
              normalized.states.isFinal({ state })
            ),
          },
          output: next.join(""),
          symbol,
          transitions,
          states,
        });
      }
    }

    return new DFA({
      states: { ...states, initial: initial.join("") },
      alphabet: [...normalized.alphabet],
      transitions,
    });
  }

  /**
   * Crea una copia recursiva del autómata.
   *
   * @returns {DFA} Autómata.
   *
   * Se debe usar esta función en lugar de `cloneDeep` de `lodash`, ya que ésta
   * última clona el autómata sin rebindear `this` a los callbacks del objeto
   * `this.states`.
   */
  clone() {
    return new DFA({
      states: cloneDeep(this.states),
      alphabet: [...this.alphabet],
      transitions: cloneDeep(this.transitions),
    });
  }

  /**
   * Retorna la minimización del autómata.
   *
   * @returns {DFA} Autómata simplificado.
   *
   * Implementación del algoritmo de Hopcroft de minimizacíon de autómatas por
   * clases de equivalencia.
   */
  minimal() {
    // Reemplaza el elemento i-ésimo de `equivalences` en éste y en `stack`, por
    // los elementos de `replacement`.
    const replace = ({ equivalences, stack, at, replacement }) => {
      if (replacement.some((value) => value.length === 0)) {
        return;
      }

      // Busca la clase de equivalencia en el stack.
      const index = stack.findIndex((equivalence) =>
        isEqual(equivalence, equivalences[at])
      );

      // Reemplaza la clase de equivalencia por la intersección y diferencia.
      equivalences.splice(at, 1, ...replacement);

      if (index !== -1) {
        // Si se encontró dicha clase, reemplazarla por la intersección y
        // diferencia.
        stack.splice(index, 1, ...replacement);
      } else {
        // Si no se encontró, insertar la intersección o la diferencia,
        // dependiendo cuál tenga la menor cantidad de elemntos.
        stack.push(minBy(replacement, "length"));
      }
    };

    // Retorna la lista de clases de equivalencia del autómata.
    const equivalences = () => {
      // Lista de clases de equivalencia. Inicialmente contiene los estados
      // finales y no finales.
      let equivalences = [
        this.states.final,
        difference(this.states.all, this.states.final),
      ];

      let stack = [...equivalences];

      while (stack.length > 0) {
        const current = stack.pop();
        for (const symbol of this.alphabet) {
          // Encuentra los estados del autómata que al leer el `symbol` llegan a
          // un estado contenido en `current`.
          let equivalence = this.states.all.filter((state) =>
            current.includes(this.transitions.get(state).get(symbol))
          );

          // Por cada clase de equivalencia, calcular la intersección y
          // diferencia entre la i-ésima clase y la clase encontrada en el paso
          // anterior.
          for (const i of equivalences.keys()) {
            replace({
              equivalences,
              stack,
              at: i,
              replacement: [
                intersection(equivalence, equivalences[i]),
                difference(equivalences[i], equivalence),
              ],
            });
          }
        }
      }

      return equivalences;
    };

    let minimal = this.clone();

    // En la lista de clases de equivalencia, las clases que tengan 2 estados
    // son fusionables.
    const mergeable = equivalences().filter(
      (equivalence) => equivalence.length === 2
    );

    for (const [replaced, replacement] of mergeable) {
      minimal.states.replace({ replaced, replacement, merge: true });
    }

    return minimal;
  }

  /**
   * Retorna el complemento del autómata.
   *
   * @returns {DFA} Complemento del autómata.
   */
  complement() {
    return new DFA({
      ...this,
      states: {
        ...this.states,
        final: difference(this.states.all, this.states.final),
      },
    });
  }

  /**
   * Retorna la intersección entre el autómata `this` y el autómata `other`.
   *
   * @param {DFA} other - Autómata a intersectar.
   * @returns {?DFA} Intersección de los autómatas, o `null` si `other` es `null`.
   */
  intersection(other) {
    if (other == null) {
      return null;
    }

    const lhs = this.complement();
    const rhs = other.complement();
    const union = DFA.from({ nfa: lhs.union(rhs) });
    return union.minimal().complement();
  }
}
