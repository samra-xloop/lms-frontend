import { faCirclePlay } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

const SingleVideo = ({video, videoCompletion, setVideoCompletion, handleLessonSelect}) => {
    const [videoProgress, setVideoProgress] = useState(video.video_completed)
    useEffect(() => {
      if(videoCompletion){
        setVideoProgress(videoCompletion);
      }
    },[videoCompletion])
  return (
    <div>
      <div
        className="lesson-title"
        key={video.id}
        onClick={(e) => {
          handleLessonSelect(video);
        }}
      >
        <input
          className="checkbox"
          type="checkbox"
          id={`lesson-${video.id}`}
          name="lesson"
          // value={`lesson-${unit.id}`}
          value={video.video_completed}
          checked={videoProgress}
        />
        <FontAwesomeIcon
          icon={faCirclePlay}
          className="my-icon"
          style={{ marginTop: "3px" }}
        />

        <li>{video.title}</li>
      </div>
    </div>
  );
};

export default SingleVideo;