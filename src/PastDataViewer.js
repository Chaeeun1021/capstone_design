import React, { useState, useEffect } from 'react';
import './PastDataViewer.css'; // CSS 파일을 임포트
import DateRangePicker from './DateRangePicker'; // DateRangePicker 컴포넌트 임포트
import { Client } from '@stomp/stompjs'; // 웹소켓을 사용하기 위한 stompjs 임포트

function PastDataViewer() {
  const [selectedRange, setSelectedRange] = useState({ startDate: null, endDate: null });
  const [dataList, setDataList] = useState([]); // 서버에서 가져온 데이터를 저장할 상태
  const [loading, setLoading] = useState(false); // 데이터 로딩 상태
  const [client, setClient] = useState(null); // 웹소켓 클라이언트

  const handleDateChange = (range) => {
    setSelectedRange(range);
    console.log('Selected Date Range:', range);
  };

  const fetchDataViaWebSocket = (startDate, endDate) => {
    if (client) {
      const requestData = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      };
      client.publish({
        destination: '/app/requestData', // 서버에서 처리할 경로
        body: JSON.stringify(requestData),
      });
    }
  };

  useEffect(() => {
    const stompClient = new Client({
      brokerURL: 'ws://port-0-rip-lyuhc4uac61f92ea.sel4.cloudtype.app/ws', // 웹소켓 서버 주소
      onConnect: () => {
        console.log('Connected to WebSocket');
        stompClient.subscribe('/topic/dataResponse', (message) => {
          const data = JSON.parse(message.body);
          console.log('Received data:', data);
          setDataList(data); // 받은 데이터를 상태에 저장
          setLoading(false); // 로딩 상태 비활성화
        });
      },
      onStompError: (frame) => {
        console.error('Error:', frame.headers['message']);
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const handleFetchData = () => {
    if (selectedRange.startDate && selectedRange.endDate) {
      setLoading(true); // 로딩 상태 활성화
      fetchDataViaWebSocket(selectedRange.startDate, selectedRange.endDate); // 웹소켓을 통해 데이터 요청
    } else {
      alert("날짜 범위를 선택하세요!"); // 날짜가 선택되지 않았을 때 경고
    }
  };

  return (
    <div className="layout-wrapper">
      {/* 이미지 섹션 */}
      <div className="image-container">
        <img src={`${process.env.PUBLIC_URL}/beach.PNG`} alt="Beach" />
      </div>

      {/* 패널을 나란히 배치하는 래퍼 */}
      <div className="panel-wrapper">
        {/* 왼쪽에 날짜 선택과 조회 버튼 */}
        <div className="left-panel">
          <h2>과거 데이터 조회</h2>
          <p>날짜를 선택하고 데이터를 조회하세요.</p>

          <DateRangePicker onDateChange={handleDateChange} />

          <div>
            <p>선택한 날짜 범위:</p>
            <p>
              시작 날짜: {selectedRange.startDate ? selectedRange.startDate.toLocaleDateString() : '선택되지 않음'}
            </p>
            <p>
              종료 날짜: {selectedRange.endDate ? selectedRange.endDate.toLocaleDateString() : '선택되지 않음'}
            </p>
          </div>

          <button onClick={handleFetchData} disabled={loading}>
            {loading ? "데이터 불러오는 중..." : "데이터 조회"}
          </button>
        </div>

        {/* 오른쪽에 데이터 정보 표시 */}
        <div className="right-panel">
          <div className="data-list">
            <h3>기간내 발생 데이터 정보</h3>
            {loading ? (
              <p>데이터를 불러오는 중...</p>
            ) : (
              <ul>
                {dataList.length > 0 ? (
                  dataList.map((item, index) => (
                    <li key={index}>
                      {index + 1}. {item.timestamp} ({item.coordinates.join(', ')})
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
    </div>
  );
}

export default PastDataViewer;
