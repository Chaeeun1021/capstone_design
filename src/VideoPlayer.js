
import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-contrib-hls';
import './VideoPlayer.css'; // CSS 파일을 임포트

const VideoPlayer = ({ src, coordinates }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [overlayData, setOverlayData] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    const initPlayer = () => {
      if (videoRef.current) {
        const options = {
          autoplay: true,
          controls: false,
          sources: [{
            src: `${src}?timestamp=${new Date().getTime()}`, // 타임스탬프 추가
            type: 'application/x-mpegURL' // HLS 스트리밍 타입
          }]
        };

        const player = videojs(videoRef.current, options, () => {
          console.log('Player is ready');
        });

        playerRef.current = player;

        player.on('loadedmetadata', () => {
          const videoElement = player.el().querySelector('video');
          const videoWidth = videoElement.videoWidth;
          const videoHeight = videoElement.videoHeight;
          const containerWidth = videoElement.clientWidth;
          const containerHeight = videoElement.clientHeight;

          // 비디오 중앙 위치 계산
          const scale = Math.min(containerWidth / videoWidth, containerHeight / videoHeight);
          const actualVideoWidth = videoWidth * scale;
          const actualVideoHeight = videoHeight * scale;

          const offsetX = (containerWidth - actualVideoWidth) / 2;
          const offsetY = (containerHeight - actualVideoHeight) / 2;

          // 좌표 기반 오버레이 위치 설정
          if (coordinates) {
            const overlayPosition = {
              x: coordinates.x + offsetX,
              y: coordinates.y + offsetY,
              width: coordinates.width,
              height: coordinates.height,
            };

            console.log('Overlay Position:', overlayPosition);
            setOverlayData(overlayPosition);
          }
        });

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

  useEffect(() => {
    if (coordinates) {
      // 좌표가 변경될 때 오버레이 설정
      const overlayPosition = {
        x: coordinates.x,
        y: coordinates.y,
        width: coordinates.width,
        height: coordinates.height,
      };

      console.log('Updated Overlay Position:', overlayPosition);
      setOverlayData(overlayPosition);

      // 이전 타이머가 있다면 클리어
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // 새로운 타이머 설정
      const newTimeoutId = setTimeout(() => {
        setOverlayData(null);
      }, 5000);
      
      setTimeoutId(newTimeoutId); // 타이머 ID 저장
    }

    // 좌표가 변경될 때마다 클리어할 타이머가 필요한 경우, 클린업 함수 추가
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };

  }, [coordinates]);

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

