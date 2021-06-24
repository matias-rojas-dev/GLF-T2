import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { useStyles } from "../utils/makeStyle";

export default function MultiSelect({
  options,
  value,
  onChange,
  helperText,
  minWidth = 100,
  children,
}) {
  const classes = useStyles();

  return (
    <FormControl
      variant="outlined"
      className={classes.formControl_multiSelect}
      style={{ minWidth }}
    >
      <InputLabel id="multiselect-input">{children}</InputLabel>
      <Select
        labelId="multiselect-input"
        id="multiselect-input"
        multiple
        value={value}
        onChange={onChange}
        label={children}
        helperText={helperText}
        disabled={options.length === 0}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
