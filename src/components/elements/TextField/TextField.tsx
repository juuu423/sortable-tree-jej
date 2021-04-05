import React from "react";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import MuiTextField, {
  TextFieldProps as MuiTextFieldProps
} from "@material-ui/core/TextField";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textField: {
      "& > .MuiInput-underline.Mui-disabled:before": {
        borderBottomStyle: "solid"
      },
      '& input[type="text"]::-ms-clear': { display: "none" },
      "& > .MuiInputBase-root": {
        fontSize: 14,
        fontWeight: theme.typography.fontWeightRegular,
        "& > .MuiInputBase-input": {
          padding: "6px 0 10px",
          letterSpacing: "-0.4px",
          lineHeight: 1.4,
          paddingLeft: (props: MuiTextFieldProps): number =>
            (props.inputProps && props.inputProps.paddingLeft) || 5,
          textAlign: (props: MuiTextFieldProps): string =>
            (props.inputProps && props.inputProps.textAlign) || ""
        },
        "& > .MuiInputAdornment-positionStart": {
          marginTop: -4,
          marginRight: 2,
          "& > .MuiSvgIcon-root": { width: 15, height: 15, marginLeft: 4 }
        }
      },
      "& > .MuiFormHelperText-root": {
        fontSize: 14,
        fontWeight: theme.typography.fontWeightRegular,
        lletterSpacing: "-0.4px"
      },
      "& > .MuiInputBase-inputMarginDense": {
        paddingTop: 0
      }
    }
  })
);

function TextField(props: MuiTextFieldProps): JSX.Element {
  const classes = useStyles(props);

  return (
    <MuiTextField
      {...props}
      color={props.color || "primary"}
      autoComplete="off"
      className={classNames(classes.textField, props.className)}
    />
  );
}

export default TextField;
