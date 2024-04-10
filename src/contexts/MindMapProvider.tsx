import React, { FC, ReactNode, createContext, useState } from "react";

import { INode } from "../types";

interface IMindMapProviderProps {
  initData: INode;
  children: ReactNode;
}

export const MindMapContext = createContext<{
  mindMapData: INode;
  setMindMapData: (data: INode) => void;
  selectNodeId: string | undefined;
  setSelectNodeId: (nodeId: string | undefined) => void;
} | null>(null);

const MindMapProvider: FC<IMindMapProviderProps> = ({ initData, children }) => {
  const [mindMapData, setMindMapData] = useState<INode>(initData);
  const [selectNodeId, setSelectNodeId] = useState<string>();
  return (
    <MindMapContext.Provider
      value={{ mindMapData, setMindMapData, selectNodeId, setSelectNodeId }}
    >
      {children}
    </MindMapContext.Provider>
  );
};

export default MindMapProvider;
