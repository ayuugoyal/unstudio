import React from "react";
import { Composition } from "remotion";
import FinalVid from "./FinalVid";

interface VideoCompositionProps {
  introUrl: string;
  outroUrl: string;
  videoUrl: string;
}

const VideoComposition: React.FC<VideoCompositionProps> = ({
  introUrl,
  outroUrl,
  videoUrl,
}) => {
  console.log("--", introUrl, outroUrl, videoUrl);
  return (
    <div>
      <Composition
        id="VideoComposition"
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
        component={FinalVid as any}
        defaultProps={{
          introVideo: introUrl,
          outroVideo: outroUrl,
          videoUrl: videoUrl,
        }}
      />
    </div>
  );
};

export default VideoComposition;
