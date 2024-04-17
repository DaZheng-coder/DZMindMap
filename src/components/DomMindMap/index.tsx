import { FC } from "react";
import MindMapContainer from "../MindMapContainer";
import MindMapProvider from "../../contexts/MindMapProvider";
import { nanoid } from "nanoid";
import { getNewNode } from "../../helper";

const DomMindMap: FC = () => {
  return (
    <MindMapProvider
      initData={{
        id: nanoid(),
        label: "root",
        children: [],
        reChildren: [getNewNode()],
      }}
    >
      <MindMapContainer />
    </MindMapProvider>
  );
};

export default DomMindMap;
