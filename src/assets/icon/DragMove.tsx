import React from "react";
// @material-ui/core components
import { SvgIconProps } from "@material-ui/core/SvgIcon";
import SvgIcon from "components/elements/SvgIcon";

export default function DragMove(props: SvgIconProps): JSX.Element {
  return (
    <SvgIcon {...props} viewBox="0 0 15 15">
      <g>
        <rect x="1.5" y="3" width="12" height="1" />
        <rect x="1.5" y="7" width="12" height="1" />
        <rect x="1.5" y="11" width="12" height="1" />
      </g>
    </SvgIcon>
  );
}
