import { FC, ReactNode, forwardRef, useState } from "react";
import { TPreviewVisible } from "../../types";
import PreviewNode from "../PreviewNode";
import { NODE_MARGIN_X, NODE_MARGIN_Y } from "../../constants";
import NodeInput from "../NodeInput";

interface IMindMapNodeProps {
  id: string;
  label: ReactNode;
  selectNodeId: string;
  previewVisible: TPreviewVisible;
  editNode: (nodeId: string, value: string) => void;
}

const selectedCls = "tw-border-[3px] tw-border-solid tw-border-[#1456f0]";
const unSelectedCls = "tw-border-[3px] tw-border-solid tw-border-[white]";

const MindMapNode: FC<IMindMapNodeProps> = forwardRef<
  HTMLDivElement,
  IMindMapNodeProps
>(({ id, label, selectNodeId, previewVisible, editNode }, ref) => {
  const [editing, setEditing] = useState<boolean>(false);

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleInputEnter = (value: string) => {
    console.log("*** value", value);
    editNode(id, value);
    setEditing(false);
  };

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
      {editing ? (
        <NodeInput label={label} onSubmit={handleInputEnter} />
      ) : (
        <span onDoubleClick={handleDoubleClick}>{label}</span>
      )}
      {previewVisible === "bottom" && (
        <PreviewNode style={{ bottom: "-100%", left: 0 }} />
      )}
    </div>
  );
});

export default MindMapNode;
