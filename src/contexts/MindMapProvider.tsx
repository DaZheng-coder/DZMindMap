import React, {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useState,
} from "react";

import { INode, IPreviewNodeData } from "../types";
import { cloneDeep } from "lodash";
import { findNodesByIds, getNewNode } from "../helper";

interface IMindMapProviderProps {
  initData: INode;
  children: ReactNode;
}

export const MindMapContext = createContext<{
  selectNodeId: string | undefined;
  mindMapData: INode;
  previewNodeData: IPreviewNodeData | undefined;
  appendChildNode: (
    selectNodeId: string | undefined,
    appendingNodeId?: string
  ) => void;
  appendSiblingNode: (
    selectNodeId: string | undefined,
    insert: "before" | "after",
    appendingNodeId?: string
  ) => void;
  removeNode: (selectNodeId: string | undefined) => void;
  editNode: (nodeId: string, value: string) => void;
  setSelectNodeId: (nodeId: string | undefined) => void;
  setPreviewNodeData: (data: IPreviewNodeData) => void;
  changeNodeShrink: (selectNodeId: string, shrink?: boolean) => void;
  updateNodeLabel: (selectNodeId: string, newLabel: ReactNode) => void;
} | null>(null);

const MindMapProvider: FC<IMindMapProviderProps> = ({ initData, children }) => {
  const [mindMapData, setMindMapData] = useState<INode>(initData);
  const [selectNodeId, setSelectNodeId] = useState<string>();
  const [previewNodeData, setPreviewNodeData] = useState<IPreviewNodeData>();

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
        const selectNode = res[0];
        const appendingNode: INode = appendingNodeId
          ? res[1].node
          : getNewNode();

        const insertIndex =
          insert === "before" ? selectNode.index : selectNode.index + 1;
        selectNode.parentNode.children.splice(insertIndex, 0, appendingNode);

        if (appendingNodeId) {
          const appendingNode = res[1];
          const isSameParent =
            appendingNode.parentNode.id === selectNode.parentNode.id;
          const deleteIndex =
            isSameParent && appendingNode.index > selectNode.index
              ? appendingNode.index + 1
              : appendingNode.index;
          res[1].parentNode.children.splice(deleteIndex, 1);
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

  const editNode = useCallback((nodeId: string, value: string) => {
    setMindMapData((data) => {
      const newData = cloneDeep(data);
      const res = findNodesByIds(newData, [nodeId]);
      res[0].node.label = value;
      return newData;
    });
  }, []);

  const changeNodeShrink = useCallback(
    (selectNodeId: string, shrink?: boolean) => {
      setMindMapData((data) => {
        const newData = cloneDeep(data);
        const res = findNodesByIds(newData, [selectNodeId]);
        res[0].node.shrink =
          typeof shrink === "boolean" ? shrink : !res[0].node.shrink;
        return newData;
      });
    },
    []
  );

  const updateNodeLabel = useCallback(
    (selectNodeId: string, newLabel: ReactNode) => {
      setMindMapData((data) => {
        const newData = cloneDeep(data);
        const res = findNodesByIds(newData, [selectNodeId]);
        res[0].node.label = newLabel;
        return newData;
      });
    },
    []
  );

  return (
    <MindMapContext.Provider
      value={{
        mindMapData,
        appendChildNode,
        appendSiblingNode,
        removeNode,
        editNode,
        selectNodeId,
        setSelectNodeId,
        previewNodeData,
        setPreviewNodeData,
        changeNodeShrink,
        updateNodeLabel,
      }}
    >
      {children}
    </MindMapContext.Provider>
  );
};

export default MindMapProvider;
