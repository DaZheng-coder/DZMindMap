import { ReactNode } from "react";

export type TDir = "right" | "left";

export interface INode {
  id: string;
  label: ReactNode;
  children: INode[];
  shrink?: boolean; // 收缩子节点
}

export interface IRootNode extends INode {
  reChildren: INode[];
  reShrink?: boolean;
}

export interface ICoord {
  x: number;
  y: number;
}

export interface ILineCoord {
  start: ICoord;
  end: ICoord;
  turn?: "start" | "end";
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
