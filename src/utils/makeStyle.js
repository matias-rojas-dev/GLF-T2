import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
        display: 'flex',
        justifyContent: 'center'
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
    },
    root: {

        "& .MuiTextField-root": {
            margin: theme.spacing(1),
            width: "25ch",
        },
    },
    root_tabs: {
        backgroundColor: theme.palette.background.paper,
        width: '100%',
    },
    container_transitions: {
        margin: theme.spacing(1),
        maxHeight: 440,
        maxWidth: 1000,
    },
    table_transitions: {
        minWidth: 700,
    },
    root_cajaTexto: {
        '& .MuiTextField-root': {
          margin: theme.spacing(1),
          width: '25ch',
        },
      },
      formControl_multiSelect: {
        margin: theme.spacing(1),
        minWidth: 200,
      },
      formControl_simpleSelect: {
        margin: theme.spacing(1),
        minWidth: 200,
      },
}));

export const today = new Date();