import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Route, NavLink, Routes } from 'react-router-dom';
import './App.css';
import VideoPlayer from './VideoPlayer';
import Alert from './Alert';
import Timeline from './Timeline';
import PastDataViewer from './PastDataViewer';
import { Client } from '@stomp/stompjs'; // STOMP 클라이언트 사용

function App() {
  const hlsStreamUrl = 'http://4.217.235.155/stream/index.m3u8'; // HLS 비디오 스트림 URL
  const [coordinates, setCoordinates] = useState([]); // 좌표 데이터
  const clientRef = useRef(null); // STOMP 클라이언트 인스턴스를 저장하는 ref

  // WebSocket 연결 함수
  const connectWebSocket = () => {
    if (!clientRef.current) {
      clientRef.current = new Client({
        brokerURL: 'ws://port-0-rip-lyuhc4uac61f92ea.sel4.cloudtype.app/ws', // WebSocket 서버 URL
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        onConnect: () => {
          console.log('WebSocket connection established.');

          // STOMP 메시지 구독
          clientRef.current.subscribe('/topic/ripData', (message) => {
            const data = JSON.parse(message.body);
            console.log('Received message:', data);

            if (data.drawing) {
              // 좌표 데이터 업데이트 (각 모서리 좌표로 변환)
              const newCoordinates = data.drawing.map((box) => {
                return [
                  { x: box[0][0], y: box[0][1] }, // Top-left
                  { x: box[1][0], y: box[1][1] }, // Top-right
                  { x: box[2][0], y: box[2][1] }, // Bottom-right
                  { x: box[3][0], y: box[3][1] }, // Bottom-left
                ];
              });

              setCoordinates(newCoordinates); // 좌표 업데이트
            }
          });
        },

        onStompError: (frame) => {
          console.error('Broker reported error: ' + frame.headers['message']);
          console.error('Additional details: ' + frame.body);
        },

        onWebSocketClose: (event) => {
          console.error('WebSocket connection closed: ', event);
        },

        onWebSocketError: (event) => {
          console.error('WebSocket error: ', event);
        }
      });

      clientRef.current.activate(); // WebSocket 연결 시작
    }
  };

  // WebSocket 연결 및 정리
  useEffect(() => {
    connectWebSocket();

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
        console.log('WebSocket connection closed on cleanup.');
      }
    };
  }, []); // 처음 렌더링 시 WebSocket 연결

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <ul>
              <li>
                <NavLink to="/alert" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
                  실시간 알림
                </NavLink>
              </li>
              <li>
                <NavLink to="/" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })} end>
                  실시간 영상
                </NavLink>
              </li>
              <li>
                <NavLink to="/pastData" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
                  과거 데이터 조회
                </NavLink>
              </li>
            </ul>
          </nav>
        </header>
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={<VideoPlayer
                src={hlsStreamUrl}
                coordinates={coordinates}
                showOverlay={true} // 오버레이 표시를 위한 prop
              />}
            />
            <Route path="/pastData" element={<PastDataViewer />} />
            <Route path="/alert" element={<Alert />} />
          </Routes>
        </main>
        <footer>
          <Timeline />
        </footer>
      </div>
    </Router>
  );
}

export default App;
