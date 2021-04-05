import React from "react";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import MuiTooltip, {
  TooltipProps as MuiTooltipProps
} from "@material-ui/core/Tooltip";
// components
import Typography from "components/elements/Typography/Typography";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tooltip: {
      padding: "6px 13px 6px 11px",
      borderRadius: 8
    },
    lightTooltip: {
      backgroundColor: theme.palette.common.white,
      boxShadow: theme.shadows[1]
    },
    lightTooltipText: {
      color: theme.palette.common.black
    }
  })
);

export default function Tooltip(props: TooltipProps): JSX.Element {
  const classes = useStyles();

  return (
    <MuiTooltip
      {...props}
      className={classNames(props.className)}
      classes={{ tooltip: classes.tooltip }}
      title={
        typeof props.title === "string" ? (
          <Typography>{props.title}</Typography>
        ) : (
          <div>{props.title}</div>
        )
      }
    >
      <span>{props.children}</span>
    </MuiTooltip>
  );
}

export function LightTooltip(props: TooltipProps): JSX.Element {
  const classes = useStyles();

  return (
    <MuiTooltip
      {...props}
      className={classNames(props.className)}
      classes={{
        tooltip: classNames(classes.tooltip, classes.lightTooltip),
        popper: props.classes?.popper
      }}
      title={
        typeof props.title === "string" ? (
          <Typography className={classes.lightTooltipText}>
            {props.title}
          </Typography>
        ) : (
          <div>{props.title}</div>
        )
      }
    >
      <span>{props.children}</span>
    </MuiTooltip>
  );
}

export interface TooltipProps extends MuiTooltipProps {
  title: NonNullable<React.ReactNode>;
}
