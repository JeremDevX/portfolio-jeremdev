"use client";
import Image from "next/image";
import { useState } from "react";

interface CarouselProjectProps {
  src: string[];
  alt: string;
}

export default function CarouselProject(props: CarouselProjectProps) {
  const [currentImg, setCurrentImg] = useState(0);

  const handleImgClick = (index: number) => {
    setCurrentImg(index);
  };
  return (
    <>
      <div className="project__large-img">
        <Image
          src={props.src[currentImg]}
          alt={`${props.alt} image ${currentImg + 1}`}
          width={1920}
          height={1080}
        />
      </div>
      <ul className="project__list-img">
        {props.src.map((img: string, index: number) => (
          <li key={index}>
            <Image
              src={img}
              alt={`${props.alt} image ${currentImg + 1}`}
              width={250}
              height={250}
              onClick={() => {
                handleImgClick(index);
              }}
            />
          </li>
        ))}
      </ul>
    </>
  );
}
