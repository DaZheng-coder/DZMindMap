import { FC, useCallback, useEffect, useRef, useState } from "react";
import MindMapNode from "../MindMapNode";
import { INode, TPreviewVisible } from "../../types";
import { DropTargetMonitor, XYCoord, useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import PreviewNode from "../PreviewNode";

interface IMindMapBlockProps {
  data: INode;
  selectedNode: INode | undefined;
  setSelectedNode: (node: INode) => void;
  isRoot?: boolean;
  moveNodeBlock: (
    selectedNode: INode,
    movingNode: INode,
    pos: TPreviewVisible
  ) => void;
}

const MindMapBlock: FC<IMindMapBlockProps> = ({
  data,
  selectedNode,
  setSelectedNode,
  isRoot = false,
  moveNodeBlock,
}) => {
  const blockRef = useRef<HTMLDivElement | null>(null);
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [previewVisible, setPreviewVisible] = useState<TPreviewVisible>(false);

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: "MindMap",
    item: { data, draggingDomRef: nodeRef },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => !isRoot,
  }));

  const getPreInsertPos = (draggingOffset: XYCoord | null) => {
    const rect = document.getElementById(data.id)?.getBoundingClientRect();
    if (rect && draggingOffset) {
      const centerX = (rect.width / 3) * 2 + rect.left;
      const centerY = rect.height / 2 + rect.top;
      if (draggingOffset.x <= centerX) {
        return draggingOffset.y <= centerY ? "top" : "bottom";
      } else {
        return "lastChild";
      }
    } else {
      return false;
    }
  };

  const handleLeave = () => {
    setPreviewVisible(false);
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "MindMap",
    collect: (monitor: DropTargetMonitor) => {
      const draggingNode = monitor.getItem()?.data;
      return {
        isOver:
          draggingNode?.id === data.id
            ? undefined
            : monitor.isOver({ shallow: true }),
      };
    },
    hover: (item, monitor) => {
      const isOver = monitor.isOver({ shallow: true });
      const draggingNode = item.data;
      if (isOver && draggingNode.id !== data.id) {
        const draggingOffset = monitor.getClientOffset();
        const pos = getPreInsertPos(draggingOffset);
        setPreviewVisible(pos);
      }
    },
    drop: (item, monitor) => {
      const draggingNode = item.data;
      const isOver = monitor.isOver({ shallow: true });
      if (isOver) {
        const pos = getPreInsertPos(monitor.getClientOffset());
        moveNodeBlock(data, draggingNode, pos);
      }
    },
  }));

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  useEffect(() => {
    if (!isOver) {
      handleLeave();
    }
  }, [isOver]);

  const handleClickNode = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedNode(data);
    },
    [data, setSelectedNode]
  );

  drag(nodeRef);
  drop(blockRef);

  return (
    <div
      ref={blockRef}
      className={`tw-flex tw-z-1 ${
        isDragging ? "tw-opacity-60" : "tw-opacity-100"
      }`}
    >
      <div
        className={`tw-relative tw-flex hover:tw-cursor-pointer tw-items-center `}
        onClick={handleClickNode}
      >
        <MindMapNode
          ref={nodeRef}
          key={data.id}
          selectId={selectedNode?.id || ""}
          id={data.id}
          label={data.label}
          previewVisible={previewVisible}
        />
      </div>
      <div className="tw-flex tw-flex-col tw-relative">
        {(data.children || []).map((child) => (
          <MindMapBlock
            key={child.id}
            data={child}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            moveNodeBlock={moveNodeBlock}
          />
        ))}
        {previewVisible === "lastChild" && (
          <PreviewNode className=" tw-top-[33%]" />
        )}
      </div>
    </div>
  );
};

export default MindMapBlock;
