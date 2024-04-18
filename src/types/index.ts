import { ReactNode } from "react";

export type TDir = "right" | "left";

export interface INode {
  id: string;
  label: ReactNode;
  children: INode[];
  shrink?: boolean; // 收缩子节点
}

export interface IRootNode extends INode {
  reverseChildren: INode[];
  reverseShrink?: boolean;
}

export interface ICoord {
  x: number;
  y: number;
}

export interface ILineCoord {
  start: ICoord;
  end: ICoord;
  dir?: "right" | "left";
}

export interface IDraggingItem {
  draggingNode: INode;
  draggingDomRef: React.MutableRefObject<HTMLDivElement | null>;
}

export interface IPreviewNodeData {
  visible: boolean;
  lineCoord?: ILineCoord;
  transform?: string;
}

export interface IFindItem {
  node: IRootNode | INode;
  parentNode: INode;
  index: number;
  inChildrenKey: TChildrenKey;
}

export type TChildrenKey = "children" | "reverseChildren";
