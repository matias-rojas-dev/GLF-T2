import { intersection, pull } from "lodash-es";
import { isNFA } from "./utils.js";

/**
 * Determina si un estado del autómata es válido.
 *
 * @param {string} state - Estado a evaluar.
 * @returns {boolean} `true` si el estado es válido, `false` en caso
 * contrario.
 */
export function isValid({ state }) {
  return this.states.all.includes(state);
}

/**
 * Determina si un estado del autómata es inicial.
 *
 * @param {string} state - Estado a evaluar.
 * @returns {boolean} `true` si el estado es inicial, `false` en caso
 * contrario.
 */
export function isInitial({ state }) {
  return state === this.states.initial;
}

/**
 * Determina si un estado del autómata es final.
 *
 * @param {string} state - Estado a evaluar.
 * @returns {boolean} `true` si el estado es final, `false` en caso contrario.
 */
export function isFinal({ state }) {
  return this.states.final.includes(state);
}

/**
 * Reemplaza un estado del autómata por uno nuevo.
 *
 * @this {NFA} AFND.
 * @param {{ replaced: string, replacement: string, merge: boolean}}
 * @returns {boolean} `true` si el estado se encontraba en el autómata y fue
 * eliminado, `false` en caso contrario.
 */
export function replace({ replaced, replacement, merge = false }) {
  const replace = ({ array, replaced, replacement }) => {
    array.splice(array.indexOf(replaced), 1, replacement);
  };

  const mergeOrReplace = ({ array }) => {
    merge ? pull(array, replaced) : replace({ array, replaced, replacement });
  };

  if (!this.transitions.has(replaced)) {
    return false;
  }

  if (this.states.isInitial({ state: replaced })) {
    this.states.initial = replacement;
  }

  mergeOrReplace({ array: this.states.all });

  // Reemplaza por el estado de reemplazo o elimina al estado eliminado de los
  // estado totales.
  if (this.states.isFinal({ state: replaced })) {
    mergeOrReplace({ array: this.states.final });
  }

  this.transitions.set(replacement, this.transitions.get(replaced));
  this.transitions.delete(replaced);

  // Recorrer las transiciones restantes para encontrar aquellas que son
  // incidentes al estado reemplazado, y redirigirlas hacia el estado de
  // reemplazo.
  for (const [input, outputs] of this.transitions) {
    for (const [reading, output] of outputs) {
      // Reemplazar el estado de salida de la transición por el de reemplazo.
      if (isNFA({ output }) && output.includes(replaced)) {
        replace({
          array: this.transitions.get(input).get(reading),
          replaced,
          replacement,
        });
      } else if (output === replaced) {
        this.transitions.get(input).set(reading, replacement);
      }
    }
  }

  return true;
}

/**
 * Normaliza los nombres de los estados del autómata, dados un prefijo y un
 * sufijo inicial.
 *
 * @param {string} [prefix="q"] - Prefijo de los nuevos nombres de los
 * estados.
 * @param {number} [suffix=0] - Sufijo inicial de los nuevos nombres de los
 * estados, asignado incrementalmente.
 * @returns {NFA} `this`.
 */
export function normalize({ prefix = "q", suffix = 0 }) {
  // 1era iteración: renombrar los estados a llaves que se tenga la seguridad
  //                 que no existen anteriormente, en este caso números
  //                 consecutivos.
  // 2da iteración:  renombrar los estados según su nombre dado en la
  //                 iteración pasada, con el prefijo incluido.
  for (const iteration of [1, 2]) {
    const states = this.states.all;
    for (const state of states) {
      this.states.replace({
        replaced: state,
        replacement: iteration === 1 ? suffix++ : prefix + state,
        merge: false,
      });
    }
  }

  return this;
}

/**
 * Encuentra los estados en común entre dos autómatas.
 *
 * @param {NFA} other - Autómata a comparar.
 * @returns {string[]} Estados en común entre los dos autómatas.
 */
export function common(other) {
  return intersection(this.states.all, other.states.all);
}
