import { FC, LegacyRef, ReactNode, forwardRef } from "react";

interface IMindMapNodeProps {
  id: string;
  label: ReactNode;
  selectId: string;
}

const selectedCls = "tw-border-[3px] tw-border-solid tw-border-[#1456f0]";
const unSelectedCls = "tw-border-[3px] tw-border-solid tw-border-[white]";

const MindMapNode: FC<IMindMapNodeProps> = forwardRef<
  HTMLDivElement,
  IMindMapNodeProps
>(({ id, label, selectId }, ref) => {
  return (
    <div
      id={id}
      ref={ref}
      onMouseDown={(e) => e.stopPropagation()}
      className={`${
        selectId === id ? selectedCls : unSelectedCls
      } tw-py-[6px] tw-px-[10px] tw-rounded-[6px] tw-bg-[#6d7175] tw-text-white tw-my-[12px] tw-mx-[20px]`}
    >
      {label}
    </div>
  );
});

export default MindMapNode;
