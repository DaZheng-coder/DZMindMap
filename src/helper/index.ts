import { nanoid } from "nanoid";
import {
  ICoord,
  IFindItem,
  ILineCoord,
  INode,
  IRootNode,
  TChildrenKey,
  TDir,
} from "../types";
import { uniqueId } from "lodash";
import { getRect } from "../utils";
import { XYCoord } from "react-dnd";
import {
  MIND_MAP_CONTAINER_ID,
  NODE_MARGIN_X,
  NODE_MARGIN_Y,
} from "../constants";

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
    if (rightCoord) {
      lineCoords.push({ start: leftCoord, end: rightCoord, dir: "left" });
    }
  };
  const toRight = (child: INode) => {
    const { leftCoord } = initLineCoords(child, originCoord, lineCoords);
    if (leftCoord) lineCoords.push({ start: rightCoord, end: leftCoord });
  };

  const reverseShrink = (mindMapData as IRootNode).reverseShrink;
  if (!(typeof reverseShrink === "boolean" && reverseShrink)) {
    (mindMapData as IRootNode).reverseChildren?.forEach(toLeft);
  }
  if (!(typeof shrink === "boolean" && shrink)) {
    children?.forEach(dir === "left" ? toLeft : toRight);
  }
  return { rightCoord, leftCoord };
};

export const findNodesByIds = (
  mindMapData: INode,
  nodeIds: (string | undefined)[]
): IFindItem[] => {
  const n = nodeIds.length;
  const res = new Array(n);
  let finished = 0;
  const find = (
    node: INode,
    i: number,
    inChildrenKey: TChildrenKey = "children",
    parentNode?: INode
  ) => {
    if (finished === n) return;
    const resIndex = nodeIds.findIndex((id) => node.id === id);
    if (resIndex !== -1) {
      res[resIndex] = { node, parentNode, index: i, inChildrenKey };
      finished++;
    }
    if ((node as IRootNode).reverseChildren) {
      for (let i = 0; i < (node as IRootNode).reverseChildren.length; i++) {
        find(
          (node as IRootNode).reverseChildren[i],
          i,
          "reverseChildren",
          node
        );
      }
    }
    for (let i = 0; i < node.children.length; i++) {
      find(node.children[i], i, "children", node);
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

export const getLeftInsertPos = (
  node: INode,
  draggingOffset: XYCoord | null,
  nodeRect?: DOMRect
) => {
  const rect = nodeRect || getRect(node.id);
  if (rect && draggingOffset) {
    const centerX = (rect.width / 4) * 1 + rect.left;
    const centerY = rect.height / 2 + rect.top;
    if (draggingOffset.x >= centerX) {
      return draggingOffset.y <= centerY ? "top" : "bottom";
    } else {
      return "insertChild";
    }
  } else {
    return false;
  }
};

export const getRightInsertPos = (
  node: INode,
  draggingOffset: XYCoord | null,
  nodeRect?: DOMRect
) => {
  const rect = nodeRect || getRect(node.id);
  if (rect && draggingOffset) {
    const centerX = (rect.width / 4) * 3 + rect.left;
    const centerY = rect.height / 2 + rect.top;
    if (draggingOffset.x <= centerX) {
      return draggingOffset.y <= centerY ? "top" : "bottom";
    } else {
      return "insertChild";
    }
  } else {
    return false;
  }
};

export const getRootInsertPos = (
  node: INode,
  draggingOffset: XYCoord | null,
  nodeRect?: DOMRect
) => {
  const rect = nodeRect || getRect(node.id);
  if (rect && draggingOffset) {
    const centerX = rect.width / 2 + rect.left;
    return draggingOffset.x > centerX ? "right" : "left";
  } else {
    return false;
  }
};

export const getPreviewData = ({
  node,
  draggingOffset,
  isRoot,
  dir,
  parentNodeId,
  prevNodeId,
  nextNodeId,
}: {
  node: INode | IRootNode;
  draggingOffset: XYCoord | null;
  isRoot: boolean;
  dir: TDir;
  parentNodeId?: string;
  prevNodeId?: string;
  nextNodeId?: string;
}): ILineCoord | undefined => {
  const originRect = getRect(MIND_MAP_CONTAINER_ID);
  const selectRect = getRect(node.id);
  const offset = NODE_MARGIN_X * 2;
  if (!selectRect || !originRect) return;
  if (isRoot) {
    // 选择根节点的情况
    const dir = getRootInsertPos(node, draggingOffset, selectRect);
    if (!dir) return;
    const children =
      dir === "right" ? node.children : (node as IRootNode).reverseChildren;
    const start = {
      x: selectRect[dir] - originRect.left,
      y: selectRect.bottom - originRect.top - selectRect.height / 2,
    };
    const end = {
      x: start.x + (dir === "right" ? offset : -offset),
      y: children.length ? start.y + selectRect.height : start.y,
    };
    return { start, end, dir };
  } else {
    // 选择非根节点的情况
    const pos = {
      left: getLeftInsertPos,
      right: getRightInsertPos,
    }[dir](node, draggingOffset, selectRect);
    if (!pos) return;
    const startRect =
      pos === "insertChild" ? selectRect : getRect(parentNodeId);
    if (!startRect) return;
    const start = {
      x: startRect[dir] - originRect.left,
      y: startRect.bottom - originRect.top - startRect.height / 2,
    };
    if (pos === "insertChild") {
      // 插入子节点的情况
      const end = {
        x: start.x + (dir === "right" ? offset : -offset),
        y: node.children.length ? start.y + startRect.height : start.y,
      };
      return { start, end, dir };
    } else {
      // 插入同级节点的情况
      const siblingId = pos === "top" ? prevNodeId : nextNodeId;
      const endDir = dir === "right" ? "left" : "right";
      const rePos = pos === "top" ? "bottom" : "top";
      let end: ICoord;
      if (siblingId) {
        // 边缘有兄弟节点的情况
        const siblingRect = getRect(siblingId);
        if (!siblingRect) return;
        const baseRect = pos === "top" ? siblingRect : selectRect;
        end = {
          x: selectRect[endDir] - originRect.left,
          y:
            baseRect.bottom -
            originRect.top +
            Math.abs(selectRect[pos] - siblingRect[rePos]) / 2,
        };
      } else {
        // 边缘无兄弟节点的情况
        end = {
          x: selectRect[endDir] - originRect.left,
          y:
            selectRect[pos] -
            originRect.top +
            (pos === "top" ? -NODE_MARGIN_Y : NODE_MARGIN_Y),
        };
      }
      return { start, end, dir };
    }
  }
};
