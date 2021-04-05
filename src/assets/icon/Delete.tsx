import React from "react";
// @material-ui/core components
import { SvgIconProps } from "@material-ui/core/SvgIcon";
import SvgIcon from "components/elements/SvgIcon";

export default function Delete(props: SvgIconProps): JSX.Element {
  return (
    <SvgIcon {...props} viewBox="0 0 16 16">
      <g>
        <path d="M13,2h-2V0H5v2H3H0v1h3v13h3h1h2h1h3V3h3V2H13z M6,4v11H4V3h1h1V4z M9,15H7V3h2V15z M6,2V1h4v1H6z M12,15h-2V3h1h1V15z" />
      </g>
    </SvgIcon>
  );
}
