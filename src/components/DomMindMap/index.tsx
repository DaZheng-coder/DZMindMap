import { FC, useLayoutEffect, useRef, useState } from "react";
import { ILineCoord, INode } from "../../types";
import MindMapBlock from "../MindMapBlock";
import SvgContainer from "../SvgContainer";
import { initLineCoords } from "../../helper";
import useMindMapData from "../../hooks/useMindMapData";
import { nanoid } from "nanoid";

const mockData: INode = {
  id: nanoid(),
  label: nanoid(),
};

const DomMindMap: FC = () => {
  const [lineCoords, setLineCoords] = useState<ILineCoord[]>([]);
  const { data, appendChildNode, selectedNode, setSelectedNode } =
    useMindMapData(mockData);

  const containerRef = useRef<HTMLDivElement>(null);

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
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const originCoords = { x: rect.left, y: rect.top };
      const lineCoords: ILineCoord[] = [];
      initLineCoords(data, originCoords, lineCoords);
      setLineCoords(lineCoords);
    }
  }, [containerRef, data]);

  return (
    <div ref={containerRef} className="tw-relative">
      <SvgContainer lineCoords={lineCoords} />
      <MindMapBlock
        data={data}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
      />
    </div>
  );
};

export default DomMindMap;
