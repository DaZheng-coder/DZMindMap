import { FC } from "react";
import Line from "../Line";
import { ILineCoord } from "../../types";

interface ISvgContainerProps {
  previewLineCoord?: ILineCoord;
  lineCoords: ILineCoord[];
}

const SvgContainer: FC<ISvgContainerProps> = ({
  lineCoords,
  previewLineCoord,
}) => {
  return (
    <svg className="tw-absolute tw-left-0 tw-top-0 tw-w-full tw-h-full tw-z-[-1]">
      {lineCoords.map(({ start, end, turn }, index) => (
        <Line
          key={index}
          start={start}
          end={end}
          turn={turn}
          // showArrow={showArrow}
        />
      ))}
      {previewLineCoord && (
        <Line
          key="preview_line"
          start={previewLineCoord.start}
          end={previewLineCoord.end}
          turn={previewLineCoord.turn}
          // showArrow={showArrow}
        />
      )}
      {/* <defs>
        <marker
          id="markerArrow"
          markerUnits="strokeWidth"
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <svg
            width="7"
            height="7"
            viewBox="0 0 7 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.936035 0.485764L5.93604 3.4149L0.936035 6.48576V0.485764Z"
              fill="#BBBFC3"
            />
          </svg>
        </marker>
      </defs> */}
    </svg>
  );
};

export default SvgContainer;
