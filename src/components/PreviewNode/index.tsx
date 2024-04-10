import { CSSProperties, FC } from "react";
import { PREVIEW_NODE_ID } from "../../constants";

interface IPreviewNodeProps {
  style: CSSProperties;
}

const PreviewNode: FC<IPreviewNodeProps> = ({ style = {} }) => {
  return (
    <div
      id={PREVIEW_NODE_ID}
      style={style}
      className="tw-absolute tw-text-[#222] tw-bg-[skyblue] tw-p-[2px] tw-rounded-[4px]"
    >
      preview
    </div>
  );
};

export default PreviewNode;
