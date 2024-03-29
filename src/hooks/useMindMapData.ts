import { useCallback, useState } from "react";
import { INode } from "../types";
import { findNode } from "../helper";
import { nanoid } from "nanoid";
import { cloneDeep } from "lodash";

const useMindMapData = (sourceData: INode) => {
  const [data, setData] = useState<INode>(sourceData);
  const [selectedId, setSelectedId] = useState<string>("");
  const appendChildNode = useCallback((parentId: string) => {
    setData((data) => {
      const newData = cloneDeep(data);
      const node = findNode(newData, parentId);
      node?.children?.push({
        id: nanoid(),
        label: "empty",
        children: [],
      });
      return newData;
    });
  }, []);

  return { data, appendChildNode, selectedId, setSelectedId };
};

export default useMindMapData;
