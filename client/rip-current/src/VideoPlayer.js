import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-hls';
import './VideoPlayer.css'; // CSS 파일을 임포트

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [overlayData, setOverlayData] = useState(null);

  useEffect(() => {
    const mockData = {
      x: 100,
      y: 400,
      width: 70,
      height: 100
    };
    setOverlayData(mockData);

    const showOverlay = () => {
      setOverlayData(mockData);
      setTimeout(() => {
        setOverlayData(null);
      }, 5000); // Remove overlay after 5 seconds
    };

    showOverlay();

    const initPlayer = () => {
      if (videoRef.current) {
        const options = {
          autoplay: true,
          controls: true,
          sources: [{
            src: `${src}?timestamp=${new Date().getTime()}`, // 타임스탬프 추가
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
    <div className="video-container">
      <video ref={videoRef} className="video-js vjs-default-skin vjs-big-play-centered" playsInline></video>
      {overlayData && (
        <div className="overlay">
          <div
            className="overlay-box"
            style={{
              top: `${overlayData.y}px`,
              left: `${overlayData.x}px`,
              width: `${overlayData.width}px`,
              height: `${overlayData.height}px`,
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
