import React from "react";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";

export default function RadioButtonsGroup({ options, value, onChange, children }) {
  return (
    <>
      <div className="MuiFormHelperText-root">{children}</div>
      <ButtonGroup color="primary" style={{ margin: "10px 0px" }}>
        {options.map((option) => (
          <Button
            onClick={() => onChange(option.value)}
            variant={value === option.value ? "contained" : "outlined"}
          >
            {option.label}
          </Button>
        ))}
      </ButtonGroup>
    </>
  );
}
