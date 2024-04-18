import { FC, useContext } from "react";
import {
  PREVIEW_NODE_HEIGHT,
  PREVIEW_NODE_ID,
  PREVIEW_NODE_WIDTH,
} from "../../constants";
import { MindMapContext } from "../../contexts/MindMapProvider";

interface IPreviewNodeProps {}

const PreviewNode: FC<IPreviewNodeProps> = () => {
  const { previewNodeData } = useContext(MindMapContext)!;

  return (
    <div
      id={PREVIEW_NODE_ID}
      style={{
        width: PREVIEW_NODE_WIDTH + "px",
        height: PREVIEW_NODE_HEIGHT + "px",
        display: previewNodeData?.visible ? "block" : "none",
        top: previewNodeData?.lineCoord?.end.y,
        left: previewNodeData?.lineCoord?.end.x,
        transform:
          previewNodeData?.lineCoord?.dir === "left"
            ? "translate(-100%, -50%)"
            : "translateY(-50%)",
      }}
      className="tw-absolute tw-text-[#222] tw-bg-[skyblue] tw-p-[2px] tw-rounded-[4px]"
    />
  );
};

export default PreviewNode;
