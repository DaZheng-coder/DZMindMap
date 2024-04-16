import { FC, useContext, useEffect, useRef } from "react";
import MindMapNode from "../MindMapNode";
import { ICoord, IDraggingItem, INode } from "../../types";
import { DropTargetMonitor, XYCoord, useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { MindMapContext } from "../../contexts/MindMapProvider";
import {
  MIND_MAP_CONTAINER_ID,
  NODE_MARGIN_X,
  NODE_MARGIN_Y,
} from "../../constants";
import { getRect } from "../../utils";

interface IMindMapBlockProps {
  node: INode;
  parentNodeId?: string;
  prevNodeId?: string;
  nextNodeId?: string;
  isRoot?: boolean;
}

const MindMapBlock: FC<IMindMapBlockProps> = ({
  node,
  parentNodeId,
  prevNodeId,
  nextNodeId,
  isRoot = false,
}) => {
  const blockRef = useRef<HTMLDivElement | null>(null);
  const nodeRef = useRef<HTMLDivElement | null>(null);

  const { appendChildNode, appendSiblingNode, setPreviewNodeData } =
    useContext(MindMapContext)!;

  const getPreInsertPos = (
    draggingOffset: XYCoord | null,
    isRoot: boolean = false,
    nodeRect?: DOMRect
  ) => {
    const rect =
      nodeRect || document.getElementById(node.id)?.getBoundingClientRect();
    if (rect && draggingOffset) {
      const centerX = (rect.width / 4) * 3 + rect.left;
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

  const handleNotHover = () => {
    setPreviewNodeData({ visible: false });
  };

  const setPreviewData = (start: ICoord, end: ICoord) => {
    setPreviewNodeData({
      visible: true,
      lineCoord: { start, end },
    });
  };

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
        const originRect = getRect(MIND_MAP_CONTAINER_ID);
        const selectNodeRect = getRect(node.id);
        if (!selectNodeRect) return;

        const pos = getPreInsertPos(
          monitor.getClientOffset(),
          isRoot,
          selectNodeRect
        );
        const originCoord: ICoord = {
          x: originRect?.left || 0,
          y: originRect?.top || 0,
        };

        if (pos === "lastChild") {
          const start = {
            x: selectNodeRect.right - originCoord.x,
            y:
              selectNodeRect.bottom - originCoord.y - selectNodeRect.height / 2,
          };
          const end = {
            x: start.x + NODE_MARGIN_X * 2,
            y: node.children.length ? start.y + selectNodeRect.height : start.y,
          };
          setPreviewData(start, end);
        } else {
          const parentNodeRect = getRect(parentNodeId);
          if (!parentNodeRect) return;

          const start = {
            x: parentNodeRect.right - originCoord.x,
            y:
              parentNodeRect.bottom - originCoord.y - parentNodeRect.height / 2,
          };
          if (pos === "top") {
            const prevNodeRect = getRect(prevNodeId);

            const end = prevNodeId
              ? {
                  x: selectNodeRect.left - originCoord.x,
                  y: prevNodeRect
                    ? (selectNodeRect.top - prevNodeRect.bottom) / 2 +
                      prevNodeRect.bottom -
                      originCoord.y
                    : 0,
                }
              : {
                  x: selectNodeRect.left - originCoord.x,
                  y: selectNodeRect.top - NODE_MARGIN_Y - originCoord.y,
                };
            setPreviewData(start, end);
          } else {
            const nextNodeRect = getRect(nextNodeId);

            const end = nextNodeId
              ? {
                  x: selectNodeRect.left - originCoord.x,
                  y: nextNodeRect
                    ? (nextNodeRect.top - selectNodeRect.bottom) / 2 +
                      selectNodeRect.bottom -
                      originCoord.y
                    : 0,
                }
              : {
                  x: selectNodeRect.left - originCoord.x,
                  y: selectNodeRect.bottom + NODE_MARGIN_Y - originCoord.y,
                };
            setPreviewData(start, end);
          }
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
    }),
    [prevNodeId, nextNodeId]
  );

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  useEffect(() => {
    if (!isOver) {
      handleNotHover();
    }
  }, [isOver]);

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
      >
        <MindMapNode
          ref={nodeRef}
          key={node.id}
          id={node.id}
          label={node.label}
          shrink={node.shrink}
          shrinkBtnVisible={!!node.children?.length}
        />
      </div>
      <div
        style={{ display: node.shrink ? "none" : "flex" }}
        className="tw-flex tw-flex-col tw-relative"
      >
        {(node.children || []).map((child, index) => (
          <MindMapBlock
            key={child.id}
            node={child}
            parentNodeId={node.id}
            prevNodeId={node.children[index - 1]?.id}
            nextNodeId={node.children[index + 1]?.id}
          />
        ))}
      </div>
    </div>
  );
};

export default MindMapBlock;
