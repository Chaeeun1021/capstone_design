import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import Hls from 'hls.js';
import 'video.js/dist/video-js.css';
import './VideoPlayer.css'; // CSS 파일 임포트

const VideoPlayer = ({ src, coordinates = [], onTimeUpdate, serverStartTime, showOverlay }) => {
  const videoRef = useRef(null);
  const [localStartTime, setLocalStartTime] = useState(null);
  const [player, setPlayer] = useState(null);
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0 });

  // 비디오 크기 업데이트 함수
  const updateVideoDimensions = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      setVideoDimensions({
        width: videoElement.videoWidth,
        height: videoElement.videoHeight,
      });
    }
  };

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    // HLS.js를 사용하여 HLS 스트림 처리
    let hls;
    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoElement);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoElement.play();
        updateVideoDimensions(); // 비디오의 원본 크기를 가져옴
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS.js Error:', data);
      });
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.src = src;
      videoElement.addEventListener('loadedmetadata', () => {
        videoElement.play();
        updateVideoDimensions(); // 비디오의 원본 크기를 가져옴
      });
    } else {
      console.error('HLS is not supported in this browser.');
    }

    // Video.js 초기화
    const playerInstance = videojs(videoElement, {
      controls: true,
      autoplay: true,
      muted: true,
      fluid: true,
      preload: 'auto',
    });

    setPlayer(playerInstance);

    // 비디오 재생 시간 업데이트 핸들러
    const handleTimeUpdate = () => {
      if (!localStartTime) return;
      const currentTime = playerInstance.currentTime();
      const currentDate = new Date(localStartTime + currentTime * 1000);

      const timestamp = currentDate
        .toISOString()
        .replace(/[-:T]/g, '')
        .split('.')[0];
      const formattedTimestamp = `${timestamp.slice(0, 8)}_${timestamp.slice(8)}`;

      onTimeUpdate(formattedTimestamp);
    };

    playerInstance.on('timeupdate', handleTimeUpdate);

    // 클린업 함수
    return () => {
      if (playerInstance) {
        playerInstance.dispose();
      }
      if (hls) {
        hls.destroy();
      }
    };
  }, [src, onTimeUpdate, serverStartTime, localStartTime]);

  // 비디오 크기에 맞춰 좌표를 스케일링하는 함수
  const scaleCoordinates = (box) => {
    const { width: videoWidth, height: videoHeight } = videoDimensions;
    const container = videoRef.current?.getBoundingClientRect();

    if (!container || videoWidth === 0 || videoHeight === 0) {
      return box;
    }

    // 비디오의 원본 크기 대비 현재 크기 비율 계산
    const scaleX = container.width / videoWidth;
    const scaleY = container.height / videoHeight;

    return {
      x: box.x * scaleX,
      y: box.y * scaleY,
      width: box.width * scaleX,
      height: box.height * scaleY,
    };
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
        {showOverlay && (
          <div className="overlay">
            {coordinates.map((box, index) => {
              const scaledBox = scaleCoordinates(box);
              return (
                <div
                  key={index}
                  className="box"
                  style={{
                    position: 'absolute',
                    left: `${scaledBox.x}px`,
                    top: `${scaledBox.y}px`,
                    width: `${scaledBox.width}px`,
                    height: `${scaledBox.height}px`,
                    border: '2px solid red',
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
