import { FC } from "react";
import MindMapNode from "../MindMapNode";
import { INode } from "../../types";

interface IDomMindTreeProps {
  data: INode;
  selectId: string;
  setSelectId: (id: string) => void;
}

const MindMapBlock: FC<IDomMindTreeProps> = ({
  data,
  selectId,
  setSelectId,
}) => {
  const handleClickNode = () => {
    setSelectId(data.id);
  };

  return (
    <div className="tw-flex tw-z-1">
      <div
        className={`tw-flex hover:tw-cursor-pointer tw-items-center `}
        onClick={handleClickNode}
      >
        <MindMapNode
          key={data.id}
          selectId={selectId}
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
              selectId={selectId}
              setSelectId={setSelectId}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default MindMapBlock;
