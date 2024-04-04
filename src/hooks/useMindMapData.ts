import { useCallback, useState } from "react";
import { INode, TPreviewVisible } from "../types";
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
          const insertIndex = pos === "before" ? index : index + 1;
          node.children.splice(insertIndex, 0, targetNode);
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
      if (res) {
        appendChildNode(res.parentNode, res.curNodeIndex, sourceNode, pos);
      }
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

  const moveNodeBlock = useCallback(
    (selectedNode: INode, movingNode: INode, pos: TPreviewVisible) => {
      setData((data) => {
        const newData = cloneDeep(data);
        const _selectedNode = findNode(newData, selectedNode.id);
        const _movingNode = findNode(newData, movingNode.id);

        const movingPRes = findNodeParent(newData, movingNode.id);
        movingPRes?.parentNode.children?.splice(movingPRes.curNodeIndex, 1);

        if (pos === "lastChild") {
          _movingNode && _selectedNode?.children?.push(_movingNode);
        } else {
          const selectedPRes = findNodeParent(newData, selectedNode.id);
          if (selectedPRes && _movingNode) {
            const { curNodeIndex } = selectedPRes;
            const index = pos === "top" ? curNodeIndex : curNodeIndex + 1;
            selectedPRes?.parentNode.children?.splice(index, 0, _movingNode);
          }
        }
        return newData;
      });
    },
    []
  );

  return {
    data,
    appendChildNode,
    appendSameLevelNode,
    selectedNode,
    setSelectedNode,
    removeNodeBlock,
    moveNodeBlock,
  };
};

export default useMindMapData;
