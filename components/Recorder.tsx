"use client";

import { useReactMediaRecorder } from "react-media-recorder";
import { Button } from "./ui/button";
import { useEffect } from "react";

const Recorder = () => {
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ screen: true });

  useEffect(() => {
    if (status === "stopped") {
      console.log(mediaBlobUrl);
    }
  }, [mediaBlobUrl]);

  return (
    <div>
      <p>{status}</p>
      <Button onClick={startRecording}>Start Recording</Button>
      <Button onClick={stopRecording}>Stop Recording</Button>
      {mediaBlobUrl && <video src={mediaBlobUrl} controls autoPlay loop />}
    </div>
  );
};

export default Recorder;
