import { FC, ReactNode, forwardRef } from "react";
import { TPreviewVisible } from "../../types";

interface IMindMapNodeProps {
  id: string;
  label: ReactNode;
  selectId: string;
  previewVisible: TPreviewVisible;
}

const selectedCls = "tw-border-[3px] tw-border-solid tw-border-[#1456f0]";
const unSelectedCls = "tw-border-[3px] tw-border-solid tw-border-[white]";

const MindMapNode: FC<IMindMapNodeProps> = forwardRef<
  HTMLDivElement,
  IMindMapNodeProps
>(({ id, label, selectId, previewVisible }, ref) => {
  return (
    <div
      id={id}
      ref={ref}
      style={{ margin: "12px 20px" }}
      onMouseDown={(e) => e.stopPropagation()}
      className={`${
        selectId === id ? selectedCls : unSelectedCls
      } tw-relative tw-py-[6px] tw-px-[10px] tw-rounded-[6px] tw-bg-[#6d7175] tw-text-white`}
    >
      {previewVisible === "top" && (
        <div className="tw-absolute tw-bottom-[100%] tw-text-black">
          preview
        </div>
      )}
      <span>{label}</span>
      {previewVisible === "bottom" && (
        <div className="tw-absolute tw-top-[100%] tw-text-black">preview</div>
      )}
    </div>
  );
});

export default MindMapNode;
