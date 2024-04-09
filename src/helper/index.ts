import { nanoid } from "nanoid";
import { ICoord, ILineCoord, INode } from "../types";

export const initLineCoords = (
  data: INode,
  originCoord: ICoord,
  ILineCoords: ILineCoord[] = []
): ICoord | undefined => {
  const { id, children } = data;
  const startRect = document.getElementById(id)?.getBoundingClientRect();
  if (!startRect) return;
  const y = startRect.bottom - originCoord.y - startRect.height / 2;
  const startCoord = { x: startRect.right - originCoord.x, y };
  const endCoord = { x: startRect.left - originCoord.x, y };
  children?.forEach((child) => {
    const endCoord = initLineCoords(child, originCoord, ILineCoords);
    if (endCoord) ILineCoords.push({ start: startCoord, end: endCoord });
  });

  return endCoord;
};


export const findNodesByIds = (
  mindMapData: INode,
  nodeIds: (string | undefined)[]
): { node: INode; parentNode: INode; index: number }[] => {
  const n = nodeIds.length;
  const res = new Array(n);
  let finished = 0;
  const find = (node: INode, i: number, parentNode?: INode) => {
    if (finished === n) return;
    const resIndex = nodeIds.findIndex((id) => node.id === id);
    if (resIndex !== -1) {
      res[resIndex] = { node, parentNode, index: i };
      finished++;
    }
    for (let i = 0; i < node.children.length; i++) {
      find(node.children[i], i, node);
    }
  };
  find(mindMapData, -1);
  return res;
};

export const getNewNode = () => {
  const id = nanoid();
  return {
    id,
    label: id,
    children: [],
  };
};
