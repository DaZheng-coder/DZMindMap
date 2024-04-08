import { FC, ReactNode, forwardRef } from "react";
import { TPreviewVisible } from "../../types";
import PreviewNode from "../PreviewNode";

interface IMindMapNodeProps {
  id: string;
  label: ReactNode;
  selectedNodeId: string;
  previewVisible: TPreviewVisible;
}

const selectedCls = "tw-border-[3px] tw-border-solid tw-border-[#1456f0]";
const unSelectedCls = "tw-border-[3px] tw-border-solid tw-border-[white]";
const marginX = 30;
const marginY = 20;
const translateY = marginY / 2 - 1;

const MindMapNode: FC<IMindMapNodeProps> = forwardRef<
  HTMLDivElement,
  IMindMapNodeProps
>(({ id, label, selectedNodeId, previewVisible }, ref) => {
  return (
    <div
      id={id}
      ref={ref}
      style={{ margin: `${marginY}px ${marginX}px` }}
      onMouseDown={(e) => e.stopPropagation()}
      className={`${
        selectedNodeId === id ? selectedCls : unSelectedCls
      } tw-relative tw-py-[6px] tw-px-[10px] tw-rounded-[6px] tw-bg-[#6d7175] tw-text-white`}
    >
      {previewVisible === "top" && (
        <PreviewNode
          className={`tw-bottom-[100%] tw-translate-y-[-${translateY}px]`}
        />
      )}
      <span>{label}</span>
      {previewVisible === "bottom" && (
        <PreviewNode
          className={`tw-top-[100%]  tw-translate-y-[${translateY}px]`}
        />
      )}
    </div>
  );
});

export default MindMapNode;
