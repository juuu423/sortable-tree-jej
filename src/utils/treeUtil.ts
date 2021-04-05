import {
  TreeItem,
  TreeNode,
  TreeIndex,
  ExtendedNodeData,
  removeNodeAtPath,
  find,
  SearchData,
  NodeData,
  changeNodeAtPath,
  getVisibleNodeInfoAtIndex
} from "react-sortable-tree";
import arrayToTree from "array-to-tree";

export interface Team {
  teamId: string;
  name: string;
  description?: string;
  parentId: string;
  depth: number;
  order?: number;
  breadcrumb?: string;
  children?: Team[];
}

export const TEAM_ROOT = "root";
export const PARENT_ID = "parentId";
export const TEAM_ID = "teamId";

type NumberOrStringArray = Array<string | number>;

export const flatten = (arr: Team[]): Team[] => {
  return arr
    ? arr.reduce(
        (result: Team[], item: Team) => [
          ...result,
          { ...item },
          ...flatten(item.children as Team[])
        ],
        []
      )
    : [];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertTreeList = (list: Team[]): Array<arrayToTree.Tree<any>> => {
  const initList = list
    .filter((team: Team) => team.teamId !== TEAM_ROOT)
    .map((item: Team) => {
      return { ...item, children: [] } as Team;
    });

  const treeList = arrayToTree(initList, {
    parentProperty: PARENT_ID,
    customID: TEAM_ID
  });

  return treeList;
};

export const convertTreeItemChildren = (data: Team[]): TreeItem[] => {
  const treeList: TreeItem[] = data.map(team => {
    return {
      treeId: team.teamId,
      title: team.name,
      children: convertTreeItemChildren(team.children || [])
    };
  });

  return treeList;
};

export const convertTreeItem = (data: Team[]): TreeItem[] => {
  const treeList: TreeItem[] = data.map(team => {
    return {
      treeId: team.teamId,
      title: team.name,
      children: convertTreeItemChildren(team.children || [])
    };
  });

  return [
    {
      treeId: TEAM_ROOT,
      title: "전체",
      expanded: true,
      children: treeList || []
    }
  ];
};

export const getNodeKey = ({
  treeIndex
}: TreeNode & TreeIndex): string | number => treeIndex;

export const getPath = (
  treeData: TreeItem[],
  index: number
): NumberOrStringArray => {
  const result = getVisibleNodeInfoAtIndex({ treeData, index, getNodeKey });
  return result?.path || [];
};

export const getTreeItemAfterRemove = (
  treeData: TreeItem[],
  removeData: ExtendedNodeData | number
): TreeItem[] => {
  const path =
    typeof removeData !== "number"
      ? removeData.path
      : getPath(treeData, removeData);
  return removeNodeAtPath({
    treeData,
    path: path,
    getNodeKey
  });
};

const searchByTeamId = (data: SearchData): boolean => {
  const { node, searchQuery } = data;
  return node.treeId === searchQuery;
};

export const getNodeDataByTreeId = (
  treeData: TreeItem[],
  searchTreeId: string
): NodeData => {
  const searchedTreeData = find({
    treeData,
    expandAllMatchPaths: true,
    searchQuery: searchTreeId,
    getNodeKey,
    searchMethod: searchByTeamId
  });
  return searchedTreeData.matches[0];
};

export const getTreeItemAfterModify = (
  treeData: TreeItem[],
  modifyData: { treeId: string; name: string }
): TreeItem[] => {
  const modifyNodeData = getNodeDataByTreeId(treeData, modifyData.treeId);
  const { path, node } = modifyNodeData;
  const { children } = node;

  return changeNodeAtPath({
    treeData: treeData,
    path: path,
    getNodeKey,
    newNode: {
      treeId: modifyData.treeId,
      title: modifyData.name,
      children
    }
  });
};

export const getTreeItemAfterRegister = (
  treeData: TreeItem[],
  registeredData: { addedTreeIndex: number; treeId: string; name: string }
): TreeItem[] => {
  const { addedTreeIndex, treeId, name } = registeredData;
  const path = getPath(treeData, addedTreeIndex);

  return changeNodeAtPath({
    treeData: treeData,
    path: path,
    getNodeKey,
    newNode: {
      title: name,
      treeId
    }
  });
};

export const getChildrenIds = (node: TreeItem): string[] => {
  let childrenIds = [];

  if (node && node.children && typeof node.children !== "function") {
    childrenIds = Array.from(node.children || []).map(
      (item: TreeItem) => item.treeId
    );
  }

  return childrenIds;
};

export { getVisibleNodeInfoAtIndex };
