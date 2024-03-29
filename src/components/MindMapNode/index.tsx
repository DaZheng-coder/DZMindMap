import { FC, ReactNode } from "react";

interface IMindMapNodeProps {
  id: string;
  label: ReactNode;
  selectId: string;
}

const selectedCls = "tw-border-[3px] tw-border-solid tw-border-[#1456f0]";
const unSelectedCls = "tw-border-[3px] tw-border-solid tw-border-[white]";

const MindMapNode: FC<IMindMapNodeProps> = ({ id, label, selectId }) => {
  return (
    <div
      id={id}
      className={`${
        selectId === id ? selectedCls : unSelectedCls
      } tw-py-[6px] tw-px-[10px] tw-rounded-[6px] tw-bg-[#6d7175] tw-text-white tw-my-[12px] tw-mx-[20px]`}
    >
      {label}
    </div>
  );
};

export default MindMapNode;
