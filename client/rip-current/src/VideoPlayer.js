import React, { useEffect, useRef, useState, memo } from 'react';
import videojs from 'video.js';
import Hls from 'hls.js';
import 'video.js/dist/video-js.css';
import './VideoPlayer.css';

const VideoPlayer = memo(({ src, coordinates = [], onTimeUpdate, showOverlay }) => {
  const videoRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });

  // 비디오 메타데이터가 로드될 때 비디오 크기 업데이트
  const updateVideoDimensions = () => {
    const videoElement = videoRef.current;
    if (videoElement && videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
      setVideoDimensions({
        width: videoElement.videoWidth,
        height: videoElement.videoHeight,
      });
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    let hls;
    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoElement);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoElement.play();
        updateVideoDimensions(); // 메타데이터가 로드되면 비디오 크기 업데이트
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS.js Error:', data);
      });
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.src = src;
      videoElement.addEventListener('loadedmetadata', () => {
        videoElement.play();
        updateVideoDimensions(); // 메타데이터가 로드되면 비디오 크기 업데이트
      });
    } else {
      console.error('HLS is not supported in this browser.');
    }

    const playerInstance = videojs(videoElement, {
      controls: true,
      autoplay: true,
      muted: true, // 자동 재생 허용을 위한 음소거
      fluid: true,
      preload: 'auto',
    });

    setPlayer(playerInstance);

    const handleTimeUpdate = () => {
      if (!playerInstance) return;
      const currentTime = playerInstance.currentTime();
      const currentDate = new Date(currentTime * 1000);

      const timestamp = currentDate
        .toISOString()
        .replace(/[-:T]/g, '')
        .split('.')[0];
      const formattedTimestamp = `${timestamp.slice(0, 8)}_${timestamp.slice(8)}`;

      onTimeUpdate(formattedTimestamp);
    };

    playerInstance.on('timeupdate', handleTimeUpdate);

    // 정리 작업
    return () => {
      if (playerInstance) {
        playerInstance.dispose();
      }
      if (hls) {
        hls.destroy();
      }
    };
  }, [src, onTimeUpdate]);

  // 좌표 스케일링 함수
  const scaleCoordinates = (points) => {
    const { width: videoWidth, height: videoHeight } = videoDimensions;
    const container = videoRef.current?.getBoundingClientRect();

    if (!container || videoWidth === 0 || videoHeight === 0) {
      return points;
    }

    const scaleX = container.width / videoWidth;
    const scaleY = container.height / videoHeight;

    return points.map(({ x, y }) => ({
      x: x * scaleX,
      y: y * scaleY,
    }));
  };

  return (
    <div className="video-container">
      <div className="video-wrapper">
        <video
          ref={videoRef}
          className="video-js vjs-default-skin vjs-big-play-centered"
          controls
          playsInline
        />
        {showOverlay && coordinates.length > 0 && (
          <div className="overlay">
            {coordinates.map((box, index) => {
              const scaledBox = scaleCoordinates(box);
              return (
                <svg key={index} style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}>
                  <polygon
                    points={scaledBox.map(p => `${p.x},${p.y}`).join(' ')}
                    style={{
                      fill: 'none',
                      stroke: 'red',
                      strokeWidth: 2,
                    }}
                  />
                </svg>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

export default VideoPlayer;
