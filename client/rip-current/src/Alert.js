import React, { useEffect, useState } from 'react';
import './Alert.css'; // CSS 파일 추가


function Alert({ coordinates = [], showOverlay }) {
  const [borderEffect, setBorderEffect] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [blinkingInterval, setBlinkingInterval] = useState(null); // 깜빡임 상태
  const [circle, setCircle] = useState(null); // Circle 상태 추가
  const [map, setMap] = useState(null); // 지도 상태 추가
  const [showAlert, setShowAlert] = useState(false); // 알림 상태
  const [alertMessage, setAlertMessage] = useState(""); // 알림 메시지



  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=63ce630227b172dff159f333e828bfe3&autoload=false&libraries=services`;
  
    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(35.178924708648566, 129.19996141697447), // 해수욕장 중심
          level: 2, // 확대/축소 레벨
        };
  
        const map = new window.kakao.maps.Map(container, options);
        setMap(map);
  
        // 모든 CCTV 마커와 폴리곤 추가
        addAllCCTVMarkersAndPolygons(map);
  
        // 사용자 위치 표시 (CCTV와 겹치지 않도록 고정된 위치)
        addFixedUserMarker(map);
  
        // 이안류 경고 처리
        if (showOverlay && coordinates.length > 0) {
            setAlertMessage("위험: 이안류가 발생했습니다!"); // 알림 메시지
            setShowAlert(true); // 알림 표시
            coordinates.forEach((item) => {
            const centerX = (item.coordinates[0].x + item.coordinates[2].x) / 2;
            const centerY = (item.coordinates[0].y + item.coordinates[2].y) / 2;
  
            const lengthRatio = centerX / 1920;
            const widthRatio = centerY / 1080;
  
            const newCoord = convertCoordinates(
              35.178924708648566, 129.19996141697447, // 기준 좌표
              35.177380384945536, 129.19940394847845,
              35.17911840034305, 129.20219467572807,
              widthRatio, lengthRatio
            );
  
            const overlayPosition = new window.kakao.maps.LatLng(newCoord.latitude, newCoord.longitude);
  
            const circle = new window.kakao.maps.Circle({
              center: overlayPosition,
              radius: 10, // 원 반지름
              fillColor: '#FF8484', // 채우기 색깔
              fillOpacity: 0.8, // 채우기 투명도
              zIndex: 2,
            });
  
            circle.setMap(map);
          });
        }
      });
    };
  
    document.head.appendChild(script);
  

    return () => {
      document.head.removeChild(script);
    };
  }, [coordinates, showOverlay]);
  

  
  // 모든 CCTV 마커와 폴리곤 추가
  const addAllCCTVMarkersAndPolygons = (map) => {
    // CCTV 1
    const cctv1Position = new window.kakao.maps.LatLng(35.178924708648566, 129.19996141697447);
    const cctv1PolygonPath = [
      new window.kakao.maps.LatLng(35.178924708648566, 129.19996141697447),
      new window.kakao.maps.LatLng(35.177380384945536, 129.19940394847845),
      new window.kakao.maps.LatLng(35.17911840034305, 129.20219467572807),
    ];
    addCCTVMarkerAndPolygon(map, cctv1Position, cctv1PolygonPath, false);
  
    // 고장난 CCTV 1
    const cctv2Position = new window.kakao.maps.LatLng(35.18073569660896, 129.2034456534828);
    const cctv2PolygonPath = [
      new window.kakao.maps.LatLng(35.18073569660896, 129.2034456534828),
      new window.kakao.maps.LatLng(35.17769126487736, 129.2060908312752),
      new window.kakao.maps.LatLng(35.177116262276606, 129.20203638693593),
    ];
    addCCTVMarkerAndPolygon(map, cctv2Position, cctv2PolygonPath, true);
  
    // 고장난 CCTV 2
    const cctv3Position = new window.kakao.maps.LatLng(35.17619082460755, 129.19767074203446);
    const cctv3PolygonPath = [
      new window.kakao.maps.LatLng(35.17619082460755, 129.19767074203446),
      new window.kakao.maps.LatLng(35.17432441050954, 129.19897040408284),
      new window.kakao.maps.LatLng(35.17691939444345, 129.20022564552457),
    ];
    addCCTVMarkerAndPolygon(map, cctv3Position, cctv3PolygonPath, true);
  };
  
  // CCTV 마커 및 폴리곤 추가 (공통)
  const addCCTVMarkerAndPolygon = (map, position, polygonPath, isBroken) => {
    const cctvImageSrc = isBroken
      ? `${process.env.PUBLIC_URL}/unusable_cctv_marker.png` // 고장난 CCTV 이미지
      : `${process.env.PUBLIC_URL}/cctv_marker.png`; // 정상 CCTV 이미지
    const cctvImageSize = new window.kakao.maps.Size(64, 69);
    const cctvImageOption = { offset: new window.kakao.maps.Point(32, 69) };
  
    const cctvMarkerImage = new window.kakao.maps.MarkerImage(cctvImageSrc, cctvImageSize, cctvImageOption);
    const cctvMarker = new window.kakao.maps.Marker({
      position,
      image: cctvMarkerImage,
    });
    cctvMarker.setMap(map);
  
    const polygon = new window.kakao.maps.Polygon({
      path: polygonPath,
      strokeWeight: 3,
      strokeColor: '#08088A',
      strokeOpacity: 0.5,
      strokeStyle: 'solid',
      fillColor: '#EFFBFB',
      fillOpacity: 0.4,
      zIndex: 1,
    });
    polygon.setMap(map);
  };
  
  // 사용자 위치를 CCTV에서 충분히 떨어진 곳에 고정
  const addFixedUserMarker = (map) => {
    const userPosition = new window.kakao.maps.LatLng(35.178700708648566, 129.19970041697447); // CCTV에서 충분히 떨어진 사용자 위치
    
    const userMarkerImageSrc = `${process.env.PUBLIC_URL}/location_blue.png`; // 사용자 마커 이미지 경로
    const userMarkerImageSize = new window.kakao.maps.Size(64, 64); // 사용자 마커 크기
    const userMarkerImageOption = { offset: new window.kakao.maps.Point(16, 32) }; // 마커 위치 조정
  
    const userMarkerImage = new window.kakao.maps.MarkerImage(userMarkerImageSrc, userMarkerImageSize, userMarkerImageOption);
  
    const userMarker = new window.kakao.maps.Marker({
      position: userPosition, // 사용자 위치 좌표
      image: userMarkerImage, // 사용자 마커 이미지 설정
    });
  
    userMarker.setMap(map); // 사용자 마커를 지도에 추가
  };
  
  


  // 마커를 표시하는 함수
  const displayMarker = (locPosition, message, map) => {
    const marker = new window.kakao.maps.Marker({
      map: map,
      position: locPosition,
    });
  
    const infowindow = new window.kakao.maps.InfoWindow({
      content: message,
      removable: true,
    });
  
    infowindow.open(map, marker); // 마커 위에 인포윈도우 표시
  };
  
  // 좌표 변환 함수
  const convertCoordinates = (latitude1, longitude1, latitude2, longitude2, latitude3, longitude3, widthRatio, lengthRatio) => {
    const latCenter2And3 = (latitude2 + latitude3) / 2;
    const lonCenter2And3 = (longitude2 + longitude3) / 2;
    const lat1 = latitude1 + (latCenter2And3 - latitude1) * widthRatio;
    const lon1 = longitude1 + (lonCenter2And3 - longitude1) * widthRatio;
  
    const boundaryLat1 = latitude1 + (latitude3 - latitude1) * widthRatio;
    const boundaryLon1 = longitude1 + (longitude3 - longitude1) * widthRatio;
  
    const boundaryLat2 = latitude1 + (latitude2 - latitude1) * widthRatio;
    const boundaryLon2 = longitude1 + (longitude2 - longitude1) * widthRatio;
  
    const finalLat = boundaryLat1 + (boundaryLat2 - boundaryLat1) * lengthRatio;
    const finalLon = boundaryLon1 + (boundaryLon2 - boundaryLon1) * lengthRatio;
  
    return {
      latitude: finalLat,
      longitude: finalLon,
    };
  };
  


  const handleClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          var currentPos;
          // 현실 위치
          //currentPos = new window.kakao.maps.LatLng(lat, lon)

          // 안전하지만 이안류 발생 (주의반경 외부)
          //currentPos = new window.kakao.maps.LatLng(35.179445631264066, 129.1978242412524)

          // 주의 위치 (위험반경 외부)
          //currentPos = new window.kakao.maps.LatLng(35.177016760352025, 129.1988344104301)

          // 위험 위치 (위험반경 내부)
          currentPos = new window.kakao.maps.LatLng(35.17829739569499, 129.19952195224604)

          if (map) {
            map.setCenter(currentPos);
          }
        },
        (error) => {
          console.error('Error getting position:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };
  const handleConfirm = () => {
    setBorderEffect(''); // 테두리 반짝거림 제거
    setShowPopup(false); // 팝업 숨기기
    if (blinkingInterval) {
      clearInterval(blinkingInterval); // Circle 깜빡임 멈추기
    }
    if (circle) {
      circle.setOptions({
        fillColor: '#FF8484',
        fillOpacity: 0.8
      }); // Circle 색상 및 불투명도 재설정
      console.log("색상 채우기 완료");
    }
  };


  return (
    <div className={`alert-container ${borderEffect}`}>
      <div id="map" style={{ width: '100%', height: '1000px' }}></div>
      <div>
        <button
          onClick={handleClick}
          style={{
            width: '50px',
            height: '50px',
            background: `url(${process.env.PUBLIC_URL}/location_current.png) no-repeat center center`,
            backgroundSize: 'cover',
            border: 'none',
            cursor: 'pointer',
            position: 'absolute',
            bottom: '100px',
            right: '20px',
            zIndex: 5000,
          }}
          alt="Click Me"
        />
      </div>
      {/* 알림 UI */}
      {showAlert && (
        <div
          style={{
            position: 'fixed',
            top: '20%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(255, 69, 58, 0.9)', // 강렬한 빨간색 배경
            color: '#fff',
            padding: '30px 20px',
            borderRadius: '12px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
            textAlign: 'center',
          }}
        >
          <h2 style={{ marginBottom: '15px', fontSize: '18px' }}>⚠️ 이안류 발생 경고 ⚠️</h2>
          <p style={{ marginBottom: '20px', fontSize: '16px' }}>{alertMessage}</p>
          <button
            onClick={() => setShowAlert(false)} // 알림 닫기
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: '#fff',
              color: 'rgba(255, 69, 58, 0.9)',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            확인
          </button>
        </div>
      )}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>{popupMessage}</p>
            <button onClick={handleConfirm}>확인했어요</button>
          </div>
        </div>
      )}
    </div>
  );
  
}

export default Alert;
