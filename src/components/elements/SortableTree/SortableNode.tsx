import React from "react";
import { NodeRendererProps, isDescendant } from "react-sortable-tree";
import classnames from "classnames";
// @material-ui/core components
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
// components
import { InputAddIcon, InputRemoveIcon, DragMoveIcon } from "assets/icon";
// styles
import "./sortableStyle.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      "& > .rst__rowLandingPad::before": {
        backgroundColor: "unset"
      },
      "& > .rst__rowCancelPad::before": {
        backgroundColor: "#e6a8ad",
        top: 5,
        height: 45,
        borderRadius: 10
      }
    },
    node: {
      backgroundColor: "none"
    },
    icon: {
      width: 15,
      height: 15,
      backgroundColor: theme.palette.background.paper,
      color: "#ccc",
      transform: "none",
      margin: "-7px 0 0 -7px"
    },
    moveIcon: {
      display: "flex",
      alignItems: "center",
      height: "100%",
      marginLeft: "10px",
      width: "auto"
    },
    dragIcon: {
      width: 15,
      height: 15,
      color: "#ccc"
    },
    rowContentsIE: {
      display: "table"
    },
    rowToolbarIE: {
      position: "unset",
      height: "80%",
      paddingLeft: 0,
      right: -5,
      top: 3
    },
    toolbarButtonIE: {
      display: "flex",
      alignItems: "center"
    }
  })
);

const SortableNode: React.FunctionComponent<NodeRendererProps> = (
  props: NodeRendererProps
): JSX.Element => {
  const {
    scaffoldBlockPxWidth,
    toggleChildrenVisibility,
    connectDragPreview,
    connectDragSource,
    isDragging,
    canDrop,
    canDrag,
    node,
    title,
    subtitle,
    draggedNode,
    path,
    treeIndex,
    isSearchMatch,
    isSearchFocus,
    buttons,
    className,
    style,
    didDrop,
    rowDirection
  } = props;
  const nodeTitle = title || node.title;
  const nodeSubtitle = subtitle || node.subtitle;
  const rowDirectionClass = rowDirection === "rtl" ? "rst__rtl" : null;
  const classes = useStyles();

  let handle;
  if (canDrag) {
    if (typeof node.children === "function" && node.expanded) {
      // Show a loading symbol on the handle when the children are expanded
      //  and yet still defined by a function (a callback to fetch the children)
      handle = (
        <div className="rst__loadingHandle">
          <div className="rst__loadingCircle">
            {[...new Array(12)].map((_, index) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                className={classnames(
                  "rst__loadingCirclePoint",
                  rowDirectionClass
                )}
              ></div>
            ))}
          </div>
        </div>
      );
    } else {
      // Show the handle used to initiate a drag-and-drop
      handle = connectDragSource(
        <div className={classnames("rst__moveHandle", classes.moveIcon)}>
          <DragMoveIcon className={classes.dragIcon} />
        </div>,
        {
          dropEffect: "copy"
        }
      );
    }
  }

  const isDraggedDescendant = draggedNode && isDescendant(draggedNode, node);
  const isLandingPadActive = !didDrop && isDragging;

  let buttonStyle: { [key: string]: number } = {
    left: -0.5 * scaffoldBlockPxWidth
  };
  if (rowDirection === "rtl") {
    buttonStyle = { right: -0.5 * scaffoldBlockPxWidth };
  }

  return (
    <div style={{ height: "100%" }}>
      {toggleChildrenVisibility &&
        node.children &&
        (node.children.length > 0 || typeof node.children === "function") && (
          <div>
            {node.expanded ? (
              <InputRemoveIcon
                aria-label={"Collapse"}
                className={classnames("rst__collapseButton", classes.icon)}
                style={buttonStyle}
                onClick={(): void =>
                  toggleChildrenVisibility({
                    node,
                    path,
                    treeIndex
                  })
                }
              />
            ) : (
              <InputAddIcon
                aria-label={"Expand"}
                className={classnames("rst__expandButton", classes.icon)}
                style={buttonStyle}
                onClick={(): void =>
                  toggleChildrenVisibility({
                    node,
                    path,
                    treeIndex
                  })
                }
              />
            )}

            {node.expanded && !isDragging && (
              <div
                style={{ width: scaffoldBlockPxWidth }}
                className={classnames("rst__lineChildren", rowDirectionClass)}
              />
            )}
          </div>
        )}

      <div
        className={classnames(
          "rst__rowWrapper",
          rowDirectionClass,
          classes.wrapper
        )}
      >
        {/* Set the row preview to be used during drag and drop */}
        {connectDragPreview(
          <div
            className={classnames(
              "rst__row",
              isLandingPadActive && "rst__rowLandingPad",
              isLandingPadActive && !canDrop && "rst__rowCancelPad",
              isSearchMatch && "rst__rowSearchMatch",
              isSearchFocus && "rst__rowSearchFocus",
              rowDirectionClass,
              classes.node,
              className
            )}
            style={{
              opacity: isDraggedDescendant ? 0.5 : 1,
              ...style
            }}
          >
            {handle}
            <div
              className={classnames(
                "rst__rowContents",
                !canDrag && "rst__rowContentsDragDisabled",
                rowDirectionClass
              )}
            >
              <div className={classnames("rst__rowLabel", rowDirectionClass)}>
                <span
                  className={classnames(
                    "rst__rowTitle",
                    node.subtitle && "rst__rowTitleWithSubtitle"
                  )}
                >
                  {typeof nodeTitle === "function"
                    ? nodeTitle({
                        node,
                        path,
                        treeIndex
                      })
                    : nodeTitle}
                </span>

                {nodeSubtitle && (
                  <span className="rst__rowSubtitle">
                    {typeof nodeSubtitle === "function"
                      ? nodeSubtitle({
                          node,
                          path,
                          treeIndex
                        })
                      : nodeSubtitle}
                  </span>
                )}
              </div>

              <div className={classnames("rst__rowToolbar")}>
                {buttons &&
                  buttons.map((btn, index) => (
                    <div
                      key={index} // eslint-disable-line react/no-array-index-key
                      className={classnames("rst__toolbarButton")}
                    >
                      {btn}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SortableNode;
