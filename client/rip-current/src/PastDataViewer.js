import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

function PastDataViewer() {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState('00:00:00');
  const [selectedEndTime, setSelectedEndTime] = useState('23:59:59');
  const [dataList, setDataList] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [loading, setLoading] = useState(false);

  const imageSrc = "/beach2.PNG"; // public 폴더의 beach2.PNG 이미지
  const canvasRef = useRef(null);

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

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    coordinates.forEach(({ topLeft, bottomRight }) => {
      const x = topLeft.x * canvas.width / 1920;
      const y = topLeft.y * canvas.height / 1080;
      const width = (bottomRight.x - topLeft.x) * canvas.width / 1920;
      const height = (bottomRight.y - topLeft.y) * canvas.height / 1080;

      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
    });
  }, [coordinates]);

  return (
    <div className="layout-wrapper">
      <div className="image-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
        <div style={{ position: 'relative' }}>
          <img src={imageSrc} alt="Beach Scene" width="1920" height="1080" />
          <canvas
            ref={canvasRef}
            width="1920"
            height="1080"
            style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
          />
        </div>
      </div>

      {/* 텍스트 영역을 이미지 아래로 이동 */}
      <div className="left-panel" style={{ paddingTop: '20px', textAlign: 'center' }}>
        <h2>과거 데이터 조회</h2>
        <p>날짜와 시간을 선택하고 데이터를 조회하세요.</p>

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

        <div className="date-range-info">
          <h3>선택한 날짜 범위:</h3>
          <p>시작 날짜: {selectedStartDate ? selectedStartDate.toLocaleDateString() : '선택되지 않음'}</p>
          <p>종료 날짜: {selectedEndDate ? selectedEndDate.toLocaleDateString() : '선택되지 않음'}</p>
          <p>시작 시간: {selectedStartTime}</p>
          <p>종료 시간: {selectedEndTime}</p>
        </div>

        <div className="data-list">
          <h3>기간 내 발생 데이터 정보</h3>
          {loading ? (
            <p>데이터를 불러오는 중...</p>
          ) : (
            <ul>
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
      </div>
    </div>
  );
}

export default PastDataViewer;
