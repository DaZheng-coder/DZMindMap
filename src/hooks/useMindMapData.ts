import { useCallback, useState } from "react";
import { INode } from "../types";
import { findNode, findNodeParent } from "../helper";
import { nanoid } from "nanoid";
import { cloneDeep } from "lodash";

const useMindMapData = (sourceData: INode) => {
  const [data, setData] = useState<INode>(sourceData);
  const [selectedNode, setSelectedNode] = useState<INode>();

  const appendChildNode = useCallback(
    (selectedNode: INode | undefined, index?: number) => {
      if (!selectedNode) return;
      setData((data) => {
        const newData = cloneDeep(data);
        const node = findNode(newData, selectedNode.id);
        if (!node) return data;
        if (!node.children) {
          node.children = [];
        }
        const newNode = {
          id: nanoid(),
          label: nanoid(),
          children: [],
        };
        if (typeof index === "number") {
          node.children.splice(index + 1, 0, newNode);
        } else {
          node.children.push(newNode);
        }
        setSelectedNode(newNode);
        return newData;
      });
    },
    []
  );

  const appendSameLevelNode = useCallback(
    (selectedNode: INode | undefined) => {
      if (!selectedNode) return;
      const res = findNodeParent(data, selectedNode.id);
      if (!res) return;
      appendChildNode(res.parentNode, res.curNodeIndex);
    },
    [data, appendChildNode]
  );

  const removeNodeBlock = useCallback((selectedNode: INode | undefined) => {
    if (!selectedNode) return;
    setData((data) => {
      const newData = cloneDeep(data);
      const res = findNodeParent(newData, selectedNode.id);
      if (!res) return data;
      res.parentNode.children = res.parentNode.children?.filter(
        (child) => child.id !== selectedNode.id
      );
      return newData;
    });
  }, []);

  return {
    data,
    appendChildNode,
    appendSameLevelNode,
    selectedNode,
    setSelectedNode,
    removeNodeBlock,
  };
};

export default useMindMapData;
