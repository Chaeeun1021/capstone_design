import React from 'react';
import './Dashboard.css';
import cctv from './images/cctv.png'
import alert from './images/alert.png'
import database from './images/database.png'
import { useEffect, useRef, useState } from 'react';
function Dashboard() {
  const [isVisible, setIsVisible] = useState(false);
  const dashboardRef = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(dashboardRef.current); // 한 번 나타난 후 더 이상 관찰하지 않음
        }
      },
      { threshold: 0.1 } // 10%가 화면에 들어올 때 나타남
    );

    if (dashboardRef.current) {
      observer.observe(dashboardRef.current);
    }

    return () => {
      if (dashboardRef.current) {
        observer.unobserve(dashboardRef.current);
      }
    };
  }, []);

  return (
    <div ref={dashboardRef} className={`dashboard ${isVisible ? 'fade-in' : ''}`}>
      <header className="dashboard-header">
        <h1 className="dashboard-header-title">딥러닝 모델을 이용한 이안류 탐지 서비스</h1>
        <p className="dashboard-header-description">
          해수욕장의 CCTV 영상을 통해 실시간으로 이안류를 탐지하고, <br />발생 위치와 시간 정보를 제공합니다.
        </p>
        <a href="#q-section" className="dashboard-header-link">RIP 서비스 사용하기 ➔</a>
      </header>

      <div className="dashboard-features">
        <div className="dashboard-feature">
          <img src={cctv} alt="개인 맞춤형 편집기" className="dashboard-feature-icon" />
          <h3 className="dashboard-feature-title">실시간 탐지</h3>
          <p className="dashboard-feature-description">
            CCTV를 통해 실시간으로 이안류를 탐지합니다.
          </p>
        </div>
        <div className="dashboard-feature">
          <img src={alert} alt="개인 맞춤형 편집기" className="dashboard-feature-icon" />
          <h3 className="dashboard-feature-title">경고 알림</h3>
          <p className="dashboard-feature-description">
            사용자의 위치에 기반한 알림 서비스를 제공합니다.
          </p>
        </div>
        <div className="dashboard-feature">
          <img src={database} alt="AI 커넥터 베타" className="dashboard-feature-icon" />
          <h3 className="dashboard-feature-title">과거 데이터 제공</h3>
          <p className="dashboard-feature-description">
            과거 이안류 데이터를 날짜 및 시간별로 제공합니다.
          </p>
        </div>
      </div>


    </div>
  );
}

export default Dashboard;
