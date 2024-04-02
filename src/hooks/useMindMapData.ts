import { useCallback, useState } from "react";
import { INode } from "../types";
import { findNode, findNodeParent } from "../helper";
import { nanoid } from "nanoid";
import { cloneDeep } from "lodash";

const useMindMapData = (sourceData: INode) => {
  const [data, setData] = useState<INode>(sourceData);
  const [selectedNode, setSelectedNode] = useState<INode>();

  const appendChildNode = useCallback(
    (
      selectedNode: INode | undefined,
      index?: number,
      sourceNode?: INode,
      pos: "before" | "after" = "after"
    ) => {
      if (!selectedNode) return;
      setData((data) => {
        const newData = cloneDeep(data);
        const node = findNode(newData, selectedNode.id);
        if (!node) return data;
        if (!node.children) {
          node.children = [];
        }
        const targetNode = sourceNode || {
          id: nanoid(),
          label: nanoid(),
          children: [],
        };
        if (typeof index === "number") {
          node.children.splice(
            pos === "before" ? index : index + 1,
            0,
            targetNode
          );
        } else {
          node.children.push(targetNode);
        }
        setSelectedNode(targetNode);
        return newData;
      });
    },
    []
  );

  const appendSameLevelNode = useCallback(
    (
      selectedNode: INode | undefined,
      sourceNode?: INode,
      pos: "before" | "after" = "after"
    ) => {
      if (!selectedNode) return;
      const res = findNodeParent(data, selectedNode.id);
      if (!res) return;
      appendChildNode(res.parentNode, res.curNodeIndex, sourceNode, pos);
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
