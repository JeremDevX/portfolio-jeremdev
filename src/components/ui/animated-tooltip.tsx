"use client";
import React, { ReactElement, useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

export const AnimatedTooltip = ({
  items,
}: {
  items: {
    id: number;
    name: string;
    designation: string;
    image: ReactElement;
  }[];
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 9 };
  const x = useMotionValue(0); // going to set this value on mouse move
  // rotate the tooltip
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-25, 25]),
    springConfig
  );
  // translate the tooltip
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  );
  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    x.set(offsetX);
  };

  return (
    <>
      {items.map((item) => (
        <div
          className={`-mr-7 relative group `}
          key={item.name}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{ zIndex: hoveredIndex === item.id ? 50 : 10 - item.id }}
          onFocus={() => setHoveredIndex(item.id)}
          onBlur={() => setHoveredIndex(null)}
          tabIndex={0}
        >
          <AnimatePresence mode="popLayout">
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 150,
                    damping: 15,
                  },
                }}
                exit={{ opacity: 0, y: 40, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: "nowrap",
                }}
                className="absolute -top-18 left-1/2 -translate-x-1/2 flex text-xs flex-col items-center justify-center rounded-md bg-black z-50 px-6 py-2 shadow-[0_0px_25px_rgba(0,204,37,0.25)]"
              >
                <div className="absolute left-0 z-30 w-[100%] top-0 bg-gradient-to-r fromtransparent via-[rgba(21,174,0,1)] to-transparent h-3/100" />
                <div className="absolute right-0 w-[100%] z-30 bottom-0 bg-gradient-to-r from-transparent via-[rgba(21,174,0,1)] to-transparent h-3/100" />
                <div className="font-bold text-white relative z-30 text-xl">
                  {item.name}
                </div>
                <div className="text-white text-sm">{item.designation}</div>
              </motion.div>
            )}
          </AnimatePresence>
          <div
            onMouseMove={handleMouseMove}
            className="flex items-center justify-center !m-0 p-3 object-top rounded-3xl h-18 w-18 sm:h-25 sm:w-25 border-2 group-hover:scale-120 group-hover:z-30 border-[rgba(21,174,0,0.25)] relative transition duration-500 overflow-hidden hover:shadow-[0_0px_25px_rgba(0,204,37,0)]"
            style={{ backgroundColor: "var(--tech-bg)" }}
          >
            {item.image}
          </div>
        </div>
      ))}
    </>
  );
};
