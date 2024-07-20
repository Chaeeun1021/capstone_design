import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-hls';

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const initPlayer = () => {
      if (videoRef.current) {
        const options = {
          autoplay: true,
          controls: true,
          sources: [{
            src: src,
            type: 'application/x-mpegURL' // HLS 스트리밍 타입
          }]
        };

        const player = videojs(videoRef.current, options, () => {
          console.log('Player is ready');
        });

        playerRef.current = player;

        return () => {
          if (playerRef.current) {
            playerRef.current.dispose();
            console.log('Player disposed');
          }
        };
      }
    };

    initPlayer();

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        console.log('Player disposed');
      }
    };

  }, [src]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-default-skin vjs-big-play-centered" playsInline></video>
    </div>
  );
};

export default VideoPlayer;
