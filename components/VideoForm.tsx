"use client";
import { useState } from "react";
import VideoComposition from "./VideoComp";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const VideoForm: React.FC = () => {
  const [introFile, setIntroFile] = useState<File | null>(null);
  const [outroFile, setOutroFile] = useState<File | null>(null);
  const [videoLink, setVideoLink] = useState<string>("");

  const [loaded, setLoaded] = useState<boolean>(false);

  const [introUrl, setIntroUrl] = useState<string>("");
  const [outroUrl, setOutroUrl] = useState<string>("");

  const handleIntroFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIntroFile(file);
    }
  };

  const handleOutroFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOutroFile(file);
    }
  };

  const handleVideoLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoLink(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoaded(true);
    try {
      if (introFile) {
        const formData = new FormData();
        formData.append("video", introFile);
        const response = await fetch("/api/upload-video", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Uploaded to Cloudinary:", data);
          setIntroUrl(data.msg.secure_url);
        } else {
          console.error("Failed to upload to Cloudinary");
        }
      }
      if (outroFile) {
        const formData = new FormData();
        formData.append("video", outroFile);
        const response = await fetch("/api/upload-video", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Uploaded to Cloudinary:", data);
          setOutroUrl(data.msg.secure_url);
        } else {
          console.error("Failed to upload to Cloudinary");
        }
      }
    } catch (error) {
      console.error("Error rendering video:", error);
    }
    setLoaded(false);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col gap-1.5">
        <div>
          <Label>Upload Intro Video or Image:</Label>
          <Input
            type="file"
            accept="video/*, image/*"
            onChange={handleIntroFileChange}
          />
        </div>
        <div>
          <Label>Upload Outro Video or Image:</Label>
          <Input
            type="file"
            accept="video/*, image/*"
            onChange={handleOutroFileChange}
          />
        </div>
        <div>
          <Label>Link to Main Video Content:</Label>
          <Input
            className="w-full"
            type="text"
            value={videoLink}
            onChange={handleVideoLinkChange}
          />
        </div>
        <Button
          type="submit"
          disabled={
            loaded ||
            introFile === null ||
            outroFile === null ||
            videoLink === ""
          }
        >
          {loaded ? <Loader /> : "Generate Video"}
        </Button>
      </form>
      {introUrl && videoLink && outroUrl && (
        <VideoComposition
          introUrl={introUrl}
          videoUrl={videoLink}
          outroUrl={outroUrl}
        />
      )}
    </div>
  );
};

export default VideoForm;

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
