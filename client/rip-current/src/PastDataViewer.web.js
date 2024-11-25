import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './PastDataViewer.web.css';
import axios from 'axios';

function PastDataViewer() {
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState('00:00:00');
  const [selectedEndTime, setSelectedEndTime] = useState('23:59:59');
  const [coordinates, setCoordinates] = useState([]);
  const [scaledCoordinates, setScaledCoordinates] = useState([]);
  const [loading, setLoading] = useState(false);

  const imageRef = useRef(null);
  const imageSrc = '/beach_past.JPG'; // 이미지 경로
  const originalImageWidth = 1920;
  const originalImageHeight = 1080;

  const handleFetchData = () => {
    if (!selectedStartDate || !selectedEndDate) {
      alert('날짜를 선택하세요!');
      return;
    }

    if (selectedStartDate > selectedEndDate) {
      alert('시작 날짜는 종료 날짜보다 먼저여야 합니다.');
      return;
    }

    setLoading(true);

    const offset = selectedStartDate.getTimezoneOffset() * 60000;
    const startDate = new Date(selectedStartDate.getTime() - offset).toISOString().split('T')[0];
    const endDate = new Date(selectedEndDate.getTime() - offset).toISOString().split('T')[0];

    const startTime = (selectedStartTime.split(':').length === 2 ? `${selectedStartTime}:00` : selectedStartTime);
    const endTime = (selectedEndTime.split(':').length === 2 ? `${selectedEndTime}:00` : selectedEndTime);

    axios
      .get('https://port-0-rip-lyuhc4uac61f92ea.sel4.cloudtype.app/ripList/period', {
        params: {
          start_date: startDate,
          start_time: startTime,
          end_date: endDate,
          end_time: endTime,
        },
      })
      .then((response) => {
        const responseData = response.data;

        const newCoordinates = responseData.flatMap((item) => {
          if (typeof item.drawing === 'string') {
            try {
              const parsedDrawing = JSON.parse(item.drawing);
              if (Array.isArray(parsedDrawing) && parsedDrawing.length === 4) {
                const [topLeft, , bottomRight] = parsedDrawing;
                return [
                  {
                    topLeft: { x: topLeft[0], y: topLeft[1] },
                    bottomRight: { x: bottomRight[0], y: bottomRight[1] },
                  },
                ];
              }
            } catch (error) {
              console.error('Error parsing drawing:', error);
              return [];
            }
          }
          return [];
        });

        setCoordinates(newCoordinates);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    const scaleCoordinates = () => {
      if (!imageRef.current) return;

      const { width: displayedWidth, height: displayedHeight } = imageRef.current.getBoundingClientRect();

      // 이미지 렌더링 영역에서 실제 스케일링 비율 계산
      const xScale = displayedWidth / originalImageWidth;
      const yScale = displayedHeight / originalImageHeight;

      const newScaledCoordinates = coordinates.map(({ topLeft, bottomRight }) => ({
        topLeft: {
          x: topLeft.x * xScale,
          y: topLeft.y * yScale,
        },
        bottomRight: {
          x: bottomRight.x * xScale,
          y: bottomRight.y * yScale,
        },
      }));

      setScaledCoordinates(newScaledCoordinates);
    };

    scaleCoordinates();
    window.addEventListener('resize', scaleCoordinates);

    return () => {
      window.removeEventListener('resize', scaleCoordinates);
    };
  }, [coordinates]);

  return (
    <div className="layout-wrapper">
      <div className="image-container">
        <img
          ref={imageRef}
          src={imageSrc}
          alt="Beach Scene"
          className="responsive-image"
        />
        <svg
          className="svg-overlay"
          viewBox={`0 0 ${originalImageWidth} ${originalImageHeight}`}
          preserveAspectRatio="none"
        >
          {scaledCoordinates.map(({ topLeft, bottomRight }, index) => (
            <rect
              key={index}
              x={topLeft.x}
              y={topLeft.y}
              width={bottomRight.x - topLeft.x}
              height={bottomRight.y - topLeft.y}
              stroke="red"
              strokeWidth="2"
              fill="none"
            />
          ))}
        </svg>
      </div>

      <div className="left-panel">
        <h2>과거 데이터 조회</h2>

        <div className="datetime-picker">
          <label>시작 날짜:</label>
          <DatePicker
            selected={selectedStartDate}
            onChange={(date) => setSelectedStartDate(date)}
            dateFormat="yyyy-MM-dd"
          />
        </div>

        <div className="datetime-picker">
          <label>종료 날짜:</label>
          <DatePicker
            selected={selectedEndDate}
            onChange={(date) => setSelectedEndDate(date)}
            dateFormat="yyyy-MM-dd"
          />
        </div>

        <div className="datetime-picker">
          <label>시작 시간:</label>
          <input
            type="time"
            value={selectedStartTime}
            onChange={(e) => setSelectedStartTime(e.target.value)}
          />
        </div>

        <div className="datetime-picker">
          <label>종료 시간:</label>
          <input
            type="time"
            value={selectedEndTime}
            onChange={(e) => setSelectedEndTime(e.target.value)}
          />
        </div>

        <button
          onClick={handleFetchData}
          disabled={loading}
          className="custom-button"
        >
          {loading ? '데이터 불러오는 중...' : '데이터 조회'}
        </button>
      </div>
    </div>
  );
}

export default PastDataViewer;
