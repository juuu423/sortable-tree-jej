import React from "react";
// @material-ui/core components
import { SvgIconProps } from "@material-ui/core/SvgIcon";
import SvgIcon from "components/elements/SvgIcon";

export default function InputRemove(props: SvgIconProps): JSX.Element {
  return (
    <SvgIcon {...props} viewBox="0 0 15 15">
      <g>
        <path
          d="M13.1,0H1.9C0.8,0,0,0.8,0,1.9v11.2c0,1,0.8,1.9,1.9,1.9h11.2c1,0,1.9-0.8,1.9-1.9V1.9C15,0.8,14.2,0,13.1,0z M14,13.1
		c0,0.5-0.4,0.9-0.9,0.9H1.9C1.4,14,1,13.6,1,13.1V1.9C1,1.4,1.4,1,1.9,1h11.2C13.6,1,14,1.4,14,1.9V13.1z"
        />
        <polyline points="12,7 3,7 3,8 12,8 	" />
      </g>
    </SvgIcon>
  );
}
