import React from "react";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles, createStyles } from "@material-ui/core/styles";
import MuiTypography from "@material-ui/core/Typography";
import { PropTypes } from "@material-ui/core/";

const useStyles = makeStyles(
  createStyles({
    text: (props: TypographyProps) => {
      const color = props.color || "inherit";

      return {
        color: color,
        fontWeight: 400,
        fontSize: 14,
        lineHeight: 1.4,
        letterSpacing: -0.5
      };
    },
    ellipsis: {
      textOverflow: "ellipsis",
      overflow: "hidden",
      whiteSpace: "nowrap"
    }
  })
);

function Typography(props: TypographyProps): JSX.Element {
  const classes = useStyles(props);
  const { gutterBottom, onClick } = props;

  const component = props.component ? { component: props.component } : "";

  return (
    <MuiTypography
      className={classNames(props.className, classes.text, {
        [classes.ellipsis]: props.ellipsis
      })}
      variant="body1"
      gutterBottom={gutterBottom || false}
      align={props.align}
      onClick={onClick}
      {...component}
    >
      {props.children}
    </MuiTypography>
  );
}

export interface TypographyProps {
  children?: React.ReactNode | string;
  className?: string;
  color?: "primary" | "secondary" | "label" | "disabled" | "error" | "inherit";
  gutterBottom?: boolean;
  align?: PropTypes.Alignment;
  ellipsis?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component?: React.ElementType<any>;
  onClick?(): void;
}

export default Typography;
