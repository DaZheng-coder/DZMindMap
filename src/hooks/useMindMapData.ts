import { INode } from "./../types/index";
import { useCallback, useState } from "react";
import { findNodesByIds, getNewNode } from "../helper";
import { cloneDeep } from "lodash";

const useMindMapData = (initData: INode) => {
  const [mindMapData, setMindMapData] = useState<INode>(initData);
  const [selectedNodeId, setSelectedNodeId] = useState<string>();

  const appendChildNode = useCallback(
    (selectedNodeId: string | undefined, appendingNodeId?: string) => {
      if (!selectedNodeId) return;
      setMindMapData((data) => {
        const newData = cloneDeep(data);
        const res = findNodesByIds(newData, [selectedNodeId, appendingNodeId]);
        const appendingNode = appendingNodeId ? res[1].node : getNewNode();
        res[0].node.children.push(appendingNode);
        setSelectedNodeId(appendingNode.id);
        return newData;
      });
    },
    []
  );

  const appendSiblingNode = useCallback(
    (
      selectedNodeId: string | undefined,
      insert: "before" | "after",
      appendingNodeId?: string
    ) => {
      if (!selectedNodeId) return;
      setMindMapData((data) => {
        const newData = cloneDeep(data);
        const res = findNodesByIds(newData, [selectedNodeId, appendingNodeId]);
        const selectedParentNode = res[0].parentNode;
        let appendingNode: INode;
        if (appendingNodeId) {
          appendingNode = res[1].node;
          res[1].parentNode.children.splice(res[1].index, 1);
        } else {
          appendingNode = getNewNode();
        }
        if (insert === "before") {
          selectedParentNode.children.splice(res[0].index, 0, appendingNode);
        } else {
          if (res[0].index + 1 >= selectedParentNode.children.length) {
            selectedParentNode.children.push(appendingNode);
          } else {
            selectedParentNode.children.splice(
              res[0].index + 1,
              0,
              appendingNode
            );
          }
        }
        setSelectedNodeId(appendingNode.id);
        return newData;
      });
    },
    []
  );

  const removeNode = useCallback((selectedId: string | undefined) => {
    if (!selectedId) return;
    setMindMapData((data) => {
      const newData = cloneDeep(data);
      const res = findNodesByIds(newData, [selectedId]);
      res[0].parentNode.children.splice(res[0].index, 1);
      setSelectedNodeId(res[0].parentNode.id);
      return newData;
    });
  }, []);

  return {
    mindMapData,
    appendChildNode,
    appendSiblingNode,
    removeNode,
    selectedNodeId,
    setSelectedNodeId,
  };
};

export default useMindMapData;
