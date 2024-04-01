import { useRef, MouseEvent, useState } from "react";
import { ICoord } from "../types";

const useDragCanvas = () => {
  const [isDraggingCanvas, setIsDraggingCanvas] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const startCoordRef = useRef<ICoord | null>();

  const handleMouseDown = (e: MouseEvent) => {
    setIsDraggingCanvas(true);
    startCoordRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (
      isDraggingCanvas &&
      scrollContainerRef.current &&
      startCoordRef.current
    ) {
      const { clientX, clientY } = e;
      const x = startCoordRef.current.x - clientX;
      const y = startCoordRef.current.y - clientY;
      scrollContainerRef.current.scrollBy(x, y);
      startCoordRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    setIsDraggingCanvas(false);
    startCoordRef.current = null;
  };

  return {
    scrollContainerRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    isDraggingCanvas,
  };
};

export default useDragCanvas;
