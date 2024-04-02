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

export const findNode = (data: INode, id: string): INode | undefined => {
  if (data.id === id) return data;
  if (!data.children) return;
  for (const child of data.children) {
    const node = findNode(child, id);
    if (node) return node;
  }
};

export const findNodeParent = (
  data: INode,
  id: string
): { parentNode: INode; curNodeIndex: number } | undefined => {
  if (data.id === id || !data.children) return;
  const index = data.children.findIndex((child) => child.id === id);
  if (index !== -1) return { parentNode: data, curNodeIndex: index };
  for (const child of data.children) {
    const res = findNodeParent(child, id);
    if (res) return res;
  }
};
