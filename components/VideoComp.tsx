import React from "react";
import { Sequence, Video } from "remotion";

type VideoProps = {
  introUrl: string;
  outroUrl: string;
  videoUrl: string;
};

export const VideoComposition: React.FC<VideoProps> = ({
  introUrl,
  outroUrl,
  videoUrl,
}) => {
  console.log("--", introUrl, outroUrl, videoUrl);
  return (
    <div>
      <Sequence from={0} durationInFrames={150}>
        <Video src={introUrl} />
      </Sequence>
      <Sequence from={150} durationInFrames={450}>
        <Video src={videoUrl} />
      </Sequence>
      <Sequence from={450} durationInFrames={150}>
        <Video src={outroUrl} />
      </Sequence>
    </div>
  );
};
