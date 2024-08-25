import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import VideoPlayer from './VideoPlayer'; // VideoPlayer 임포트

function PastDataViewer() {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [selectedStartTime, setSelectedStartTime] = useState('00:00:00'); // 초까지 추가
  const [selectedEndTime, setSelectedEndTime] = useState('23:59:59'); // 초까지 추가
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serverStartTime, setServerStartTime] = useState(null); // 서버 시작 시간 상태

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

    // 날짜를 yyyy-MM-dd 형식으로 변환
    const startDate = selectedStartDate.toISOString().split('T')[0];
    const endDate = selectedEndDate.toISOString().split('T')[0];

    // 시간이 정확히 초 단위까지 포함되도록
    const startTime = selectedStartTime.includes(':') ? selectedStartTime : `${selectedStartTime}:00`;
    const endTime = selectedEndTime.includes(':') ? selectedEndTime : `${selectedEndTime}:00`;

    // API 요청 보내기
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
        setDataList(response.data);
        setLoading(false);

        if (response.data.length > 0) {
          const firstItem = response.data[0];
          setServerStartTime(new Date(firstItem.serverStartTime).getTime() || null); // 서버 시작 시간 설정
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  const handleTimeUpdate = (timestamp) => {
    console.log('Video Timestamp:', timestamp);
  };

  return (
    <div className="layout-wrapper">
      <div className="video-container">
        <VideoPlayer 
          src="http://4.217.235.155/stream/index.m3u8" // 하드코딩된 비디오 URL
          onTimeUpdate={handleTimeUpdate}
          serverStartTime={serverStartTime}
        />
      </div>

      <div className="left-panel">
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
            className="custom-timepicker"
          />
        </div>

        <div className="datetime-picker">
          <label>종료 시간:</label>
          <input
            type="time"
            value={selectedEndTime}
            onChange={(e) => setSelectedEndTime(e.target.value)}
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
