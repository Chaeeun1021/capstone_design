// PastDataViewer.web.js
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './PastDataViewer.web.css'; // CSS 파일 가져오기
import axios from 'axios';

function PastDataViewer() {
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState('00:00:00');
  const [selectedEndTime, setSelectedEndTime] = useState('23:59:59');
  const [dataList, setDataList] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [loading, setLoading] = useState(false);

  const imageSrc = '/beach2.png'; // 웹에서는 URI 사용
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
                const [topLeft, topRight, bottomRight, bottomLeft] = parsedDrawing;
                return [{
                  topLeft: { x: topLeft[0], y: topLeft[1] },
                  bottomRight: { x: bottomRight[0], y: bottomRight[1] },
                }];
              }
            } catch (error) {
              console.error('Error parsing drawing:', error);
              return [];
            }
          } else if (Array.isArray(item.drawing) && item.drawing.length === 4) {
            const [topLeft, topRight, bottomRight, bottomLeft] = item.drawing;
            return [{
              topLeft: { x: topLeft[0], y: topLeft[1] },
              bottomRight: { x: bottomRight[0], y: bottomRight[1] },
            }];
          } else {
            console.error('Invalid drawing format:', item.drawing);
            return [];
          }
        });

        setCoordinates(newCoordinates);
        setDataList(responseData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  return (
    <div className="layout-wrapper">
      <div className="image-container">
        <img src={imageSrc} alt="Beach Scene" className="responsive-image" />
        {/* 웹에서 SVG 태그 사용 */}
        <svg
          className="svg-overlay"
          viewBox={`0 0 ${originalImageWidth} ${originalImageHeight}`}
        >
          {coordinates.map(({ topLeft, bottomRight }, index) => (
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
