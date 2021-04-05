import React, { useRef } from "react";
import ReactSortableTree, {
  ReactSortableTreeProps,
  TreeItem as ReactTreeItem,
  TreeIndex,
  ExtendedNodeData,
  OnDragPreviousAndNextLocation,
  NodeData,
  FullTree,
  addNodeUnderParent
} from "react-sortable-tree";
// @material-ui/core components
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core";
// components
import Tooltip from "components/elements/Tooltip";
import Typography from "components/elements/Typography";
import TextField from "components/elements/TextField";
import SortableNode from "components/elements/SortableTree/SortableNode";
import SortableTreeNode from "components/elements/SortableTree/SortableTreeNode";
// others
import { AddIcon, EditIcon, DeleteIcon } from "assets/icon";
import * as treeUtils from "utils/treeUtil";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      cursor: "pointer",
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      paddingLeft: 15
    },
    iconContent: {
      paddingTop: 5,
      paddingRight: 10,
      "& svg": {
        width: 16,
        height: 16,
        color: theme.palette.text.disabled,
        cursor: "pointer"
      },
      "& :hover": {
        color: "#ccc"
      }
    },
    tooltip: {
      marginTop: 5,
      marginRight: 10
    },
    input: {
      paddingTop: 3,
      "& > .MuiInput-underline:before, & > .MuiInput-underline:after, & > .MuiInput-underline:hover:not(.Mui-disabled):before": {
        borderBottom: 0
      }
    },
    titleTypography: { width: 120 }
  })
);

function isString(item: React.ReactNode): boolean {
  return typeof item === "string";
}

function SortableTree(props: SortableTreeProps): JSX.Element {
  const classes = useStyles();
  const theme = useTheme();

  const inputTitle = useRef("");

  const handleCanDrop = ({
    nextParent
  }: OnDragPreviousAndNextLocation & NodeData): boolean => {
    return !nextParent ? false : true;
  };

  const handleChange = (event: React.FocusEvent<HTMLInputElement>): void => {
    inputTitle.current = event.target.value;
  };

  const handleRegister = (title: string): void => {
    if (props.onRegister) {
      props.onRegister(title);
    }
    inputTitle.current = "";
  };

  const handleTreeItemDelete = (): void => {
    if (props.onTreeItemDelete) {
      props.onTreeItemDelete();
    }
    inputTitle.current = "";
  };

  const handleOnBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
    event.preventDefault();

    if (event.target.value) {
      handleRegister(event.target.value);
    } else {
      handleTreeItemDelete();
    }
  };

  const handleKeyDownEvent = (
    event: React.KeyboardEvent<HTMLDivElement>
  ): void => {
    if (event.keyCode === 13) {
      if (inputTitle.current.trim().length > 0) {
        handleRegister(inputTitle.current);
      } else {
        handleTreeItemDelete();
      }
    }

    if (event.keyCode === 27) {
      handleTreeItemDelete();
    }

    event.stopPropagation();
  };

  const handleTreeItemAdd = (data: ExtendedNodeData): void => {
    const { path, node } = data;

    const registeredObj = addNodeUnderParent({
      treeData: props.treeData,
      parentKey: path[path.length - 1],
      expandParent: true,
      newNode: {
        title: (
          <TextField
            className={classes.input}
            name="title"
            placeholder={"이름을 입력하세요"}
            inputProps={{ maxLength: 20 }}
            autoComplete="off"
            autoFocus
            onChange={handleChange}
            onBlur={handleOnBlur}
            onKeyDown={handleKeyDownEvent}
          />
        )
      },
      getNodeKey: treeUtils.getNodeKey
    });

    if (registeredObj && props.onTreeItemAdd) {
      props.onTreeItemAdd({ ...registeredObj, parentNode: node });
    }
  };

  const handleGenerateNodeProps = (
    data: ExtendedNodeData
  ): { [index: string]: unknown } => {
    const { treeIndex, node } = data;
    const selectedTree =
      (props.selectedTreeId || "") === node.treeId ||
      (props.selectedTreeId === "" && node.treeId === "root");
    const isAddable = props.onTreeItemAdd !== undefined;
    let isEditable = props.onEdit !== undefined;
    let isRemovable = props.onDelete !== undefined;

    // 최상위 노드 수정/삭제 막았을 경우
    if (treeIndex === 0 && props.isUnableEditDeleteRoot) {
      isEditable = false;
      isRemovable = false;
    }

    let style: { [key: string]: string } = {
      width: "240px",
      maxWidth: "450px",
      border: `1px solid #ccc`,
      color: theme.palette.text.secondary
    };

    if (selectedTree) {
      style = {
        ...style,
        border: `1px solid ${theme.palette.primary.main}`,
        color: theme.palette.primary.main
      };
    }

    return {
      title: (
        <Title
          data={data}
          onClick={isString(node.title) ? props.onClick : undefined}
        />
      ),
      buttons: [
        <div key={treeIndex} className={classes.iconContent}>
          {isString(node.title) && isAddable && (
            <Tooltip title={"등록"} className={classes.tooltip}>
              <AddIcon
                onClick={(): void => {
                  handleTreeItemAdd(data);
                }}
              />
            </Tooltip>
          )}
          {isString(node.title) && isEditable && (
            <Tooltip title={"수정"} className={classes.tooltip}>
              <EditIcon
                onClick={(): void => {
                  if (props.onEdit) {
                    props.onEdit(data);
                  }
                }}
              />
            </Tooltip>
          )}
          {isString(node.title) && isRemovable && (
            <Tooltip title={"삭제"}>
              <DeleteIcon
                onClick={(): void => {
                  if (props.onDelete) {
                    props.onDelete(data);
                  }
                }}
              />
            </Tooltip>
          )}
        </div>
      ],
      style: style
    };
  };

  return (
    <>
      <ReactSortableTree
        {...props}
        treeData={props.treeData}
        isVirtualized={false}
        generateNodeProps={handleGenerateNodeProps}
        canDrop={handleCanDrop}
        theme={{
          nodeContentRenderer: SortableNode,
          treeNodeRenderer: SortableTreeNode
        }}
      />
    </>
  );
}

