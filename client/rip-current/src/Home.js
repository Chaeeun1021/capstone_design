import React from 'react';
import './Home.css'
import Header from './Header';
import MainContent from './MainContent';
import Footer from './Footer';

const Home = () => {

  return ( 
    <div className='home'>
      <Header />
      <MainContent />
      <Footer />
    </div>
    
    /*
    <div className="main-container">
    
    <h1 className="title">RIP</h1>
    <h2 className="subtitle">이안류 감지 알림 서비스</h2>

    <p className="description">해수욕장을 선택해 주세요.</p>

    <div className="beach-options">
      <Link className="beach-button" to='/app'>송정 해수욕장</Link>
      <button className="beach-button disabled" disabled>해운대 해수욕장 (준비 중)</button>
      <button className="beach-button disabled" disabled>광안리 해수욕장 (준비 중)</button>
      <button className="beach-button disabled" disabled>다대포 해수욕장 (준비 중)</button>
    </div>
  </div>
  */
      
  
  );
};

export default Home;