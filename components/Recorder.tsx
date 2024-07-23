"use client";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const ScreenRecorder = () => {
  const screenRecording = useRef<HTMLVideoElement | null>(null);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [displayMedia, setDisplayMedia] = useState<MediaStreamTrack | null>(
    null
  );
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null); // State to store Cloudinary video URL

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

  // Function to handle uploading recordedBlob to Cloudinary
  const uploadToCloudinary = async () => {
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
  };

  return (
    <div>
      <Button onClick={() => startScreenRecording()}>Start Recording</Button>
      <Button onClick={() => recorder && recorder.stop()}>
        Stop Recording
      </Button>
      {videoUrl && (
        <video ref={screenRecording} height={300} width={600} controls>
          <source src={videoUrl} type="video/webm" />
          Your browser does not support the video tag.
        </video>
      )}
      {recordedBlob && (
        <Button onClick={() => uploadToCloudinary()}>
          Upload to Cloudinary
        </Button>
      )}
    </div>
  );
};

export default ScreenRecorder;
