import { FC } from "react";
import { ICoord } from "../../types";

interface ILineProps {
  start: ICoord;
  end: ICoord;
  turn?: "start" | "end";
}

const Line: FC<ILineProps> = ({ start, end, turn = "start" }) => {
  const _start = `${start.x},${start.y}`;
  const _end = `${end.x},${end.y}`;
  const _turn =
    turn === "start"
      ? `${start.x + 20},${start.y} ${start.x + 20},${end.y}`
      : `${end.x - 20},${start.y} ${end.x - 20}, ${end.y}`;

  return (
    <polyline
      points={`${_start} ${_turn} ${_end}`}
      stroke="#BBBFC3"
      fill="none"
      // markerEnd={showArrow ? "url(#markerArrow)" : ""}
    />
  );
};

export default Line;
