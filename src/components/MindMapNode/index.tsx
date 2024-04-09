import { FC, ReactNode, forwardRef } from "react";
import { TPreviewVisible } from "../../types";
import PreviewNode from "../PreviewNode";
import { NODE_MARGIN_X, NODE_MARGIN_Y } from "../../constants";

interface IMindMapNodeProps {
  id: string;
  label: ReactNode;
  selectNodeId: string;
  previewVisible: TPreviewVisible;
}

const selectedCls = "tw-border-[3px] tw-border-solid tw-border-[#1456f0]";
const unSelectedCls = "tw-border-[3px] tw-border-solid tw-border-[white]";

const MindMapNode: FC<IMindMapNodeProps> = forwardRef<
  HTMLDivElement,
  IMindMapNodeProps
>(({ id, label, selectNodeId, previewVisible }, ref) => {
  return (
    <div
      id={id}
      ref={ref}
      style={{ margin: `${NODE_MARGIN_Y}px ${NODE_MARGIN_X}px` }}
      onMouseDown={(e) => e.stopPropagation()}
      className={`${
        selectNodeId === id ? selectedCls : unSelectedCls
      } tw-relative tw-py-[6px] tw-px-[10px] tw-rounded-[6px] tw-bg-[#6d7175] tw-text-white`}
    >
      {previewVisible === "top" && (
        <PreviewNode style={{ top: "-100%", left: 0 }} />
      )}
      <span>{label}</span>
      {previewVisible === "bottom" && (
        <PreviewNode style={{ bottom: "-100%", left: 0 }} />
      )}
    </div>
  );
});

export default MindMapNode;
