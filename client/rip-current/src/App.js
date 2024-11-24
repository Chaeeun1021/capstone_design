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
  const [coordinates, setCoordinates] = useState([]); // Bounding box + confidence_score 상태
  const [coordinateReceivedTime, setCoordinateReceivedTime] = useState(null);
  const [currentKSTTime, setCurrentKSTTime] = useState(null);
  const clientRef = useRef(null);

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
              const newCoordinates = data.drawing.map((item) => ({
                coordinates: item.coordinates.map((point) => ({ x: point[0], y: point[1] })), // Bounding box 좌표
                confidence_score: item.confidence_score, // Confidence score 추가
              }));
              setCoordinates(newCoordinates);
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
        },
      });

      clientRef.current.activate();
    }
  };

  const startDetection = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/start', {
        method: 'POST',
      });
      if (response.ok) {
        console.log('Detection started successfully');
      } else {
        console.error('Failed to start detection:', await response.json());
      }
    } catch (error) {
      console.error('Error starting detection:', error);
    }
  };

  useEffect(() => {
    // 웹소켓 연결
    connectWebSocket();

    // 현재 시간 업데이트
    updateKSTTime();
    const interval = setInterval(updateKSTTime, 1000);

    // /start API 호출
    startDetection();

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
        console.log('WebSocket connection closed on cleanup.');
      }
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <ul>
            <li>
              <NavLink to="/app/alert" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
                실시간 알림
              </NavLink>
            </li>
            <li>
              <NavLink to="/app" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })} end>
                실시간 영상
              </NavLink>
            </li>
            <li>
              <NavLink to="/app/pastData" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
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
                coordinates={coordinates} // 수정된 데이터 구조 전달
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
  );
}

export default App;
