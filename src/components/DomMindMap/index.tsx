import { FC, useLayoutEffect, useRef, useState } from "react";
import { ILineCoord, INode } from "../../types";
import MindMapBlock from "../MindMapBlock";
import SvgContainer from "../SvgContainer";
import { initLineCoords } from "../../helper";
import useMindMapData from "../../hooks/useMindMapData";
import { nanoid } from "nanoid";
import useDragCanvas from "../../hooks/useScroll";

const mockData: INode = {
  id: nanoid(),
  label: nanoid(),
};

const DomMindMap: FC = () => {
  const [lineCoords, setLineCoords] = useState<ILineCoord[]>([]);
  const { data, appendChildNode, selectedNode, setSelectedNode } =
    useMindMapData(mockData);

  const mindMapWrapRef = useRef<HTMLDivElement>(null);
  const {
    isDragging,
    scrollerRef,
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
          appendChildNode(selectedNode);
          break;
        case "Enter":
          appendChildNode(selectedNode?.parentNode);
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [appendChildNode, selectedNode]);

  useLayoutEffect(() => {
    if (mindMapWrapRef.current) {
      const rect = mindMapWrapRef.current.getBoundingClientRect();
      const originCoords = { x: rect.left, y: rect.top };
      const lineCoords: ILineCoord[] = [];
      initLineCoords(data, originCoords, lineCoords);
      setLineCoords(lineCoords);
    }
  }, [mindMapWrapRef, data]);

  return (
    <div
      ref={scrollerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`${
        isDragging ? "tw-select-none" : ""
      } tw-w-full tw-h-full tw-overflow-scroll tw-flex`}
    >
      <div
        ref={mindMapWrapRef}
        className="tw-relative tw-inline-block tw-m-auto"
      >
        <SvgContainer lineCoords={lineCoords} />
        <MindMapBlock
          data={data}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
        />
      </div>
    </div>
  );
};

export default DomMindMap;
