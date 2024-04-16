import { nanoid } from "nanoid";
import { ICoord, ILineCoord, INode } from "../types";

/**
 * 初始化所有连接线的起始点、终止点坐标
 * @param mindMapData 思维导图总体数据
 * @param originCoord 画布原点坐标
 * @param lineCoords 存放结果数组
 * @returns 结束点坐标
 */
export const initLineCoords = (
  mindMapData: INode,
  originCoord: ICoord,
  lineCoords: ILineCoord[] = []
): ICoord | undefined => {
  const { id, children, shrink } = mindMapData;
  const startRect = document.getElementById(id)?.getBoundingClientRect();
  if (!startRect) return;
  const y = startRect.bottom - originCoord.y - startRect.height / 2;
  const startCoord = { x: startRect.right - originCoord.x, y };
  const endCoord = { x: startRect.left - originCoord.x, y };
  const isShrink = typeof shrink === "boolean" && shrink;
  if (isShrink) return endCoord;
  children?.forEach((child) => {
    const endCoord = initLineCoords(child, originCoord, lineCoords);
    if (endCoord) lineCoords.push({ start: startCoord, end: endCoord });
  });
  return endCoord;
};

/**
 * 通过id寻找节点们
 * @param mindMapData 思维导图总体数据
 * @param nodeIds 节点id数组
 * @returns 节点本身、父节点、在父节点里的索引
 */
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
    shrink: false,
  };
};
