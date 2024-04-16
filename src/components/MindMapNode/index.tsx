import {
  FC,
  ReactNode,
  forwardRef,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { NODE_MARGIN_X, NODE_MARGIN_Y } from "../../constants";
import { MindMapContext } from "../../contexts/MindMapProvider";

interface IMindMapNodeProps {
  id: string;
  label: ReactNode;
  editNode: (nodeId: string, value: string) => void;
  shrink?: boolean;
  shrinkBtnVisible: boolean;
}

const selectedCls = "tw-border-[3px] tw-border-solid tw-border-[#1456f0]";
const unSelectedCls = "tw-border-[3px] tw-border-solid tw-border-[white]";

const MindMapNode: FC<IMindMapNodeProps> = forwardRef<
  HTMLDivElement,
  IMindMapNodeProps
>(({ id, label, shrinkBtnVisible, shrink = false }, ref) => {
  const { selectNodeId, setSelectNodeId, changeNodeShrink, updateNodeLabel } =
    useContext(MindMapContext)!;
  const [editing, setEditing] = useState<boolean>(false);
  const [canEdit, setCanEdit] = useState<boolean>(false);
  const [editorSize, setEditorSize] = useState<{ w: number; h: number }>({
    w: 0,
    h: 0,
  });

  const editorRef = useRef<HTMLDivElement>(null);

  const handleClickNode = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectNodeId(id);
    },
    [id, setSelectNodeId]
  );

  const handleClickShrink = useCallback(() => {
    changeNodeShrink(id);
  }, [id, changeNodeShrink]);

  const handleEdit = useCallback(() => {
    const rect = editorRef.current?.getBoundingClientRect();
    if (rect) {
      setEditorSize({ w: rect.width, h: rect.height });
    }
    setCanEdit(true);
  }, []);

  const handleBlur = useCallback(
    (e) => {
      if (editing) {
        updateNodeLabel(id, e.target.textContent);
        setEditorSize({ w: 0, h: 0 });
      }
      setCanEdit(false);
      setEditing(false);
    },
    [id, editing, updateNodeLabel]
  );

  const handleMouseLeave = useCallback(() => {
    if (canEdit && !editing) {
      setCanEdit(false);
    }
  }, [canEdit, editing]);

  const handleDbClick = useCallback(() => {
    setEditing(true);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <div
      id={id}
      ref={ref}
      style={{ margin: `${NODE_MARGIN_Y}px ${NODE_MARGIN_X}px` }}
      onMouseDown={(e) => e.stopPropagation()}
      className={`${
        selectNodeId === id ? selectedCls : unSelectedCls
      } tw-relative tw-py-[6px] tw-px-[14px] tw-rounded-[6px] tw-bg-[#6d7175] tw-text-white`}
      onClick={handleClickNode}
    >
      <div
        ref={editorRef}
        onClick={handleEdit}
        onBlur={handleBlur}
        onMouseLeave={handleMouseLeave}
        onDoubleClick={handleDbClick}
        contentEditable={canEdit}
        suppressContentEditableWarning
        className="tw-outline-none tw-border-none"
        onKeyDown={handleKeyDown}
        style={{
          minWidth: editorSize.w || "auto",
          minHeight: editorSize.h || "auto",
        }}
      >
        {label}
      </div>
      <div
        style={{ display: shrinkBtnVisible ? "flex" : "none" }}
        onClick={handleClickShrink}
        className="tw-hidden tw-text-[22px] tw-leading-[16px] tw-w-[20px] tw-bg-[skyblue] tw-justify-center tw-h-[20px] tw-rounded-[50%] tw-absolute tw-right-0 tw-top-[50%] tw-translate-x-[50%] tw-translate-y-[-50%]"
      >
        {shrink ? "+" : "-"}
      </div>
    </div>
  );
});
export default MindMapNode;
