/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Children, cloneElement } from "react";
import { TreeRendererProps } from "react-sortable-tree";
import classnames from "classnames";
// @material-ui/core components
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
// styles
import "./sortableStyle.css";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      "& .rst__lineHalfHorizontalRight::before,.rst__lineFullVertical::after,.rst__lineHalfVerticalTop::after,.rst__lineHalfVerticalBottom::after": {
        backgroundColor: "rgba(0,0,0,0.3)"
      },
      "& .rst__lineChildren::after": {
        backgroundColor: "rgba(0,0,0,0.3)"
      }
    },
    borderNone: {
      "& > .rst__lineBlock": {
        display: "none"
      }
    },
    borderShow: {
      "& > .rst__lineBlock": {
        display: "inline-block"
      }
    }
  })
);

const SortableTreeNode: React.FunctionComponent<TreeRendererProps> = (
  props: TreeRendererProps
): JSX.Element | null => {
  const {
    children,
    listIndex,
    swapFrom,
    swapLength,
    swapDepth,
    scaffoldBlockPxWidth,
    lowerSiblingCounts,
    connectDropTarget,
    isOver,
    draggedNode,
    canDrop,
    treeIndex,
    rowDirection,
    node, // Delete from otherProps
    getPrevRow, // Delete from otherProps
    treeId, // Delete from otherProps
    ...otherProps
  } = props;
  const classes = useStyles();

  const rowDirectionClass = rowDirection === "rtl" ? "rst__rtl" : null;

  // Construct the scaffold representing the structure of the tree
  const scaffoldBlockCount = lowerSiblingCounts.length;
  const scaffold: unknown[] = [];

  lowerSiblingCounts.forEach((lowerSiblingCount, i) => {
    let lineClass = "";
    if (lowerSiblingCount > 0) {
      // At this level in the tree, the nodes had sibling nodes further down

      if (listIndex === 0) {
        // Top-left corner of the tree
        // +-----+
        // |     |
        // |  +--+
        // |  |  |
        // +--+--+
        lineClass = "rst__lineHalfHorizontalRight rst__lineHalfVerticalBottom";
      } else if (i === scaffoldBlockCount - 1) {
        // Last scaffold block in the row, right before the row content
        // +--+--+
        // |  |  |
        // |  +--+
        // |  |  |
        // +--+--+
        lineClass = "rst__lineHalfHorizontalRight rst__lineFullVertical";
      } else {
        // Simply connecting the line extending down to the next sibling on this level
        // +--+--+
        // |  |  |
        // |  |  |
        // |  |  |
        // +--+--+
        lineClass = "rst__lineFullVertical";
      }
    } else if (listIndex === 0) {
      // Top-left corner of the tree, but has no siblings
      // +-----+
      // |     |
      // |  +--+
      // |     |
      // +-----+
      lineClass = "rst__lineHalfHorizontalRight";
    } else if (i === scaffoldBlockCount - 1) {
      // The last or only node in this level of the tree
      // +--+--+
      // |  |  |
      // |  +--+
      // |     |
      // +-----+
      lineClass = "rst__lineHalfVerticalTop rst__lineHalfHorizontalRight";
    }

    // 최상위 트리노드가 1개만 있을 경우 `-----` 라인 제거
    if (
      listIndex === 0 &&
      lowerSiblingCounts.length === 1 &&
      lowerSiblingCounts[0] === 0 &&
      node.children &&
      node.children.length === 0
    ) {
      lineClass = "";
    }

    scaffold.push(
      <div
        key={`pre_${1 + i}`}
        style={{ width: scaffoldBlockPxWidth, color: "red" }}
        className={classnames("rst__lineBlock", lineClass, rowDirectionClass)}
      />
    );

    if (treeIndex !== listIndex && i === swapDepth) {
      // This row has been shifted, and is at the depth of
      // the line pointing to the new destination
      let highlightLineClass = "";

      if (listIndex === (swapFrom || 0) + (swapLength || 0) - 1) {
        // This block is on the bottom (target) line
        // This block points at the target block (where the row will go when released)
        highlightLineClass = "rst__highlightBottomLeftCorner";
      } else if (treeIndex === swapFrom) {
        // This block is on the top (source) line
        highlightLineClass = "rst__highlightTopLeftCorner";
      } else {
        // This block is between the bottom and top
        highlightLineClass = "rst__highlightLineVertical";
      }

      let style;
      if (rowDirection === "rtl") {
        style = {
          width: scaffoldBlockPxWidth,
          right: scaffoldBlockPxWidth * i
        };
      } else {
        // Default ltr
        style = {
          width: scaffoldBlockPxWidth,
          left: scaffoldBlockPxWidth * i
        };
      }

      scaffold.push(
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          style={style}
          className={classnames(
            "rst__absoluteLineBlock",
            highlightLineClass,
            rowDirectionClass
          )}
        />
      );
    }
  });

  let blockStyle;
  if (rowDirection === "rtl") {
    blockStyle = { right: scaffoldBlockPxWidth * scaffoldBlockCount };
  } else {
    // Default ltr
    blockStyle = { left: scaffoldBlockPxWidth * scaffoldBlockCount };
  }

  return connectDropTarget(
    <div
      {...otherProps}
      className={classnames(classes.wrapper, "rst__node", rowDirectionClass)}
    >
      {scaffold}

      <div className="rst__nodeContent" style={blockStyle}>
        {Children.map(children, child =>
          cloneElement(child, {
            isOver,
            canDrop,
            draggedNode
          })
        )}
      </div>
    </div>
  );
};

export default SortableTreeNode;
