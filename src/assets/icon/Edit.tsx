import React from "react";
// @material-ui/core components
import { SvgIconProps } from "@material-ui/core/SvgIcon";
import SvgIcon from "components/elements/SvgIcon";

export default function Edit(props: SvgIconProps): JSX.Element {
  return (
    <SvgIcon {...props} viewBox="0 0 16 16">
      <g>
        <path
          d="M16,5.3L10.7,0L0,10.7V15v0.5V16h5.3H16v-1H6.3L16,5.3z M10.7,1.3l4.1,4.1L13,7.1L8.9,3L10.7,1.3z M1,10.9l7.4-7.4l4.1,4.1
		L5.1,15H1V10.9z"
        />
      </g>
    </SvgIcon>
  );
}
