import React, {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useState,
} from "react";

import { INode, IPreviewNodeData, IRootNode, TDir } from "../types";
import { cloneDeep } from "lodash";
import { findNodesByIds, getNewNode } from "../helper";

interface IMindMapProviderProps {
  initData: IRootNode;
  children: ReactNode;
}

export const MindMapContext = createContext<{
  selectNodeId: string | undefined;
  mindMapData: IRootNode;
  previewNodeData: IPreviewNodeData | undefined;
  appendChildNode: (
    selectNodeId: string | undefined,
    appendingNodeId?: string
  ) => void;
  appendRootChildNode: (dir: TDir, appendingNodeId?: string) => void;
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
  const [mindMapData, setMindMapData] = useState<IRootNode>(initData);
  const [selectNodeId, setSelectNodeId] = useState<string>();
  const [previewNodeData, setPreviewNodeData] = useState<IPreviewNodeData>();

  const appendRootChildNode = useCallback(
    (dir: TDir, appendingNodeId?: string) => {
      setMindMapData((data) => {
        const newData = cloneDeep(data);
        let appendingNode: INode;
        if (appendingNodeId) {
          const res = findNodesByIds(newData, [appendingNodeId]);
          appendingNode = res[0].node;
          const children = (res[0].parentNode as IRootNode)[
            res[1].inChildrenKey
          ];
          children.splice(res[0].index, 1);
        } else {
          appendingNode = getNewNode();
        }
        const childrenKey = dir === "left" ? "reverseChildren" : "children";
        newData[childrenKey].push(appendingNode);
        setSelectNodeId(appendingNode.id);
        return newData;
      });
    },
    []
  );

  const appendChildNode = useCallback(
    (selectNodeId: string | undefined, appendingNodeId?: string) => {
      if (!selectNodeId || selectNodeId === appendingNodeId) return;
      setMindMapData((data) => {
        const newData = cloneDeep(data);
        const res = findNodesByIds(newData, [selectNodeId, appendingNodeId]);
        let appendingNode: INode;
        if (appendingNodeId) {
          appendingNode = res[1].node;
          const children = (res[1].parentNode as IRootNode)[
            res[1].inChildrenKey
          ];
          children.splice(res[1].index, 1);
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
        const appendingNode: INode = appendingNodeId
          ? res[1].node
          : getNewNode();
        const insertIndex =
          insert === "before" ? res[0].index : res[0].index + 1;
        const children = (res[0].parentNode as IRootNode)[res[0].inChildrenKey];
        children.splice(insertIndex, 0, appendingNode);

        if (appendingNodeId) {
          const isSameParent = res[1].parentNode.id === res[0].parentNode.id;
          const deleteIndex =
            isSameParent && res[1].index > res[0].index
              ? res[1].index + 1
              : res[1].index;
          const children = (res[1].parentNode as IRootNode)[
            res[1].inChildrenKey
          ];
          children.splice(deleteIndex, 1);
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
        selectNodeId,
        previewNodeData,
        appendChildNode,
        appendRootChildNode,
        appendSiblingNode,
        removeNode,
        editNode,
        setSelectNodeId,
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
