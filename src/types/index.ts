import { ReactNode } from "react";

export interface INode {
  id: string;
  label: ReactNode;
  children: INode[];
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

export type TPreviewVisible = false | "top" | "bottom" | "lastChild";
