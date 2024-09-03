"use client";
import { ReactElement, useState } from "react";

interface TechItemProps {
  techName: string;
  icon: ReactElement;
}

export default function TechItem(props: TechItemProps) {
  const [hover, setHover] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const handleMouseEnter = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
  };

  // const handleMouseMove = (
  //   event: React.MouseEvent<HTMLDivElement, MouseEvent>
  // ) => {
  //   const rect = event.currentTarget.getBoundingClientRect();
  //   setCursorPos({
  //     x: event.clientX - rect.left,
  //     y: event.clientY - rect.top,
  //   });
  //   console.log(cursorPos);
  // };

  const containerStyle = hover
    ? {
        transform: `scale(1.05)`,
      }
    : {};
  return (
    <div
      className="tech-item"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={containerStyle}
    >
      {props.icon}
      <h4>{props.techName}</h4>
    </div>
  );
}