function Title({ data, onClick }: TitleProps): JSX.Element {
  const classes = useStyles();
  const { node } = data;

  return (
    <div
      className={classes.title}
      onClick={(): void => {
        if (onClick) {
          onClick(data);
        }
      }}
    >
      {isString(node.title) ? (
        <Typography className={classes.titleTypography} ellipsis>
          {node.title}
        </Typography>
      ) : (
        node.title
      )}
    </div>
  );
}

export type TreeItem = ReactTreeItem;

interface TitleProps {
  data: ExtendedNodeData;
  onClick?(data: ExtendedNodeData): void;
}

interface SortableTreeProps extends ReactSortableTreeProps {
  /** 선택된 Tree node id */
  selectedTreeId?: string;
  /** 최상위 0번째 Root node 수정/삭제 불가 여부 */
  isUnableEditDeleteRoot?: boolean;
  /** Title 입력 가능한 Input 형태의 Item 추가 */
  onTreeItemAdd?(
    data: FullTree &
      TreeIndex & {
        parentNode: ReactTreeItem;
      }
  ): void;
  /** Input 형태의 Item 제거 */
  onTreeItemDelete?(): void;
  /** Input 에 입력된 Title 등록 */
  onRegister?(title: string): void;
  /** 해당 Tree Item 수정 시 필요한 상세 정보 callback func */
  onEdit?(data: ExtendedNodeData): void;
  /** 해당 Tree Item 삭제 시 필요한 상세 정보 callback func */
  onDelete?(data: ExtendedNodeData): void;
  /** 클릭된 Tree Item 상세 정보 callback func */
  onClick?(data: ExtendedNodeData): void;
}

export default SortableTree;
