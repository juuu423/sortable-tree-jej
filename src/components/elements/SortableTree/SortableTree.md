### Basic SortableTree

- 기본 Tree 목록

```jsx
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";

const useStyles = makeStyles(theme => ({
  root: {
    width: "auto",
    minHeight: 300
  }
}));
const classes = useStyles();

const [treeData, setTreeData] = useState([
  { title: "Sales", children: [{ title: "Sales-1" }] },
  {
    title: "Marketing",
    children: [{ title: "Marketing-1" }, { title: "Marketing-2" }]
  }
]);

const handleChange = data => {
  setTreeData(data);
};

<div className={classes.root}>
  <SortableTree treeData={treeData} onChange={handleChange} />
</div>;
```

### SortableTree with Register, Edit, Remove Event

- Tree Item 추가, 수정, 삭제
- 수정의 경우 별도의 Custom 필요 (제품에선 Drawer 활성화 되는 형태로 제작되어있음)

```jsx
import { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  addNodeUnderParent,
  removeNodeAtPath,
  removeNode
} from "react-sortable-tree";
// components
import Button from "components/elements/Button";
import Scrollbar from "components/elements/Scrollbar";
// others
import * as treeUtils from "lib/util/treeUtil";

const useStyles = makeStyles(theme => ({
  root: {
    width: "auto",
    height: 300
  },
  button: {
    float: "left",
    marginBottom: 20
  }
}));
const classes = useStyles();

const [treeData, setTreeData] = useState([
  { title: "Sales", children: [{ title: "Sales-1" }] },
  {
    title: "Marketing",
    children: [{ title: "Marketing-1" }, { title: "Marketing-2" }]
  }
]);

// title이 input 형태로 등록된 tree item 정보
const addedTreeItemIndex = useRef(0);
const addedTreeData = useRef([]);

const getNodeKey = ({ treeIndex }) => treeIndex;

const handleChange = data => {
  setTreeData(data);
};

const handleRegisterRootNode = data => {
  const registeredObj = addNodeUnderParent({
    treeData: treeData,
    parentKey: null,
    expandParent: true,
    getNodeKey,
    newNode: {
      title: "Root Tree"
    }
  });

  setTreeData(registeredObj.treeData);
};

const handleTreeItemAdd = data => {
  const { treeData, treeIndex, parentNode } = data;

  setTreeData(treeData);
  addedTreeItemIndex.current = treeIndex;
  addedTreeData.current = treeData;
};

const handleTreeItemDelete = () => {
  if (addedTreeData.current.length > 0) {
    const path = treeUtils.getPath(
      addedTreeData.current,
      addedTreeItemIndex.current
    );
    const result = removeNode({
      treeData: addedTreeData.current,
      path,
      getNodeKey,
      ignoreCollapsed: true
    });

    setTreeData(result.treeData);
    addedTreeItemIndex.current = 0;
    addedTreeData.current = [];
  }
};

const handleRegister = title => {
  console.log("title:", title);
};

const handleDelete = data => {
  const { path } = data;

  setTreeData(
    removeNodeAtPath({
      treeData,
      path: path,
      getNodeKey
    })
  );
};

const handleEdit = data => {
  // 기획 요구 사항으로는 edit 클릭시 우측의 drawer가 열리는 형식이라 사용하는 곳에서 custom 필요
  console.log(data);
};

<div>
  <div className={classes.root}>
    <Scrollbar>
      <SortableTree
        treeData={treeData}
        onChange={handleChange}
        onTreeItemAdd={handleTreeItemAdd}
        onTreeItemDelete={handleTreeItemDelete}
        onRegister={handleRegister}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </Scrollbar>
  </div>
  <div className={classes.button}>
    <Button
      variant="outlined"
      color="default"
      size="small"
      onClick={handleRegisterRootNode}
    >
      Register Root Node
    </Button>
  </div>
</div>;
```
