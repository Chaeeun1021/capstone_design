import React from 'react';

function Timeline({ coordinateReceivedTime, currentKSTTime }) {
  return (
    <div>
      <h3>Timeline Component</h3>
      <p>좌표 수신 시간: {coordinateReceivedTime || '수신 대기 중'}</p>
      <p>현재 KST 시간: {currentKSTTime || '로딩 중'}</p>
    </div>
  );
}

export default Timeline;
