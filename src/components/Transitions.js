import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import SimpleSelect from "./SimpleSelect.js";
import MultiSelect from "./MultiSelect.js";
import { useStyles } from "../utils/makeStyle.js";
import { Type } from "../lib/automata/automata.js";
import { flatten } from "lodash-es";

export default function Transitions({
  type,
  transitions,
  alphabet,
  states,
  onChange,
}) {
  const classes = useStyles();
  return (
    <TableContainer className={classes.container_transitions} component={Paper}>
      <Table
        className={classes.table_transitions}
        aria-label="customized table"
      >
        <TableHead>
          <TableRow>
            <TableCell>Estados</TableCell>
            {alphabet.map((char) => (
              <TableCell align="center">{char}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {states.map((state) => (
            <TableRow key={state}>
              <TableCell>{state}</TableCell>
              {alphabet.map((symbol) => (
                <TableCell align="center">
                  {type === Type.DFA ? (
                    <SimpleSelect
                      options={states}
                      value={transitions?.get(state)?.get(symbol)}
                      onChange={(event) => onChange(state, symbol, event)}
                    />
                  ): (
                    <MultiSelect
                      options={states}
                      value={[...flatten([transitions?.get(state)?.get(symbol)])]}
                      onChange={(event) => onChange(state, symbol, event)}
                    />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
