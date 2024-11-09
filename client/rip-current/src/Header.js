import React from 'react';
import logo from './images/rip-logo.png'
function Header() {
  return (
    <header className="home-header">
      <div className="logo">
        <img src={logo} alt="Rip current logo" width="70" height="auto" />
        
      </div>
      <nav className="navigation">
        <ul>
          <li><a href="#i-section" rel="noopener noreferrer">소개</a></li>
          <li><a href="/app" rel="noopener noreferrer">바로가기</a></li>
        </ul>
      </nav>
      
    </header>
  );
}

export default Header;
