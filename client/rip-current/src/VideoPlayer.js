import React, { useEffect, useRef, useState, memo } from 'react';
import videojs from 'video.js';
import Hls from 'hls.js';
import 'video.js/dist/video-js.css';
import './VideoPlayer.css';

const VideoPlayer = memo(({ src, coordinates = [], showOverlay }) => {
  const videoRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });
  const originalVideoWidth = 1920; // 비디오 원본 해상도 너비
  const originalVideoHeight = 1080; // 비디오 원본 해상도 높이

  // 비디오 메타데이터가 로드될 때 비디오 크기 업데이트
  const updateVideoDimensions = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const { width, height } = videoElement.getBoundingClientRect();
      setVideoDimensions({
        width,
        height,
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
      muted: true,
      fluid: true,
      preload: 'auto',
    });

    setPlayer(playerInstance);

    return () => {
      if (playerInstance) {
        playerInstance.dispose();
      }
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  // 좌표 스케일링 함수
  const scaleCoordinates = (points) => {
    const { width: videoWidth, height: videoHeight } = videoDimensions;

    if (videoWidth === 0 || videoHeight === 0) {
      return points; // 비디오 크기를 알 수 없을 때는 좌표를 변환하지 않음
    }

    const scaleX = videoWidth / originalVideoWidth;
    const scaleY = videoHeight / originalVideoHeight;

    // 약간의 오프셋 보정 실제 박스보다 높게 표시되어서 30으로 보정하면 딱맞음
    const yOffset = 30; // Y축 보정값, 높이가 너무 높게 나타나면 이 값을 조정

    return points.map(({ x, y }) => ({
      x: x * scaleX,
      y: y * scaleY + yOffset, // 오프셋 보정 적용
    }));
  };

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
        {showOverlay && coordinates.length > 0 && (
          <div className="overlay">
            {coordinates.map((box, index) => {
              const scaledBox = scaleCoordinates(box);
              const top = `${scaledBox[0].y}px`;
              const left = `${scaledBox[0].x}px`;
              const width = `${scaledBox[1].x - scaledBox[0].x}px`;
              const height = `${scaledBox[2].y - scaledBox[0].y}px`;

              return (
                <div
                  key={index}
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
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

export default VideoPlayer;
