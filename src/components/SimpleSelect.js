import React from "react";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { useStyles } from "../utils/makeStyle";

export default function SimpleSelect({
  options,
  value,
  onChange,
  helperText,
  nullable = true,
  minWidth = 100,
  children,
}) {
  const classes = useStyles();
  return (
    <FormControl
      variant="outlined"
      className={classes.formControl_simpleSelect}
      style={{ minWidth }}
    >
      <InputLabel id="simple-select-input">{children}</InputLabel>
      <Select
        labelId="simple-select-input"
        id="simple-select-input"
        value={value}
        onChange={onChange}
        label={children}
        helperText={helperText}
        disabled={options.length === 0}
      >
        {nullable && (
          <MenuItem>
            <em>Ninguno</em>
          </MenuItem>
        )}
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
