import { FC, useContext, useEffect, useRef } from "react";
import MindMapNode from "../MindMapNode";
import { IDraggingItem, INode, TDir } from "../../types";
import { DropTargetMonitor, useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { MindMapContext } from "../../contexts/MindMapProvider";
import {
  getLeftInsertPos,
  getPreviewData,
  getRightInsertPos,
  getRootInsertPos,
} from "../../helper";

interface IMindMapBlockProps {
  node: INode;
  parentNodeId?: string;
  prevNodeId?: string;
  nextNodeId?: string;
  isRoot?: boolean;
  dir?: TDir;
}

const MindMapBlock: FC<IMindMapBlockProps> = ({
  node,
  parentNodeId,
  prevNodeId,
  nextNodeId,
  isRoot = false,
  dir = "right",
}) => {
  const blockRef = useRef<HTMLDivElement | null>(null);
  const nodeRef = useRef<HTMLDivElement | null>(null);

  const {
    appendChildNode,
    appendRootChildNode,
    appendSiblingNode,
    setPreviewNodeData,
  } = useContext(MindMapContext)!;

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: "MindMap",
    item: {
      draggingNode: node,
      draggingDomRef: nodeRef,
      draggingNodeParentNodeId: parentNodeId,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: () => !isRoot,
  }));

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "MindMap",
      collect: (monitor: DropTargetMonitor<IDraggingItem>) => {
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
        if (!isOver) return;
        const draggingOffset = monitor.getClientOffset();
        const newPreviewData = getPreviewData({
          node,
          draggingOffset,
          isRoot,
          dir,
          parentNodeId,
          prevNodeId,
          nextNodeId,
        });
        newPreviewData &&
          setPreviewNodeData({
            visible: true,
            lineCoord: newPreviewData,
          });
      },
      drop: (item, monitor) => {
        const draggingNode = item.draggingNode;
        const isOver = monitor.isOver({ shallow: true });
        const draggingOffset = monitor.getClientOffset();
        if (isOver) {
          if (isRoot) {
            const pos = getRootInsertPos(node, draggingOffset);
            if (!pos) return;
            appendRootChildNode(pos, draggingNode.id);
          } else {
            const pos = { left: getLeftInsertPos, right: getRightInsertPos }[
              dir
            ](node, draggingOffset);
            if (pos === "insertChild") {
              appendChildNode(node.id, draggingNode.id);
            } else {
              appendSiblingNode(
                node.id,
                pos === "top" ? "before" : "after",
                draggingNode.id
              );
            }
          }
        }
      },
    }),
    [prevNodeId, nextNodeId]
  );

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  useEffect(() => {
    if (!isOver) {
      setPreviewNodeData({ visible: false });
    }
  }, [isOver, setPreviewNodeData]);

  drag(nodeRef);
  drop(blockRef);

  const renderNode = (
    <div
      className={`tw-relative tw-flex hover:tw-cursor-pointer tw-items-center `}
    >
      <MindMapNode
        ref={nodeRef}
        key={node.id}
        id={node.id}
        label={node.label}
        shrink={node.shrink}
        shrinkBtnVisible={!!node.children?.length}
        dir={dir}
      />
    </div>
  );

  return (
    <div
      ref={blockRef}
      className={`tw-flex tw-z-1 ${
        isDragging ? "tw-opacity-60" : "tw-opacity-100"
      }`}
    >
      {dir === "right" && renderNode}
      <div
        style={{ display: node.shrink ? "none" : "flex" }}
        className={`${
          dir === "left" ? "tw-items-end" : ""
        } tw-flex tw-flex-col tw-relative tw-justify-center`}
      >
        {(node.children || []).map((child, index) => (
          <MindMapBlock
            key={child.id}
            node={child}
            parentNodeId={node.id}
            prevNodeId={node.children[index - 1]?.id}
            nextNodeId={node.children[index + 1]?.id}
            dir={dir}
          />
        ))}
      </div>
      {dir === "left" && renderNode}
    </div>
  );
};

export default MindMapBlock;
