import { FC, useCallback, useEffect, useRef, useState } from "react";
import MindMapNode from "../MindMapNode";
import { INode, TPreviewVisible } from "../../types";
import { DropTargetMonitor, XYCoord, useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import PreviewNode from "../PreviewNode";
import { NODE_MARGIN_Y } from "../../constants";

interface IMindMapBlockProps {
  node: INode;
  parentNodeId?: string;
  selectNodeId: string | undefined;
  setSelectNodeId: (nodeId: string) => void;
  isRoot?: boolean;
  appendChildNode: (
    selectNodeId: string | undefined,
    appendingNodeId?: string | undefined
  ) => void;
  appendSiblingNode: (
    selectNodeId: string | undefined,
    insert: "after" | "before",
    appendingNodeId?: string | undefined
  ) => void;
  drawLine: (startNodeId: string) => void;
}

const MindMapBlock: FC<IMindMapBlockProps> = ({
  node,
  parentNodeId,
  selectNodeId,
  setSelectNodeId,
  isRoot = false,
  appendChildNode,
  appendSiblingNode,
  drawLine,
}) => {
  const blockRef = useRef<HTMLDivElement | null>(null);
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [previewVisible, setPreviewVisible] = useState<TPreviewVisible>(false);

  const getPreInsertPos = (
    draggingOffset: XYCoord | null,
    isRoot: boolean = false
  ) => {
    const rect = document.getElementById(node.id)?.getBoundingClientRect();
    if (rect && draggingOffset) {
      const centerX = (rect.width / 3) * 2 + rect.left;
      const centerY = rect.height / 2 + rect.top;
      if (draggingOffset.x <= centerX) {
        if (isRoot) {
          return "lastChild";
        } else {
          return draggingOffset.y <= centerY ? "top" : "bottom";
        }
      } else {
        return "lastChild";
      }
    } else {
      return false;
    }
  };

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: "MindMap",
    item: { draggingNode: node, draggingDomRef: nodeRef },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => !isRoot,
  }));

  const handleLeave = () => {
    setPreviewVisible(false);
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "MindMap",
    collect: (monitor: DropTargetMonitor) => {
      const draggingNode = monitor.getItem()?.draggingNode;
      return {
        isOver:
          draggingNode?.id === node.id
            ? undefined
            : monitor.isOver({ shallow: true }),
      };
    },
    hover: (item, monitor) => {
      const isOver = monitor.isOver({ shallow: true });
      const draggingNode = item.draggingNode;
      if (isOver && draggingNode.id !== node.id) {
        const draggingOffset = monitor.getClientOffset();
        const pos = getPreInsertPos(draggingOffset, isRoot);
        drawLine(pos === "lastChild" ? node.id : parentNodeId || "");
        setPreviewVisible(pos);
      }
    },
    drop: (item, monitor) => {
      const draggingNode = item.draggingNode;
      const isOver = monitor.isOver({ shallow: true });
      if (isOver) {
        const pos = getPreInsertPos(monitor.getClientOffset(), isRoot);
        if (pos === "lastChild") {
          appendChildNode(node.id, draggingNode.id);
        } else {
          appendSiblingNode(
            node.id,
            pos === "top" ? "before" : "after",
            draggingNode.id
          );
        }
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
      setSelectNodeId(node.id);
    },
    [node, setSelectNodeId]
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
          key={node.id}
          selectNodeId={selectNodeId || ""}
          id={node.id}
          label={node.label}
          previewVisible={previewVisible}
        />
      </div>
      <div className="tw-flex tw-flex-col tw-relative">
        {(node.children || []).map((child) => (
          <MindMapBlock
            key={child.id}
            node={child}
            parentNodeId={node.id}
            selectNodeId={selectNodeId}
            setSelectNodeId={setSelectNodeId}
            appendChildNode={appendChildNode}
            appendSiblingNode={appendSiblingNode}
            drawLine={drawLine}
          />
        ))}
        {previewVisible === "lastChild" && (
          <PreviewNode
            style={{
              top: node.children.length
                ? `calc(100% - ${NODE_MARGIN_Y / 2 + 3}px)`
                : "calc(50% - 14px)",
              left: "33px",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MindMapBlock;
