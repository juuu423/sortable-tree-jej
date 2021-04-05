import React from "react";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles, createStyles } from "@material-ui/core/styles";
import MuiSvgIcon, { SvgIconProps } from "@material-ui/core/SvgIcon";

const useStyles = makeStyles(
  createStyles({
    wrapper: {
      overflow: "hidden"
    }
  })
);

function SvgIcon(props: SvgIconProps): JSX.Element {
  const classes = useStyles();

  return (
    <MuiSvgIcon
      {...props}
      className={classNames(classes.wrapper, props.className)}
      preserveAspectRatio="none slice"
    />
  );
}

export default SvgIcon;
