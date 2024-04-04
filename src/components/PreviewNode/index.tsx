import { FC } from "react";

interface IPreviewNodeProps {
  className?: string;
}

const PreviewNode: FC<IPreviewNodeProps> = ({ className = "" }) => {
  return (
    <div
      className={`${className} tw-absolute tw-text-[#222] tw-bg-[skyblue] tw-p-[2px] tw-rounded-[4px]`}
    >
      preview
    </div>
  );
};

export default PreviewNode;
