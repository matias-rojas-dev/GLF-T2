import React, { useState } from "react";
import {
  TextField,
  IconButton,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

export default function InputDialog({
  values,
  label,
  join = ", ",
  onChange,
  isError,
  helpers,
  children,
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleValueChange(event) {
    setValue(event.target.value);
  }

  function handleAccept() {
    onChange(value);
    handleClose();
  }

  function handleEdit() {
    handleOpen();
    setValue(values.join(join));
  }

  return (
    <div>
      <TextField
        id="input-dialog"
        label={label}
        value={values.join(join)}
        InputProps={{ readOnly: true }}
        variant="outlined"
        style={{ pointerEvents: "none" }}
      />
      <IconButton
        color="primary"
        onClick={handleEdit}
        style={{ marginTop: 10 }}
      >
        <EditIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        styles={{ width: 10 }}
        aria-labelledby="input-dialog-dialog"
      >
        <DialogTitle id="input-dialog-title">{label}</DialogTitle>
        <DialogContent>
          <DialogContentText>{children}</DialogContentText>
          <TextField
            id="input-dialog-input"
            label={label}
            fullWidth
            autoFocus
            value={value}
            variant="outlined"
            error={isError?.(value)}
            onChange={handleValueChange}
            helperText={isError?.(value) ? helpers?.error : helpers?.noError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleAccept}
            color="primary"
            disabled={isError?.(value)}
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
