/**
 * Determina si la salida es de tipo AFND.
 *
 * @param {string|string[]} output - Salida (estado o conjunto de estados).
 * @returns {boolean} `true` si la salida es de tipo AFND, `false` en caso
 * contrario.
 */
export function isNFA({ output }) {
  return output instanceof Array;
}

function joinCommonEnds(links) {
  let common = new Map();

  for (const { from, to, text } of links) {
    const key = `${from}, ${to}`;

    if (common.has(key)) {
      common.get(key).push(text);
    } else {
      common.set(key, [text]);
    }
  }

  return [...common].map(([key, joined]) => {
    const [from, to] = key.split(", ");
    return { from, to, text: joined.sort().join(", ") };
  })
}

/**
 * Obtenemos los links para crear la visualización del autómata
 *
 * @param {Map} transitions - Transiciones obtenidas a partir de la clase o creadas
 * de la forma : ["X", new Map([["a", "X"], ["b", "Y"]])],
 * @returns {[{}]} - Retorna un array
 */
export function getLinks(transitions) {
  if (transitions == null) {
    return [];
  }

  let links = [];

  for (const [input, outputs] of transitions) {
    for (const [reading, output] of outputs) {
      if (output instanceof Array) {
        for (const state of output) {
          links.push({ from: input, to: state, text: reading });
        }
      } else {
        links.push({ from: input, to: output, text: reading });
      }
    }
  }

  return joinCommonEnds(links);
}

/**
 * Obtenemos los nodos (estados) del autómata
 *
 * @param {string[]} allStates - Todos los estados del autómata
 * @param {string[]} finalStates - El estado o todos los estados final/finales del
 * autómata
 * @param {string} initialState - Estado inicial del autómata.
 * @returns {[{}]} - Retorna un array
 */
export function getNodesData(allStates, finalStates, initialState) {
  if (allStates == null || finalStates == null) {
    return [];
  }

  return allStates.map((state) => ({
    key: state,
    text: state === initialState ? `{${state}}` : state,
    color: finalStates.includes(state) ? "orange" : "white",
  }));
}
