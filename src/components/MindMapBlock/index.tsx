import { FC } from "react";
import MindMapNode from "../MindMapNode";
import { INode } from "../../types";

interface IDomMindTreeProps {
  data: INode;
  selectedNode: INode | undefined;
  setSelectedNode: (node: INode) => void;
}

const MindMapBlock: FC<IDomMindTreeProps> = ({
  data,
  selectedNode,
  setSelectedNode,
}) => {
  const handleClickNode = () => {
    setSelectedNode(data);
  };

  return (
    <div className="tw-flex tw-z-1">
      <div
        className={`tw-flex hover:tw-cursor-pointer tw-items-center `}
        onClick={handleClickNode}
      >
        <MindMapNode
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
