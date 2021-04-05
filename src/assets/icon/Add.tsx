import React from "react";
// @material-ui/core components
import { SvgIconProps } from "@material-ui/core/SvgIcon";
import SvgIcon from "components/elements/SvgIcon";

export default function Add(props: SvgIconProps): JSX.Element {
  return (
    <SvgIcon {...props} viewBox="0 0 16 16">
      <g>
        <polygon points="1,1 14,1 14,4 15,4 15,0 0,0 0,16 4,16 4,15 1,15 	" />
        <rect x="2" y="3" width="8" height="1" />
        <rect x="2" y="6" width="6" height="1" />
        <rect x="2" y="9" width="4" height="1" />
        <path
          d="M12.7,5L5,12.7V16h3.3L16,8.3L12.7,5z M7.9,15H6v-1.9l4.7-4.7l1.9,1.9L7.9,15z M11.4,7.7l1.3-1.3l1.9,1.9l-1.3,1.3
		L11.4,7.7z"
        />
      </g>
    </SvgIcon>
  );
}
