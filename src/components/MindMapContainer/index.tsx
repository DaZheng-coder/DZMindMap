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
import { MIND_MAP_CONTAINER_ID } from "../../constants";
import { MindMapContext } from "../../contexts/MindMapProvider";
import PreviewNode from "../PreviewNode";

const MindMapContainer: FC = () => {
  const [lineCoords, setLineCoords] = useState<ILineCoord[]>([]);

  const mindMapWrapRef = useRef<HTMLDivElement>(null);

  const {
    mindMapData,
    selectNodeId,
    setSelectNodeId,
    appendChildNode,
    appendRootChildNode,
    appendSiblingNode,
    removeNode,
    previewNodeData,
  } = useContext(MindMapContext)!;

  const {
    isDraggingCanvas,
    scrollContainerRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useDragCanvas();

  useLayoutEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation();
      if (["Tab", "Enter"].includes(e.key)) e.preventDefault();
      switch (e.key) {
        case "Tab":
          if (selectNodeId === mindMapData.id) {
            appendRootChildNode("right");
          } else {
            appendChildNode(selectNodeId);
          }
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
  }, [
    appendChildNode,
    appendSiblingNode,
    removeNode,
    selectNodeId,
    appendRootChildNode,
    mindMapData.id,
  ]);

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
            previewLineCoord={previewNodeData?.lineCoord}
            lineCoords={lineCoords}
          />
          <div className="tw-flex">
            <div className="tw-flex tw-flex-col tw-relative tw-justify-center tw-items-end">
              {(mindMapData.reverseChildren || []).map((child, index) => (
                <MindMapBlock
                  key={child.id}
                  node={child}
                  parentNodeId={mindMapData.id}
                  prevNodeId={mindMapData.reverseChildren[index - 1]?.id}
                  nextNodeId={mindMapData.reverseChildren[index + 1]?.id}
                  dir="left"
                />
              ))}
            </div>
            <MindMapBlock node={mindMapData} isRoot dir="right" />
          </div>
          <PreviewNode />
          <CustomDragLayer />
        </div>
      </DndProvider>
    </div>
  );
};

export default MindMapContainer;
