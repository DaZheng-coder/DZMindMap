import { FC } from "react";
import MindMapContainer from "../MindMapContainer";
import MindMapProvider from "../../contexts/MindMapProvider";
import { nanoid } from "nanoid";

const DomMindMap: FC = () => {
  return (
    <MindMapProvider
      initData={{
        id: nanoid(),
        label: nanoid(),
        children: [],
      }}
    >
      <MindMapContainer />
    </MindMapProvider>
  );
};

export default DomMindMap;
