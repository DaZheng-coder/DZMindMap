import { nanoid } from "nanoid";
import { ICoord, ILineCoord, INode, IRootNode, TDir } from "../types";
import { uniqueId } from "lodash";
import { getRect } from "../utils";

/**
 * 初始化所有连接线的起始点、终止点坐标
 * @param mindMapData 思维导图总体数据
 * @param originCoord 画布原点坐标
 * @param lineCoords 存放结果数组
 * @returns 结束点坐标
 */
export const initLineCoords = (
  mindMapData: IRootNode | INode,
  originCoord: ICoord,
  lineCoords: ILineCoord[] = [],
  dir: TDir = "right"
): { rightCoord: ICoord | undefined; leftCoord: ICoord | undefined } => {
  const { id, children, shrink } = mindMapData;
  const startRect = getRect(id);
  if (!startRect) return { leftCoord: undefined, rightCoord: undefined };

  const y = startRect.bottom - originCoord.y - startRect.height / 2;
  const rightCoord = { x: startRect.right - originCoord.x, y };
  const leftCoord = { x: startRect.left - originCoord.x, y };
  const toLeft = (child: INode) => {
    const { rightCoord } = initLineCoords(
      child,
      originCoord,
      lineCoords,
      "left"
    );
    if (rightCoord)
      lineCoords.push({ start: leftCoord, end: rightCoord, turn: "end" });
  };
  const toRight = (child: INode) => {
    const { leftCoord } = initLineCoords(child, originCoord, lineCoords);
    if (leftCoord) lineCoords.push({ start: rightCoord, end: leftCoord });
  };

  const reShrink = (mindMapData as IRootNode).reShrink;
  if (!(typeof reShrink === "boolean" && reShrink)) {
    (mindMapData as IRootNode).reChildren?.forEach(toLeft);
  }
  if (!(typeof shrink === "boolean" && shrink)) {
    children?.forEach(dir === "left" ? toLeft : toRight);
  }
  return { rightCoord, leftCoord };
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
): {
  node: IRootNode | INode;
  parentNode: INode;
  index: number;
  isReChild: boolean;
}[] => {
  const n = nodeIds.length;
  const res = new Array(n);
  let finished = 0;
  const find = (
    node: INode,
    i: number,
    parentNode?: INode,
    isReChild?: boolean
  ) => {
    if (finished === n) return;
    const resIndex = nodeIds.findIndex((id) => node.id === id);
    if (resIndex !== -1) {
      res[resIndex] = { node, parentNode, index: i, isReChild };
      finished++;
    }
    if ((node as IRootNode).reChildren) {
      for (let i = 0; i < (node as IRootNode).reChildren.length; i++) {
        find((node as IRootNode).reChildren[i], i, node, true);
      }
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
    label: "未命名节点" + uniqueId(),
    children: [],
    shrink: false,
  };
};
