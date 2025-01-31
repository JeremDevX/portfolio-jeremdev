"use client";

import Image from "next/image";
import { Tabs } from "../ui/tabs";

export function TabsDemo() {
  const tabs = [
    {
      title: "Product",
      value: "product",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-black shadow-[0_0_5px_rgba(21,174,0,0.15)] border-2 border-green-500/25">
          <p>Product Tab</p>
          <DummyContent />
        </div>
      ),
    },
    {
      title: "Services",
      value: "services",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-black shadow-[0_0_5px_rgba(21,174,0,0.15)] border-2 border-green-500/25">
          <p>Services tab</p>
          <DummyContent />
        </div>
      ),
    },
    {
      title: "Playground",
      value: "playground",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-black shadow-[0_0_5px_rgba(21,174,0,0.15)] border-2 border-green-500/25">
          <p>Playground tab</p>
          <DummyContent />
        </div>
      ),
    },
    {
      title: "Content",
      value: "content",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-black shadow-[0_0_5px_rgba(21,174,0,0.15)] border-2 border-green-500/25">
          <p>Content tab</p>
          <DummyContent />
        </div>
      ),
    },
    {
      title: "Random",
      value: "random",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-black shadow-[0_0_5px_rgba(21,174,0,0.15)] border-2 border-green-500/25">
          <p>Random tab</p>
          <DummyContent />
        </div>
      ),
    },
  ];

  return (
    <div className="h-[20rem] md:h-[50rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full items-start justify-start mt-5 mb-50">
      <Tabs tabs={tabs} />
    </div>
  );
}

const DummyContent = () => {
  return (
    <p className="text-green-500 mt-25 mx-auto text-center">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi, quae ab
      fugiat natus officiis hic officia, rerum unde necessitatibus molestias
      repellendus explicabo quibusdam excepturi? Nihil, impedit numquam!
      Temporibus, saepe eum?
    </p>
  );
};
