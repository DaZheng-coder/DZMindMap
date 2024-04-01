import { FC, useCallback, useEffect, useRef } from "react";
import MindMapNode from "../MindMapNode";
import { INode } from "../../types";
import { useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";

interface IDomMindTreeProps {
  data: INode;
  selectedNode: INode | undefined;
  setSelectedNode: (node: INode) => void;
  cls?: string;
  isRoot?: boolean;
}

const MindMapBlock: FC<IDomMindTreeProps> = ({
  data,
  selectedNode,
  setSelectedNode,
  cls = "",
  isRoot = false,
}) => {
  const blockRef = useRef<HTMLDivElement | null>(null);
  const nodeRef = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: "MindMap",
    item: { data, draggingDomRef: nodeRef },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: (monitor) => {
      return !isRoot;
    },
  }));

  const [collectedProps, drop] = useDrop(() => ({
    accept: "MindMap",
    hover: (item, monitor) => {
      const hover = monitor.isOver({ shallow: true });
      if (hover) {
        // console.log("*** item", item, data.label);
      }
    },
  }));

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

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
      className={`tw-flex tw-z-1 ${cls} ${
        isDragging ? "tw-opacity-60" : "tw-opacity-100"
      }`}
    >
      <div
        className={`tw-flex hover:tw-cursor-pointer tw-items-center `}
        onClick={handleClickNode}
      >
        <MindMapNode
          ref={nodeRef}
          key={data.id}
          selectId={selectedNode?.id || ""}
          id={data.id}
          label={data.label}
        />
      </div>
      {data.children && data.children.length ? (
        <div className="tw-flex tw-flex-col">
          {data.children.map((child) => (
            <MindMapBlock
              key={child.id}
              data={child}
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default MindMapBlock;
