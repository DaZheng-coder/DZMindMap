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
  children?.forEach((child) => {
    const endCoord = initLineCoords(child, originCoord, ILineCoords);
    if (endCoord) ILineCoords.push({ start: startCoord, end: endCoord });
  });

  return startCoord;
};

export const findNode = (data: INode, id: string): INode | undefined => {
  if (data.id === id) return data;
  if (!data.children) return;
  for (const child of data.children) {
    const node = findNode(child, id);
    if (node) return node;
  }
};
