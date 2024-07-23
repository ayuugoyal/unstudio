"use client";
import React from "react";
import { Sequence, Video } from "remotion";

interface VideoProps {
  introVideo: string;
  outroVideo: string;
  videoUrl: string;
}

const FinalVid: React.FC<VideoProps> = ({
  introVideo,
  outroVideo,
  videoUrl,
}) => {
  console.log("segashbabhhkbkj", introVideo, outroVideo, videoUrl);
  return (
    <div>
      <Sequence from={0} durationInFrames={150}>
        <Video src={introVideo} />
      </Sequence>
      <Sequence from={150} durationInFrames={450}>
        <Video src={videoUrl} />
      </Sequence>
      <Sequence from={450} durationInFrames={150}>
        <Video src={outroVideo} />
      </Sequence>
    </div>
  );
};

export default FinalVid;
