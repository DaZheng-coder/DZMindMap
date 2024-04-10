import { useCallback, useState } from "react";
import { ILineCoord } from "../types";
import { MIND_MAP_CONTAINER_ID, PREVIEW_NODE_ID } from "../constants";

const usePreviewLine = () => {
  const [lineCoord, setLineCoord] = useState<ILineCoord | null>(null);

  const drawLine = useCallback((startNodeId?: string) => {
    if (!startNodeId) {
      setLineCoord(null);
      return;
    }
    const wrapRect = document
      .getElementById(MIND_MAP_CONTAINER_ID)
      ?.getBoundingClientRect();
    const startRect = document
      .getElementById(startNodeId)
      ?.getBoundingClientRect();
    const endRect = document
      .getElementById(PREVIEW_NODE_ID)
      ?.getBoundingClientRect();
    if (!wrapRect || !startRect || !endRect) return;
    const originCoord = { x: wrapRect.left, y: wrapRect.top };
    const startCoord = {
      x: startRect.right - originCoord.x,
      y: startRect.bottom - originCoord.y - startRect.height / 2,
    };
    const endCoord = {
      x: endRect.left - originCoord.x,
      y: endRect.bottom - originCoord.y - endRect.height / 2,
    };
    setLineCoord({ start: startCoord, end: endCoord, turn: "start" });
  }, []);

  return { lineCoord, drawLine };
};

export default usePreviewLine;
