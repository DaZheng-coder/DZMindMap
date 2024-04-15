import { FC, ReactNode, forwardRef, useCallback, useContext } from "react";
import { NODE_MARGIN_X, NODE_MARGIN_Y } from "../../constants";
import { MindMapContext } from "../../contexts/MindMapProvider";
import "./index.less";

interface IMindMapNodeProps {
  id: string;
  label: ReactNode;
  editNode: (nodeId: string, value: string) => void;
}

const selectedCls = "tw-border-[3px] tw-border-solid tw-border-[#1456f0]";
const unSelectedCls = "tw-border-[3px] tw-border-solid tw-border-[white]";

const MindMapNode: FC<IMindMapNodeProps> = forwardRef<
  HTMLDivElement,
  IMindMapNodeProps
>(({ id, label }, ref) => {
  const { selectNodeId, setSelectNodeId } = useContext(MindMapContext)!;

  const handleClickNode = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectNodeId(id);
    },
    [id, setSelectNodeId]
  );

  const handleClickShrink = useCallback(() => {
    console.log("*** ")
  }, []);

  return (
    <div
      id={id}
      ref={ref}
      style={{ margin: `${NODE_MARGIN_Y}px ${NODE_MARGIN_X}px` }}
      onMouseDown={(e) => e.stopPropagation()}
      className={`mind_map_node ${
        selectNodeId === id ? selectedCls : unSelectedCls
      } tw-relative tw-py-[6px] tw-px-[14px] tw-rounded-[6px] tw-bg-[#6d7175] tw-text-white`}
      onClick={handleClickNode}
    >
      <span>{label}</span>
      <div
        onClick={handleClickShrink}
        className="mind_map_node_shrink tw-hidden tw-text-[22px] tw-leading-[16px] tw-w-[20px] tw-bg-[skyblue] tw-justify-center tw-h-[20px] tw-rounded-[50%] tw-absolute tw-right-0 tw-top-[50%] tw-translate-x-[50%] tw-translate-y-[-50%]"
      >
        +
      </div>
    </div>
  );
});

export default MindMapNode;
