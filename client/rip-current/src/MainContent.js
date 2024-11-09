import React from 'react';
import { useNavigate } from 'react-router-dom';
import sj from './images/image.png';
import Dashboard from './Dashboard';
function MainContent() {
    const navigate = useNavigate();
    const handleButtonClick = () => {
        navigate('/app'); // /app 경로로 이동
    };
    const products = [
        {
            image: sj,
            title: '송정 해수욕장',
            path: '/app',
            disabled: false,
        },
        {
            image: '',
            title: '다대포 해수욕장',
            path: '/',
            disabled: true,
        },
        {
            image: '',
            title: '해운대 해수욕장',
            path: '/',
            disabled: true,
        }
    ];

    return (
        <main className="home-main">
            
            <div className="home-container">
                <section className='home-banner'>
                    <h1 className="headline">Rip Current Detection and Alert Service</h1>
                    <h2>해수욕장 이안류 감지 및 알림 서비스</h2> <br />
                </section>
                <p id="i-section"></p>
                <div class="section-select">
                    <h2 class="title">서비스 소개</h2>
                    <div class="divider-line"></div>
                </div>
                <Dashboard />
                <p id="q-section"></p>
                <div class="section-select" >
                    <h2 class="title">해수욕장 선택</h2>
                    <div class="divider-line"></div>
                </div>


            </div>
            <div className="product-list">
                {products.map((product, index) => (
                    <div
                        className={`product-card ${product.disabled ? 'disabled' : ''}`}
                        key={index}
                        onClick={() => handleButtonClick(product.path, product.disabled)}
                    >
                        <div className="product-image-container">
                            {product.image ? (
                                <img src={product.image} alt="상품 이미지" className="product-image" />
                            ) : (
                                <span className="no-image-text">서비스 준비 중</span>
                            )}
                        </div>
                        <h3 className="product-title">{product.title}</h3>
                    </div>
                ))}
            </div>

        </main>
    );
}

export default MainContent;
