import { INode } from "./../types/index";
import { useCallback, useState } from "react";
import { findNodesByIds, getNewNode } from "../helper";
import { cloneDeep } from "lodash";

const useMindMapData = (initData: INode) => {
  const [mindMapData, setMindMapData] = useState<INode>(initData);
  const [selectNodeId, setSelectNodeId] = useState<string>();

  const appendChildNode = useCallback(
    (selectNodeId: string | undefined, appendingNodeId?: string) => {
      if (!selectNodeId || selectNodeId === appendingNodeId) return;
      setMindMapData((data) => {
        const newData = cloneDeep(data);
        const res = findNodesByIds(newData, [selectNodeId, appendingNodeId]);
        let appendingNode: INode;
        if (appendingNodeId) {
          appendingNode = res[1].node;
          res[1].parentNode.children.splice(res[1].index, 1);
        } else {
          appendingNode = getNewNode();
        }
        res[0].node.children.push(appendingNode);
        setSelectNodeId(appendingNode.id);
        return newData;
      });
    },
    []
  );

  const appendSiblingNode = useCallback(
    (
      selectNodeId: string | undefined,
      insert: "before" | "after",
      appendingNodeId?: string
    ) => {
      if (!selectNodeId || selectNodeId === appendingNodeId) return;
      setMindMapData((data) => {
        const newData = cloneDeep(data);
        const res = findNodesByIds(newData, [selectNodeId, appendingNodeId]);
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
        setSelectNodeId(appendingNode.id);
        return newData;
      });
    },
    []
  );

  const removeNode = useCallback((selectNodeId: string | undefined) => {
    if (!selectNodeId) return;
    setMindMapData((data) => {
      const newData = cloneDeep(data);
      const res = findNodesByIds(newData, [selectNodeId]);
      res[0].parentNode.children.splice(res[0].index, 1);
      setSelectNodeId(res[0].parentNode.id);
      return newData;
    });
  }, []);

  return {
    mindMapData,
    appendChildNode,
    appendSiblingNode,
    removeNode,
    selectNodeId,
    setSelectNodeId,
  };
};

export default useMindMapData;
