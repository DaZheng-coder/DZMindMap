import { useRef, MouseEvent, useState } from "react";
import { ICoord } from "../types";

const useDragCanvas = () => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const startCoordRef = useRef<ICoord | null>();

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    startCoordRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && scrollerRef.current && startCoordRef.current) {
      const { clientX, clientY } = e;
      const x = startCoordRef.current.x - clientX;
      const y = startCoordRef.current.y - clientY;
      scrollerRef.current.scrollBy(x, y);
      startCoordRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    startCoordRef.current = null;
  };

  return {
    scrollerRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    isDragging,
  };
};

export default useDragCanvas;
