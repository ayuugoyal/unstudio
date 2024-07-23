"use client";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { Copy } from "lucide-react";
import { toast } from "./ui/use-toast";

const ScreenRecorder = () => {
  const screenRecording = useRef<HTMLVideoElement | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [displayMedia, setDisplayMedia] = useState<MediaStreamTrack | null>(
    null
  );
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  const startScreenRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: true,
      });

      const newRecorder = new MediaRecorder(stream);
      setRecorder(newRecorder);
      setDisplayMedia(stream.getVideoTracks()[0]);

      const chunks: BlobPart[] = [];
      newRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      newRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        if (screenRecording.current) {
          screenRecording.current.src = url;
        }
        if (displayMedia) {
          displayMedia.stop();
        }
      };

      newRecorder.start();
    } catch (error) {
      console.error("Error starting screen recording:", error);
    }
  };

  const uploadToCloudinary = async () => {
    setLoaded(true);
    try {
      if (!recordedBlob) {
        console.error("No recorded video available");
        return;
      }

      console.log("Uploading to Cloudinary...");

      const formData = new FormData();
      formData.append("video", recordedBlob, "recorded-video.webm");

      const response = await fetch("/api/upload-video", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Uploaded to Cloudinary:", data);
        setVideoUrl(data.msg.secure_url); // Save Cloudinary video URL to state
      } else {
        console.error("Failed to upload to Cloudinary");
      }
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
    }
    setLoaded(false);
  };

  return (
    <div className="flex flex-col gap-2 w-96">
      <Button onClick={() => startScreenRecording()}>Start Recording</Button>
      <Button onClick={() => recorder && recorder.stop()}>
        Stop Recording
      </Button>
      {recordedBlob && (
        <>
          <h1 className="text-xl font-bold mb-4 mt-3">Preview:</h1>
          <video ref={screenRecording} height={200} width={400} controls>
            <source src={URL.createObjectURL(recordedBlob)} type="video/webm" />
            Your browser does not support the video tag.
          </video>
          <Button onClick={() => uploadToCloudinary()} disabled={loaded}>
            {loaded ? <Loader /> : "Upload to Cloudinary"}
          </Button>
        </>
      )}

      {videoUrl && (
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold mb-4 mt-3">Uploaded Video:</h1>
          <video ref={screenRecording} height={200} width={400} controls>
            <source src={videoUrl} type="video/webm" />
            Your browser does not support the video tag.
          </video>
          <div className="flex gap-2">
            <Input type="text" value={videoUrl} />
            <Button
              size="icon"
              onClick={() => {
                navigator.clipboard.writeText(videoUrl);
                toast({
                  title: "Copied to clipboard",
                  description: "Video URL copied to clipboard",
                });
              }}
            >
              <Copy />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScreenRecorder;
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
