import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import './App.css';
import VideoPlayer from './VideoPlayer';
import Timeline from './Timeline';

function App() {
  // HLS 스트리밍 URL
  const hlsStreamUrl = 'http://4.217.235.155/stream/index.m3u8'; // 여기에 실제 HLS 스트리밍 주소 입력

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
        <main>
          <Routes>
            <Route path="/" element={<h2>Home</h2>} />
            <Route path="/videoTest" element={<VideoPlayer src={hlsStreamUrl} />} />
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
