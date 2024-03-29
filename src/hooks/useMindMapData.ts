import { useCallback, useState } from "react";
import { INode } from "../types";
import { findNode, transformData } from "../helper";
import { nanoid } from "nanoid";
import { cloneDeep } from "lodash";

const useMindMapData = (sourceData: INode) => {
  const [data, setData] = useState<INode>(transformData(sourceData));
  const [selectedNode, setSelectedNode] = useState<INode>();

  const appendChildNode = useCallback((selectNode: INode | undefined) => {
    if (!selectNode) return;
    setData((data) => {
      const newData = cloneDeep(data);
      const node = findNode(newData, selectNode.id);
      if (!node) return data;
      if (!node.children) {
        node.children = [];
      }
      node.children.push({
        id: nanoid(),
        label: nanoid(),
        children: [],
      });
      return newData;
    });
  }, []);

  return { data, appendChildNode, selectedNode, setSelectedNode };
};

export default useMindMapData;
