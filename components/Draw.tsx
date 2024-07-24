"use client";

import { fabric } from "fabric";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { getUserImages } from "@/actions/user";
import { Image as imgTable } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ParallaxScroll } from "@/components/ui/parallax-scroll";
import {
  AlignCenterVertical,
  AlignEndVertical,
  AlignHorizontalSpaceAround,
  AlignStartVertical,
  Circle,
  DiamondIcon,
  RectangleHorizontalIcon,
  RectangleVertical,
  Trash2,
  Triangle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ScreenRecorder from "@/components/Recorder";
import Image from "next/image";

const Draw = () => {
  const { toast } = useToast();
  const [canvas, setCanvas] = useState<fabric.Canvas>();

  const [image, setImage] = useState<File | null>(null);

  const [loader, setLoader] = useState<boolean>(true);

  const [userImages, setUserImages] = useState<imgTable[] | null>([]);

  const OnChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const OnSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoader(true);

    try {
      if (!image) {
        toast({
          description: "Please select an image",
        });
        return;
      }
      const formData = new FormData();
      formData.append("image", image);
      const res = await axios.post("/api/upload-image", formData);
      toast({
        description: "Image uploaded successfully",
      });
      setImage(null);
      const data = res.data;
      console.log(data);
      fetchImage();
    } catch (error: any) {
      console.error("Error uploading image:", error);
    }
    setLoader(false);
  };

  async function fetchImage() {
    const userImages: imgTable[] = (await getUserImages()) as imgTable[];
    console.log("image", userImages);
    setUserImages(userImages);
  }

  useEffect(() => {
    setLoader(true);
    fetchImage();
    const c = new fabric.Canvas("canvas", {
      height: 600,
      width: 600,
    });

    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = "#2BEBC8";
    fabric.Object.prototype.cornerStyle = "rect";
    fabric.Object.prototype.cornerStrokeColor = "#2BEBC8";
    fabric.Object.prototype.cornerSize = 6;

    setCanvas(c);

    setLoader(false);
    return () => {
      c.dispose();
    };
  }, []);

  const addImageToCanvas = (
    canvas: fabric.Canvas,
    imageURL: string,
    options?: { left?: number; top?: number; scale?: number }
  ): Promise<fabric.Image> => {
    return new Promise((resolve, reject) => {
      function simpleCallback(img: fabric.Image) {
        if (options) {
          if (options.left !== undefined) img.left = options.left;
          if (options.top !== undefined) img.top = options.top;
          if (options.scale !== undefined) img.scale(options.scale);
        }
        canvas.add(img);
        return resolve(img);
      }

      fabric.Image.fromURL(imageURL, simpleCallback, {
        crossOrigin: "anonymous",
      });

      canvas.renderAll();
    });
  };

  const deleteObject = () => {
    const activeObjects = canvas?.getActiveObjects();
    if (activeObjects && activeObjects.length > 0) {
      activeObjects.forEach((object) => {
        canvas?.remove(object);
      });
      canvas?.discardActiveObject();
      canvas?.requestRenderAll();
    }
  };

  const centerObject = () => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject) {
      canvas?.centerObject(activeObject);
      canvas?.requestRenderAll();
    }
  };

  const addCircle = (canvas: fabric.Canvas) => {
    if (!canvas) return;
    const circle = new fabric.Circle({
      radius: 50,
      left: 150,
      top: 150,
      fill: "#FF6384",
    });
    canvas.add(circle);
  };

  const clearCanvas = () => {
    canvas?.clear();
  };

  const addParallelogram = () => {
    if (!canvas) return;

    const parallelogram = new fabric.Polygon(
      [
        { x: 0, y: 0 },
        { x: 200, y: 0 },
        { x: 150, y: 100 },
        { x: -50, y: 100 },
      ],
      {
        left: 50,
        top: 50,
        fill: "#4B0082",
        stroke: "#000",
        strokeWidth: 2,
      }
    );

    canvas.add(parallelogram);
  };

  const addVerticalRect = (canvas: fabric.Canvas) => {
    let rect = new fabric.Rect({
      left: 10,
      top: 10,
      width: 50,
      height: 100,
      fill: "blue",
      selectable: true,
    });
    canvas.add(rect);
    canvas.renderAll();
  };

  const addHorizontalRect = (canvas: fabric.Canvas) => {
    let rect = new fabric.Rect({
      left: 10,
      top: 10,
      width: 100,
      height: 50,
      fill: "green",
      selectable: true,
    });
    canvas.add(rect);
    canvas.renderAll();
  };

  const addDiamond = (canvas: fabric.Canvas) => {
    let points = [
      { x: 0, y: 50 },
      { x: 50, y: 0 },
      { x: 100, y: 50 },
      { x: 50, y: 100 },
    ];
    let diamond = new fabric.Polygon(points, {
      left: 10,
      top: 10,
      fill: "red",
      selectable: true,
    });
    canvas.add(diamond);
    canvas.renderAll();
  };

  const addTriangle = () => {
    if (!canvas) return;

    const triangle = new fabric.Triangle({
      width: 100,
      height: 100,
      fill: "#FF4500",
      left: 150,
      top: 150,
    });

    canvas.add(triangle);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        deleteObject();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [canvas]);

  const changeObjectColor = (color: string) => {
    const activeObject = canvas?.getActiveObject();
    if (activeObject && activeObject instanceof fabric.Object) {
      activeObject.set("fill", color);
      canvas?.renderAll();
    }
  };

  const alignLeft = () => {
    const activeObjects = canvas?.getActiveObjects() as fabric.Object[];
    if (activeObjects && activeObjects.length > 1) {
      const leftMostObject = activeObjects.reduce((prev, current) =>
        prev.left! < current.left! ? prev : current
      );
      const leftPosition = leftMostObject.left!;
      activeObjects.forEach((object) => {
        object.set({ left: leftPosition });
        object.setCoords();
      });
      canvas?.renderAll();
    }
  };

  const alignRight = () => {
    const activeObjects = canvas?.getActiveObjects() as fabric.Object[];
    if (activeObjects && activeObjects.length > 1) {
      const rightMostObject = activeObjects.reduce((prev, current) =>
        prev.left! > current.left! ? prev : current
      );
      const rightPosition = rightMostObject.left! + rightMostObject.width!;
      activeObjects.forEach((object) => {
        const objectRightPosition = object.left! + object.width!;
        object.set({ left: rightPosition - objectRightPosition });
        object.setCoords();
      });
      canvas?.renderAll();
    }
  };

  const alignCenter = () => {
    const activeObjects = canvas?.getActiveObjects() as fabric.Object[];
    if (activeObjects && activeObjects.length > 1) {
      const totalWidth = activeObjects.reduce(
        (sum, object) => sum + (object.width || 0),
        0
      );
      const centerPosition = (canvas?.width! || 0) / 2 - totalWidth / 2;
      let currentPosition = centerPosition;
      activeObjects.forEach((object) => {
        const objectWidth = object.width || 0;
        object.set({ left: currentPosition });
        object.setCoords();
        currentPosition += objectWidth;
      });
      canvas?.renderAll();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-7 h-screen">
      <div className="w-96 gap-7 flex flex-col">
        <form onSubmit={OnSubmitHandler} className="flex gap-3 items-center ">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input onChange={OnChangeHandler} id="" type="file" />
          </div>
          <Button className="w-40" disabled={image === null || loader}>
            {loader ? <Loader /> : "Upload"}
          </Button>
        </form>
        <div className="flex flex-wrap border border-3 rounded-xl">
          {userImages?.length !== 0 ? (
            userImages && (
              <ParallaxScroll
                images={userImages.map((image) => image)}
                addImageToCanvas={addImageToCanvas}
                canvas={canvas as fabric.Canvas}
                fetchImage={fetchImage}
              />
            )
          ) : (
            <div className="flex justify-center items-center w-full min-h-80">
              <p>No images uploaded yet</p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 ">
          <div className="grid grid-cols-3 gap-2">
            <Button
              onClick={() => addHorizontalRect(canvas as fabric.Canvas)}
              className="h-full w-full"
            >
              <RectangleHorizontalIcon className="h-full w-full" />
            </Button>
            <Button
              onClick={() => addVerticalRect(canvas as fabric.Canvas)}
              className="h-full w-full"
            >
              <RectangleVertical className="h-full w-full" />
            </Button>
            <Button
              onClick={() => addDiamond(canvas as fabric.Canvas)}
              className="h-full w-full"
            >
              <DiamondIcon className="h-full w-full" />
            </Button>
            <Button
              onClick={() => addCircle(canvas as fabric.Canvas)}
              className="h-full w-full"
            >
              <Circle className="h-full w-full" />
            </Button>
            <Button onClick={addTriangle} className="h-full w-full">
              <Triangle className="h-full w-full" />
            </Button>
            <Button onClick={addParallelogram} className="h-full w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 100 60"
                className="h-full w-full"
              >
                <polygon points="10,0 100,0 90,60 0,60" />
              </svg>
            </Button>
          </div>
          <Label>Select a object to use these:</Label>
          <div className="flex items-center gap-2">
            <Label htmlFor="color">Color:</Label>
            <Input
              id="color"
              type="color"
              onChange={(e) => changeObjectColor(e.target.value)}
            />
          </div>
          <div className="flex gap-2 ">
            <Button onClick={deleteObject} size="icon">
              <Trash2 />
            </Button>
            <Button onClick={clearCanvas} size="icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m13 11 9-9" />
                <path d="M14.6 12.6c.8.8.9 2.1.2 3L10 22l-8-8 6.4-4.8c.9-.7 2.2-.6 3 .2Z" />
                <path d="m6.8 10.4 6.8 6.8" />
                <path d="m5 17 1.4-1.4" />
              </svg>
            </Button>
            <Button onClick={centerObject} size="icon">
              <AlignHorizontalSpaceAround />
            </Button>
            <Button onClick={alignLeft} size="icon">
              <AlignStartVertical />
            </Button>
            <Button onClick={alignCenter} size="icon">
              <AlignCenterVertical />
            </Button>
            <Button onClick={alignRight} size="icon">
              <AlignEndVertical />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-7">
        <canvas id="canvas" className="border border-3 w-44 h-44" />
        <ScreenRecorder />
      </div>
    </div>
  );
};

export default Draw;
const Loader = () => (
  <div className="flex justify-center items-center">
    <svg
      className="animate-spin h-5 w-5 text-white dark:text-black"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4zm2 5.292A8.001 8.001 0 0112 4v8H6v5.292z"
      ></path>
    </svg>
  </div>
);
