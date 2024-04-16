import {
  FC,
  MutableRefObject,
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
  const [preEditorSize, setPreEditorSize] = useState<{ w: number; h: number }>({
    w: 0,
    h: 0,
  });
  const [preWrapSize, setPreWrapSize] = useState<{ w: number; h: number }>({
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
    const wrapRect = (
      ref as MutableRefObject<HTMLDivElement | null>
    ).current?.getBoundingClientRect();
    if (rect && wrapRect) {
      setPreEditorSize({ w: rect.width, h: rect.height });
      setPreWrapSize({ w: wrapRect.width, h: wrapRect.height });
    }
    setCanEdit(true);
  }, [ref]);

  const handleBlur = useCallback(
    (e) => {
      if (editing) {
        updateNodeLabel(id, editorRef.current?.innerHTML);
        setPreEditorSize({ w: 0, h: 0 });
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
      style={{
        margin: `${NODE_MARGIN_Y}px ${NODE_MARGIN_X}px`,
        width: editing ? preWrapSize.w : "auto",
        height: editing ? preWrapSize.h : "auto",
      }}
    >
      <div
        id={id}
        ref={ref}
        style={editing ? { position: "absolute", zIndex: "999" } : {}}
        onMouseDown={(e) => e.stopPropagation()}
        className={`${
          selectNodeId === id ? selectedCls : unSelectedCls
        } tw-relative tw-py-[6px] tw-px-[14px] tw-rounded-[6px] tw-bg-[#6d7175] tw-text-white`}
        onClick={handleClickNode}
      >
        <div
          ref={editorRef}
          style={{
            minWidth: preEditorSize.w || "auto",
            minHeight: preEditorSize.h || "auto",
          }}
          dangerouslySetInnerHTML={{ __html: label }}
          contentEditable={canEdit}
          suppressContentEditableWarning
          onClick={handleEdit}
          onBlur={handleBlur}
          onMouseLeave={handleMouseLeave}
          onDoubleClick={handleDbClick}
          onKeyDown={handleKeyDown}
          className="tw-whitespace-nowrap tw-outline-none tw-border-none"
        />
        <div
          style={{ display: shrinkBtnVisible ? "flex" : "none" }}
          onClick={handleClickShrink}
          className="tw-hidden tw-text-[22px] tw-leading-[16px] tw-w-[20px] tw-bg-[skyblue] tw-justify-center tw-h-[20px] tw-rounded-[50%] tw-absolute tw-right-0 tw-top-[50%] tw-translate-x-[50%] tw-translate-y-[-50%]"
        >
          {shrink ? "+" : "-"}
        </div>
      </div>
    </div>
  );
});
export default MindMapNode;
