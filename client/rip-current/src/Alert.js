import React, { useEffect } from 'react';

function Alert() {

  useEffect(() => {
    // Kakao Maps API를 로드하고 지도를 생성하는 함수
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=63ce630227b172dff159f333e828bfe3&autoload=false`;

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map'); // 지도를 담을 영역의 DOM 레퍼런스
        const options = {
          center: new window.kakao.maps.LatLng(35.178624, 129.202183), // 지도의 중심 좌표
          draggable: false,
          level: 2, // 지도의 레벨(확대, 축소 정도)
        };

        const map = new window.kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴

        // 마커 이미지 관련 설정
        const imageSrc = process.env.PUBLIC_URL + "/camera_range_rotate.png";
        const imageSize = new window.kakao.maps.Size(500, 400); // 마커 이미지 크기
        const imageOption = { offset: new window.kakao.maps.Point(200, 0) }; // 마커 이미지의 좌표 설정

        // 마커 이미지 생성
        const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
        const markerPosition = new window.kakao.maps.LatLng(35.179167, 129.200546); // 마커 위치

        // 마커 생성 및 지도에 표시
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          image: markerImage, // 마커 이미지 설정
        });

        marker.setMap(map); // 마커를 지도 위에 표시
      });
    };

    document.head.appendChild(script);
  }, []);

  return (
    <div>
      {/* 지도가 표시될 div */}
      <div id="map" style={{ width: '100%', height: '1000px' }}></div>
    </div>
  );
}

export default Alert;
