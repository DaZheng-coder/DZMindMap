import { useEffect, useRef } from "react";
import { XYCoord, useDragLayer } from "react-dnd";

function getItemStyles(currentOffset: XYCoord | null) {
  if (!currentOffset) {
    return {
      display: "none",
    };
  }
  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform,
  };
}

export const CustomDragLayer = () => {
  const previewRef = useRef<HTMLDivElement>(null);

  const { isDragging, item, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  useEffect(() => {
    if (item?.draggingDomRef.current) {
      const style = item.draggingDomRef.current.style;
      const rect = item.draggingDomRef.current.getBoundingClientRect();

      const cloneNode = item.draggingDomRef.current.cloneNode(true);
      const marginTop = style.marginTop.replace("px", "");
      const marginBottom = style.marginBottom.replace("px", "");

      cloneNode.style.width = rect.width + "px";
      cloneNode.style.boxSizing = "border-box";
      cloneNode.style.transform = `translate(-${marginTop}px, -${marginBottom}px)`;

      previewRef.current?.appendChild(cloneNode);
    } else {
      while (previewRef.current?.firstChild) {
        previewRef.current.removeChild(previewRef.current.firstChild);
      }
    }
  }, [item?.draggingDomRef]);

  return isDragging ? (
    <div className="tw-fixed tw-top-0 tw-left-0 tw-z-9999 tw-pointer-events-none tw-w-full tw-h-full tw-opacity-80">
      <div ref={previewRef} style={getItemStyles(currentOffset)}></div>
    </div>
  ) : null;
};
