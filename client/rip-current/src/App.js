import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Route, NavLink, Routes } from 'react-router-dom';
import './App.css';
import VideoPlayer from './VideoPlayer';
import Alert from './Alert';
import Timeline from './Timeline';
import PastDataViewer from './PastDataViewer';
import { Client } from '@stomp/stompjs';

function App() {
  const hlsStreamUrl = 'https://capstone.koreacentral.cloudapp.azure.com/stream/index.m3u8';
  const [coordinates, setCoordinates] = useState([]);
  const [coordinateReceivedTime, setCoordinateReceivedTime] = useState(null);
  const [currentKSTTime, setCurrentKSTTime] = useState(null);
  const clientRef = useRef(null);

  // 한국 표준시 업데이트 함수
  const updateKSTTime = () => {
    const kstTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    setCurrentKSTTime(kstTime);
  };

  const connectWebSocket = () => {
    if (!clientRef.current) {
      clientRef.current = new Client({
        brokerURL: 'ws://port-0-rip-lyuhc4uac61f92ea.sel4.cloudtype.app/ws',
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        onConnect: () => {
          console.log('WebSocket connection established.');

          clientRef.current.subscribe('/topic/ripData', (message) => {
            const data = JSON.parse(message.body);
            console.log('Received message:', data);

            if (data.drawing) {
              const newCoordinates = data.drawing.map((box) => [
                { x: box[0][0], y: box[0][1] },
                { x: box[1][0], y: box[1][1] },
                { x: box[2][0], y: box[2][1] },
                { x: box[3][0], y: box[3][1] },
              ]);
              setCoordinates(newCoordinates);

              // 좌표 수신 시간 설정
              setCoordinateReceivedTime(data.date_time);
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

      clientRef.current.activate();
    }
  };

  useEffect(() => {
    connectWebSocket();
    updateKSTTime();
    const interval = setInterval(updateKSTTime, 1000); // 매초마다 현재 KST 업데이트

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
        console.log('WebSocket connection closed on cleanup.');
      }
      clearInterval(interval); // 컴포넌트 언마운트 시 KST 업데이트 멈춤
    };
  }, []);

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
              element={
                <VideoPlayer
                  src={hlsStreamUrl}
                  coordinates={coordinates}
                  showOverlay={true}
                />
              }
            />
            <Route path="/pastData" element={<PastDataViewer />} />
            <Route
              path="/alert"
              element={<Alert coordinates={coordinates} showOverlay={true} />}
            />
          </Routes>
          
        </main>
        <footer>
          <Timeline coordinateReceivedTime={coordinateReceivedTime} currentKSTTime={currentKSTTime} />
        </footer>
      </div>
    </Router>
  );
}

export default App;
