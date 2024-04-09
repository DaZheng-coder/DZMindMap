import { FC, useCallback, useLayoutEffect, useRef, useState } from "react";
import { ILineCoord, INode } from "../../types";
import MindMapBlock from "../MindMapBlock";
import SvgContainer from "../SvgContainer";
import { initLineCoords } from "../../helper";
import useMindMapData from "../../hooks/useMindMapData";
import { nanoid } from "nanoid";
import useDragCanvas from "../../hooks/useScroll";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { CustomDragLayer } from "../CustomDragLayer";

const mockData: INode = {
  id: nanoid(),
  label: nanoid(),
  children: [],
};

const DomMindMap: FC = () => {
  const [lineCoords, setLineCoords] = useState<ILineCoord[]>([]);

  const mindMapWrapRef = useRef<HTMLDivElement>(null);

  const {
    mindMapData,
    appendChildNode,
    appendSiblingNode,
    removeNode,
    selectNodeId,
    setSelectNodeId,
  } = useMindMapData(mockData);

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
          ref={mindMapWrapRef}
          className="tw-relative tw-inline-block tw-m-auto "
        >
          <SvgContainer lineCoords={lineCoords} />
          <MindMapBlock
            node={mindMapData}
            selectNodeId={selectNodeId}
            setSelectNodeId={setSelectNodeId}
            appendChildNode={appendChildNode}
            appendSiblingNode={appendSiblingNode}
            isRoot
          />
          <CustomDragLayer />
        </div>
      </DndProvider>
    </div>
  );
};

export default DomMindMap;
