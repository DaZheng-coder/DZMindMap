import {
  FC,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ILineCoord } from "../../types";
import MindMapBlock from "../MindMapBlock";
import SvgContainer from "../SvgContainer";
import { initLineCoords } from "../../helper";
import useDragCanvas from "../../hooks/useScroll";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { CustomDragLayer } from "../CustomDragLayer";
import usePreviewLine from "../../hooks/usePreviewLine";
import { MIND_MAP_CONTAINER_ID } from "../../constants";
import { MindMapContext } from "../../contexts/MindMapProvider";

const MindMapContainer: FC = () => {
  const [lineCoords, setLineCoords] = useState<ILineCoord[]>([]);

  const mindMapWrapRef = useRef<HTMLDivElement>(null);

  const {
    mindMapData,
    selectNodeId,
    setSelectNodeId,
    appendChildNode,
    appendSiblingNode,
    removeNode,
  } = useContext(MindMapContext)!;

  const {
    isDraggingCanvas,
    scrollContainerRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useDragCanvas();

  const { lineCoord: previewLineCoord, drawLine } = usePreviewLine();

  useLayoutEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation();
      if (["Tab", "Enter"].includes(e.key)) e.preventDefault();
      switch (e.key) {
        case "Tab":
          appendChildNode(selectNodeId);
          break;
        case "Enter":
          appendSiblingNode(selectNodeId, "after");
          break;
        case "Backspace":
        case "Delete":
          removeNode(selectNodeId);
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [appendChildNode, appendSiblingNode, removeNode, selectNodeId]);

  useLayoutEffect(() => {
    if (mindMapWrapRef.current) {
      const rect = mindMapWrapRef.current.getBoundingClientRect();
      const originCoords = { x: rect.left, y: rect.top };
      const lineCoords: ILineCoord[] = [];
      initLineCoords(mindMapData, originCoords, lineCoords);
      setLineCoords(lineCoords);
    }
  }, [mindMapWrapRef, mindMapData]);

  const handleContainerClick = useCallback(
    () => setSelectNodeId(undefined),
    [setSelectNodeId]
  );

  return (
    <div
      ref={scrollContainerRef}
      onClick={handleContainerClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`${
        isDraggingCanvas ? "tw-select-none" : ""
      } tw-w-full tw-h-full tw-overflow-scroll tw-flex`}
    >
      <DndProvider backend={HTML5Backend}>
        <div
          id={MIND_MAP_CONTAINER_ID}
          ref={mindMapWrapRef}
          className="tw-relative tw-inline-block tw-m-auto tw-p-[100px]"
        >
          <SvgContainer
            previewLineCoord={previewLineCoord}
            lineCoords={lineCoords}
          />
          <MindMapBlock node={mindMapData} isRoot drawLine={drawLine} />
          <CustomDragLayer />
        </div>
      </DndProvider>
    </div>
  );
};

export default MindMapContainer;
