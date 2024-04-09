import { CSSProperties, FC } from "react";

interface IPreviewNodeProps {
  style: CSSProperties;
}

const PreviewNode: FC<IPreviewNodeProps> = ({ style = {} }) => {
  return (
    <div
      style={style}
      className="tw-absolute tw-text-[#222] tw-bg-[skyblue] tw-p-[2px] tw-rounded-[4px]"
    >
      preview
    </div>
  );
};

export default PreviewNode;
