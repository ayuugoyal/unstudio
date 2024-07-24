"use client";
import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Image as ImgTab } from "@prisma/client";
import { fabric } from "fabric";
import { deleteAnImage } from "@/actions/user";
import { CirclePlus, CrossIcon } from "lucide-react";
import { toast } from "./use-toast";

export const ParallaxScroll = ({
  images,
  className,
  addImageToCanvas,
  canvas,
  fetchImage,
}: {
  images: ImgTab[];
  className?: string;
  addImageToCanvas: (
    canvas: fabric.Canvas,
    imageURL: string,
    options?: { left?: number; top?: number; scale?: number }
  ) => void;
  canvas: fabric.Canvas;
  fetchImage: () => void;
}) => {
  const gridRef = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    container: gridRef, // remove this if your container is not fixed height
    offset: ["start start", "end start"], // remove this if your container is not fixed height
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const third = Math.ceil(images.length / 3);

  const firstPart = images.slice(0, third);
  const secondPart = images.slice(third, 2 * third);
  const thirdPart = images.slice(2 * third);

  return (
    <div
      className={cn("h-[20rem] items-start overflow-y-auto w-full", className)}
      ref={gridRef}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-5xl mx-auto gap-3 pt-6 pb-40 px-6"
        ref={gridRef}
      >
        <div className="grid gap-3">
          {firstPart.map((el, idx) => (
            <motion.div
              style={{ y: translateFirst }}
              key={"grid-1" + idx}
              className="relative"
            >
              <Image
                src={el.url}
                className="w-full object-cover cursor-pointer object-left-top rounded-lg gap-3 !m-0 !p-0"
                height="400"
                width="400"
                alt="thumbnail"
                onClick={() =>
                  addImageToCanvas(canvas, el.url, {
                    left: Math.random() * 200,
                    top: Math.random() * 200,
                    scale: 0.2,
                  })
                }
              />
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                className="absolute -top-1 -right-1 rounded-full"
                onClick={() => {
                  deleteAnImage(el.id);
                  fetchImage();
                  toast({
                    title: "Image deleted",
                  });
                }}
              >
                <CirclePlus className="rotate-45" />
              </motion.button>
            </motion.div>
          ))}
        </div>
        <div className="grid gap-10">
          {secondPart.map((el, idx) => (
            <motion.div
              style={{ y: translateFirst }}
              key={"grid-1" + idx}
              className="relative"
            >
              <Image
                src={el.url}
                className="w-full object-cover cursor-pointer object-left-top rounded-lg gap-3 !m-0 !p-0"
                height="400"
                width="400"
                alt="thumbnail"
                onClick={() =>
                  addImageToCanvas(canvas, el.url, {
                    left: Math.random() * 200,
                    top: Math.random() * 200,
                    scale: 0.2,
                  })
                }
              />
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                className="absolute -top-1 -right-1 rounded-full"
                onClick={() => {
                  deleteAnImage(el.id);
                  fetchImage();
                  toast({
                    title: "Image deleted",
                  });
                }}
              >
                <CirclePlus className="rotate-45" />
              </motion.button>
            </motion.div>
          ))}
        </div>
        <div className="grid gap-10">
          {thirdPart.map((el, idx) => (
            <motion.div
              style={{ y: translateFirst }}
              key={"grid-1" + idx}
              className="relative"
            >
              <Image
                src={el.url}
                className="w-full object-cover cursor-pointer object-left-top rounded-lg gap-3 !m-0 !p-0"
                height="400"
                width="400"
                alt="thumbnail"
                onClick={() =>
                  addImageToCanvas(canvas, el.url, {
                    left: Math.random() * 200,
                    top: Math.random() * 200,
                    scale: 0.2,
                  })
                }
              />
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                className="absolute -top-1 -right-1 rounded-full"
                onClick={() => {
                  deleteAnImage(el.id);
                  fetchImage();
                  toast({
                    title: "Image deleted",
                  });
                }}
              >
                <CirclePlus className="rotate-45" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
