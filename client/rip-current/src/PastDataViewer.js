import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import './PastDataViewer.css'

function PastDataViewer() {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState('00:00:00');
  const [selectedEndTime, setSelectedEndTime] = useState('23:59:59');
  const [dataList, setDataList] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [loading, setLoading] = useState(false);

  const imageSrc = "/beach2.PNG"; // 이미지 경로
  const canvasRef = useRef(null);
  const imageContainerRef = useRef(null);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageContainer = imageContainerRef.current;

    // 이미지 컨테이너의 크기 계산
    const containerWidth = imageContainer.offsetWidth;
    const containerHeight = imageContainer.offsetHeight;

    // 캔버스 크기 조정
    canvas.width = containerWidth;
    canvas.height = containerHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 원본 이미지 크기 (1920x1080)
    const originalWidth = 1920;
    const originalHeight = 1080;

    // 크기 비율 계산
    const widthRatio = containerWidth / originalWidth;
    const heightRatio = containerHeight / originalHeight;

    coordinates.forEach(({ topLeft, bottomRight }) => {
      // 좌표 변환
      const x = topLeft.x * widthRatio;
      const y = topLeft.y * heightRatio;
      const width = (bottomRight.x - topLeft.x) * widthRatio;
      const height = (bottomRight.y - topLeft.y) * heightRatio;

      // 사각형 그리기
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
    });
  }, [coordinates]);

  return (
    <div className="layout-wrapper">
      <div className="image-container" ref={imageContainerRef}>
        <img src={imageSrc} alt="Beach Scene" className="responsive-image" />
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
      </div>

      <div className="left-panel">
        <h2>과거 데이터 조회</h2>
        <div className="datetime-picker">
          <label>시작 날짜:</label>
          <DatePicker
            selected={selectedStartDate}
            onChange={(date) => setSelectedStartDate(date)}
            dateFormat="yyyy-MM-dd"
            className="custom-datepicker"
            placeholderText="시작 날짜를 선택하세요"
          />
        </div>

        <div className="datetime-picker">
          <label>종료 날짜:</label>
          <DatePicker
            selected={selectedEndDate}
            onChange={(date) => setSelectedEndDate(date)}
            dateFormat="yyyy-MM-dd"
            className="custom-datepicker"
            placeholderText="종료 날짜를 선택하세요"
          />
        </div>

        <div className="datetime-picker">
          <label>시작 시간:</label>
          <input
            type="time"
            value={selectedStartTime}
            onChange={(e) => setSelectedStartTime(e.target.value)}
            timeFormat="HH:mm:ss"
            className="custom-timepicker"
          />
        </div>

        <div className="datetime-picker">
          <label>종료 시간:</label>
          <input
            type="time"
            value={selectedEndTime}
            onChange={(e) => setSelectedEndTime(e.target.value)}
            timeFormat="HH:mm:ss"
            className="custom-timepicker"
          />
        </div>

        <button onClick={handleFetchData} disabled={loading} className="custom-button">
          {loading ? '데이터 불러오는 중...' : '데이터 조회'}
        </button>

        <div className="data-list">
          <h3>기간 내 발생 데이터 정보</h3>
          {loading ? (
            <p>데이터를 불러오는 중...</p>
          ) : (
            <ul className="scrollable-list">
              {dataList.length > 0 ? (
                dataList.map((item, index) => (
                  <li key={index}>
                    {index + 1}. {item.dateTime} (Bounding Count: {item.boundingCount})
                  </li>
                ))
              ) : (
                <p>표시할 데이터가 없습니다.</p>
              )}
            </ul>
          )}
        </div>

        <button className="download-button">다운로드</button>
      </div>
    </div>
  );
}

export default PastDataViewer;
