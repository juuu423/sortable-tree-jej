import React, { useState, useRef } from "react";
import {
  TreeItem,
  ExtendedNodeData,
  FullTree,
  TreeIndex,
  TreeNode,
  addNodeUnderParent,
  removeNodeAtPath,
  removeNode
} from "react-sortable-tree";
// @material-ui/core components
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
// components
import SortableTree from "components/elements/SortableTree";
// others
import {
  Team,
  convertTreeList,
  convertTreeItem,
  getPath,
  getTreeItemAfterModify
} from "utils/treeUtil";

const list: Team[] = [
  {
    teamId: "develop",
    name: "개발팀",
    description: "",
    parentId: "root",
    depth: 1,
    order: 0,
    breadcrumb: "개발팀"
  },
  {
    teamId: "develop1",
    name: "개발1팀",
    description: "",
    parentId: "develop",
    depth: 2,
    order: 0,
    breadcrumb: "개발팀 > 개발1팀"
  },
  {
    teamId: "develop2",
    name: "개발2팀",
    description: "",
    parentId: "develop",
    depth: 2,
    order: 1,
    breadcrumb: "개발팀 > 개발2팀"
  },
  {
    teamId: "planning",
    name: "기획팀",
    description: "",
    parentId: "root",
    depth: 1,
    order: 2,
    breadcrumb: "기획팀"
  },
  {
    teamId: "design",
    name: "디자인팀",
    description: "",
    parentId: "root",
    depth: 1,
    order: 4,
    breadcrumb: "디자인팀"
  },
  {
    teamId: "construction",
    name: "구축팀",
    description: "",
    parentId: "root",
    depth: 1,
    order: 6,
    breadcrumb: "구축팀"
  }
];

const useStyles = makeStyles(
  createStyles({
    wrapper: {
      height: 700,
      width: 1000,
      padding: 20,
      alignContent: "center",
      overflow: "auto"
    },
    tree: { display: "flex", height: "70%", width: "100%", overflowX: "auto" },
    treeNode: { marginLeft: "-14px" },
    contents: {
      width: "100%",
      height: `calc(100vh - 110px)`,
      position: "relative",
      padding: "20px",
      overflowX: "hidden"
    },
    button: {
      marginBottom: 20
    }
  })
);

export default function SimpleSortableTree(): JSX.Element {
  const classes = useStyles();
  const [treeData, setTreeData] = useState(
    convertTreeItem(convertTreeList(list))
  );
  const [selectedTreeId, setSelectedTreeId] = useState(treeData[0].teamId);

  // title이 input 형태로 등록된 tree item 정보
  const addedTreeItemIndex = useRef(0);
  const addedTreeData = useRef<TreeItem[]>([]);

  const getNodeKey = ({ treeIndex }: TreeNode & TreeIndex): string | number =>
    treeIndex;

  const handleChange = (data: TreeItem[]): void => {
    setTreeData(data);
  };

  const handleClick = (data: ExtendedNodeData): void => {
    setSelectedTreeId(data.node.treeId);
  };

  const handleRegisterRootNode = (): void => {
    const registeredObj = addNodeUnderParent({
      treeData,
      parentKey: undefined,
      expandParent: true,
      getNodeKey,
      newNode: {
        title: "Root Tree"
      }
    });

    setTreeData(registeredObj.treeData);
  };

  const handleTreeItemAdd = (
    data: FullTree &
      TreeIndex & {
        parentNode: TreeItem;
      }
  ): void => {
     const { treeData, treeIndex } = data;

     setTreeData(treeData);
     addedTreeItemIndex.current = treeIndex;
     addedTreeData.current = treeData;
  };

  const handleTreeItemDelete = (): void => {
     if (addedTreeData.current.length > 0) {
       const path = getPath(
         addedTreeData.current,
         addedTreeItemIndex.current
       );
       const result = removeNode({
         treeData: addedTreeData.current,
         path,
         getNodeKey,
         ignoreCollapsed: true
       });

       result && setTreeData(result.treeData);
       addedTreeItemIndex.current = 0;
       addedTreeData.current = [];
     }
  };

  const handleRegister = (title: string): void => {
    getTreeItemAfterModify(treeData, {treeId: addedTreeData.current[0].treeId, name: title});
  };

  const handleDelete = (data: ExtendedNodeData): void => {
    const { path } = data;

    setTreeData(
      removeNodeAtPath({
        treeData,
        path: path,
        getNodeKey
      })
    );
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.tree}>
        <div className={classes.contents}>
          <div className={classes.treeNode}>
            <SortableTree
              treeData={treeData}
              selectedTreeId={selectedTreeId}
              isUnableEditDeleteRoot
              onChange={handleChange}
              onRegister={handleRegister}
              onDelete={handleDelete}
              onClick={handleClick}
              onTreeItemAdd={handleTreeItemAdd}
              onTreeItemDelete={handleTreeItemDelete}
            />
          </div>
        </div>
      </div>

      <div className={classes.button}>
        <Button variant="outlined" onClick={handleRegisterRootNode}>
          Register Root Node
        </Button>
      </div>
    </div>
  );
}
