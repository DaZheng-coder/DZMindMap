import { FC, useEffect, useRef, useState } from "react";
import { ILineCoord, INode } from "../../types";
import MindMapBlock from "../MindMapBlock";
import SvgContainer from "../SvgContainer";
import { initLineCoords } from "../../helper";
import useMindMapData from "../../hooks/useMindMapData";

const mockData: INode = {
  id: "root1",
  label: "root",
  children: [
    {
      id: "child1",
      label: "child1",
      children: [],
    },
    {
      id: "child2",
      label: "child2",
      children: [],
    },
  ],
};

const DomMindMap: FC = () => {
  const [lineCoords, setLineCoords] = useState<ILineCoord[]>([]);
  const { data, appendChildNode, selectedId, setSelectedId } =
    useMindMapData(mockData);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation();
      e.preventDefault();
      appendChildNode(selectedId);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [appendChildNode, selectedId]);

  useEffect(() => {
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
        selectId={selectedId}
        setSelectId={setSelectedId}
      />
    </div>
  );
};

export default DomMindMap;
