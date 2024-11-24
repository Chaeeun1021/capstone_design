import React, { useEffect, useRef, useState, memo, useCallback } from 'react';
import videojs from 'video.js';
import Hls from 'hls.js';
import 'video.js/dist/video-js.css';
import './VideoPlayer.css';

const VideoPlayer = memo(({ src, coordinates = [], showOverlay, syncTimestamp }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const playerRef = useRef(null);
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });
  const [overlayCoordinates, setOverlayCoordinates] = useState(coordinates);
  const originalVideoWidth = 1920;
  const originalVideoHeight = 1080;

  // 비디오 크기 업데이트 함수
  const updateVideoDimensions = useCallback(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const { width, height } = videoElement.getBoundingClientRect();
      setVideoDimensions({ width, height });
    }
  }, []);

  // 오버레이 좌표가 변경될 때만 업데이트
  useEffect(() => {
    setOverlayCoordinates(coordinates);
  }, [coordinates]);

  // Hls.js와 video.js 초기화
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (!hlsRef.current && !playerRef.current) {
      // Hls.js 설정
      hlsRef.current = new Hls();
      hlsRef.current.loadSource(src);
      hlsRef.current.attachMedia(videoElement);

      hlsRef.current.on(Hls.Events.MANIFEST_PARSED, () => {
        videoElement.play();
        updateVideoDimensions();
      });

      hlsRef.current.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS.js Error:', data);
      });

      // video.js 설정
      playerRef.current = videojs(videoElement, {
        controls: true,
        autoplay: true,
        muted: true,
        fluid: true,
        preload: 'auto',
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src, updateVideoDimensions]);

  // 동기화 타임스탬프 적용
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && syncTimestamp) {
      const syncTime = new Date(syncTimestamp).getTime();
      const currentTime = Date.now();
      const delay = Math.max(0, (syncTime - currentTime) / 1000);

      console.log(`동기화를 위해 ${delay}초 대기 후 재생 위치로 이동합니다.`);
      setTimeout(() => {
        videoElement.play();
        updateVideoDimensions();
      }, delay * 1000);
    }
  }, [syncTimestamp, updateVideoDimensions]);

  const scaleCoordinates = useCallback(
    (points) => {
      const { width: videoWidth, height: videoHeight } = videoDimensions;
      if (videoWidth === 0 || videoHeight === 0) {
        return points;
      }

      const scaleX = videoWidth / originalVideoWidth;
      const scaleY = videoHeight / originalVideoHeight;
      const yOffset = 20;

      return points.map(({ x, y }) => ({
        x: x * scaleX,
        y: y * scaleY + yOffset,
      }));
    },
    [videoDimensions]
  );

  return (
    <div className="video-container" style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div className="video-wrapper" style={{ position: 'relative', width: '100%', height: '100%' }}>
        <video
          ref={videoRef}
          className="video-js vjs-default-skin vjs-big-play-centered"
          controls
          playsInline
          style={{ width: '100%', height: 'auto' }}
        />
        {showOverlay && overlayCoordinates.length > 0 && (
          <div className="overlay">
            {overlayCoordinates.map((item, index) => {
              const scaledBox = scaleCoordinates(item.coordinates);
              const top = `${scaledBox[0].y}px`;
              const left = `${scaledBox[0].x}px`;
              const width = `${scaledBox[1].x - scaledBox[0].x}px`;
              const height = `${scaledBox[2].y - scaledBox[0].y}px`;

              return (
                <div key={index} style={{ position: 'relative' }}>
                  <div
                    className="box active"
                    style={{
                      top,
                      left,
                      width,
                      height,
                      position: 'absolute',
                      border: '2px solid red',
                    }}
                  ></div>
                  <span
                    style={{
                      position: 'absolute',
                      top: `${scaledBox[0].y - 20}px`,
                      left: `${scaledBox[0].x}px`,
                      color: 'white',
                      backgroundColor: 'black',
                      padding: '2px 5px',
                      borderRadius: '3px',
                      fontSize: '12px',
                    }}
                  >
                    {`Confidence: ${item.confidence_score.toFixed(2)}`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

export default VideoPlayer;
