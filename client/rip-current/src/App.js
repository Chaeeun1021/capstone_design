import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';
import VideoPlayer from './VideoPlayer';
import Timeline from './Timeline';
import { Client } from '@stomp/stompjs';

function App() {
  const hlsStreamUrl = 'http://4.217.235.155/stream/index.m3u8'; // HLS 스트리밍 URL

  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://port-0-rip-lyuhc4uac61f92ea.sel4.cloudtype.app/ws', // 웹소켓 엔드포인트
      onConnect: () => {
        console.log('Connected');
        client.subscribe('/topic/ripData', (message) => {
          const data = JSON.parse(message.body);
          console.log('Received message:', data);

          const x = data.drawing[0][0][0] -(1920/2);
          const y = data.drawing[0][0][1] -(1080/2);
          const width = data.drawing[0][1][0] - data.drawing[0][0][0];
          const height = data.drawing[0][3][1] - data.drawing[0][0][1];

          // const x = -(1920/2);
          // const y = -(1080/2);
          // const width = 100;
          // const height = 100;

          console.log('Calculated coordinates:', { x, y, width, height });

          setCoordinates({
            x: x,
            y: y,
            width: width,
            height: height,
          });

          // 5초 후에 좌표를 초기화
          setTimeout(() => {
            setCoordinates(null);
          }, 5000);
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/videoTest">Video Test</Link></li>
              <li><Link to="/page1">Page 1</Link></li>
              <li><Link to="/page2">Page 2</Link></li>
            </ul>
          </nav>
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<h2>Home</h2>} />
            <Route path="/videoTest" element={<VideoPlayer src={hlsStreamUrl} coordinates={coordinates} />} />
            <Route path="/page1" element={<h2>Page 1</h2>} />
            <Route path="/page2" element={<h2>Page 2</h2>} />
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
