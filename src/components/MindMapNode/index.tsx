import { FC, ReactNode, forwardRef, useCallback, useContext } from "react";
import { TPreviewVisible } from "../../types";
import PreviewNode from "../PreviewNode";
import { NODE_MARGIN_X, NODE_MARGIN_Y } from "../../constants";
import { MindMapContext } from "../../contexts/MindMapProvider";

interface IMindMapNodeProps {
  id: string;
  label: ReactNode;
  previewVisible: TPreviewVisible;
  editNode: (nodeId: string, value: string) => void;
}

const selectedCls = "tw-border-[3px] tw-border-solid tw-border-[#1456f0]";
const unSelectedCls = "tw-border-[3px] tw-border-solid tw-border-[white]";

const MindMapNode: FC<IMindMapNodeProps> = forwardRef<
  HTMLDivElement,
  IMindMapNodeProps
>(({ id, label, previewVisible }, ref) => {
  const { selectNodeId, setSelectNodeId } = useContext(MindMapContext)!;

  const handleClickNode = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectNodeId(id);
    },
    [id, setSelectNodeId]
  );

  return (
    <div
      id={id}
      ref={ref}
      style={{ margin: `${NODE_MARGIN_Y}px ${NODE_MARGIN_X}px` }}
      onMouseDown={(e) => e.stopPropagation()}
      className={`${
        selectNodeId === id ? selectedCls : unSelectedCls
      } tw-relative tw-py-[6px] tw-px-[10px] tw-rounded-[6px] tw-bg-[#6d7175] tw-text-white`}
      onClick={handleClickNode}
    >
      <span>{label}</span>
    </div>
  );
});

export default MindMapNode;
