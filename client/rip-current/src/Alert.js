import React, { useEffect, useState } from 'react';
import './Alert.css'; // CSS 파일 추가


function Alert({ coordinates = [], showOverlay }) {
  const [borderEffect, setBorderEffect] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [blinkingInterval, setBlinkingInterval] = useState(null); // 깜빡임 상태
  const [circle, setCircle] = useState(null); // Circle 상태 추가
  const [map, setMap] = useState(null); // 지도 상태 추가




  useEffect(() => {


    console.log('borderEffect 업데이트됨:', borderEffect);

    console.log(coordinates);
    // Kakao Maps API를 로드하고 지도를 생성하는 함수
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=63ce630227b172dff159f333e828bfe3&autoload=false&libraries=services`;

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map'); // 지도를 담을 영역의 DOM 레퍼런스
        const options = {
          center: new window.kakao.maps.LatLng(35.178624, 129.202183), // 지도의 중심 좌표
          level: 2, // 지도의 레벨(확대, 축소 정도)
        };

        const map = new window.kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴
        setMap(map); // 지도 상태 업데이트


        /*
        // 클릭시 위도 경도 콘솔 출력
        window.kakao.maps.event.addListener(map, 'click', function(mouseEvent) {        
    
          // 클릭한 위도, 경도 정보를 가져옵니다 
          var latlng = mouseEvent.latLng; 
          
          // 마커 위치를 클릭한 위치로 옮깁니다
          
          var message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
          message += '경도는 ' + latlng.getLng() + ' 입니다';
          
          console.log(message);
      });
      */


        const centerPos = null;
        var infowindow = null;
        var marker = null;


        if (navigator.geolocation && coordinates.length == 0 && marker == null) {

          // GeoLocation을 이용해서 접속 위치를 얻어옵니다
          navigator.geolocation.getCurrentPosition(function (position) {

            var lat = position.coords.latitude, // 위도
              lon = position.coords.longitude; // 경도

            var locPosition = new window.kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
              message = '<div style="padding:5px;">여기에 계신가요?!</div>'; // 인포윈도우에 표시될 내용입니다


            // 안전하지만 이안류 발생 (주의반경 외부)
            locPosition = new window.kakao.maps.LatLng(35.179445631264066, 129.1978242412524)

            // 주의 위치 (위험반경 외부)
            //locPosition = new window.kakao.maps.LatLng(35.177016760352025, 129.1988344104301)

            // 위험 위치 (위험반경 내부)
            //locPosition = new window.kakao.maps.LatLng(35.17829739569499, 129.19952195224604)


            // 마커와 인포윈도우를 표시합니다
            displayMarker(locPosition, message, 0, locPosition);

          });

        } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

          var locPosition = new window.kakao.maps.LatLng(35.177016760352025, 129.1988344104301),
            //var locPosition = new window.kakao.maps.LatLng(35.17829739569499, 129.19952195224604),
            message = 'geolocation을 사용할수 없어요..'

          //  displayMarker(locPosition, message, 0);
          console.log("geolocation 사용 불가능 !!");
        }
        function displayMarker(locPosition, message, mode, centerPosition) {
          console.log("displayMarker start!");
          if (infowindow != null) {
            infowindow.close();
          }
          if (marker != null) {
            marker.setMap(null);
          }
          var markerImageSrc = `${process.env.PUBLIC_URL}/location_blue.png`;
          if (mode === 2) {
            markerImageSrc = `${process.env.PUBLIC_URL}/location_orange.png`;
          } else if (mode === 3) {
            markerImageSrc = `${process.env.PUBLIC_URL}/location_red.png`;
          }


          var imageSize = new window.kakao.maps.Size(64, 69), // 마커이미지의 크기입니다
            imageOption = { offset: new window.kakao.maps.Point(32, 69) }; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

          // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
          var markerImage = new window.kakao.maps.MarkerImage(markerImageSrc, imageSize, imageOption);

          // 마커를 생성합니다
          marker = new window.kakao.maps.Marker({
            map: map,
            position: locPosition,
            image: markerImage
          });

          var iwContent = message, // 인포윈도우에 표시할 내용
            iwRemoveable = true;

          // 인포윈도우를 생성합니다
          infowindow = new window.kakao.maps.InfoWindow({
            content: iwContent,
            removable: iwRemoveable
          });

          // 인포윈도우를 마커위에 표시합니다 
          infowindow.open(map, marker);

          // 지도 중심좌표를 접속위치로 변경합니다
          map.setCenter(centerPosition);
        }


        /** Marker에서 Polygon 으로 변경 */

        // // 마커 이미지 관련 설정
        // const imageSrc = process.env.PUBLIC_URL + "/camera_range_rotate.png";
        // const imageSize = new window.kakao.maps.Size(500, 400); // 마커 이미지 크기
        // const imageOption = { offset: new window.kakao.maps.Point(200, 0) }; // 마커 이미지의 좌표 설정

        // // 마커 이미지 생성
        // const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
        // const markerPosition = new window.kakao.maps.LatLng(35.179167, 129.200546); // 마커 위치

        // // 마커 생성 및 지도에 표시
        // const marker = new window.kakao.maps.Marker({
        //   position: markerPosition,
        //   image: markerImage, // 마커 이미지 설정
        //   zIndex: 1,
        // });      

        // marker.setMap(map); // 마커를 지도 위에 표시
        // marker.setZIndex(1);

        const polygonPath = [
          new window.kakao.maps.LatLng(35.178924708648566, 129.19996141697447),
          new window.kakao.maps.LatLng(35.177380384945536, 129.19940394847845),
          new window.kakao.maps.LatLng(35.17911840034305, 129.20219467572807),
        ];

        // 지도에 표시할 다각형을 생성합니다
        const polygon = new window.kakao.maps.Polygon({
          path: polygonPath, // 그려질 다각형의 좌표 배열입니다
          strokeWeight: 3, // 선의 두께입니다
          strokeColor: '#FF8484', // 선의 색깔입니다
          strokeOpacity: 0.5, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
          strokeStyle: 'solid', // 선의 스타일입니다
          fillColor: '#FF8484', // 채우기 색깔입니다
          fillOpacity: 0.4, // 채우기 불투명도 입니다
          zIndex: 1
        });

        polygon.setMap(map);

        console.log(coordinates);

        const convertCoordinates = (latitude1, longitude1, latitude2, longitude2, latitude3, longitude3, widthRatio, lengthRatio) => {

          //step 1  세로기준 ratio로 맞추기
          const latCenter2And3 = (latitude2 + latitude3) / 2;
          const lonCenter2And3 = (longitude2 + longitude3) / 2;
          const lat1 = latitude1 + (latCenter2And3 - latitude1) * widthRatio;
          const lon1 = longitude1 + (lonCenter2And3 - longitude1) * widthRatio;


          // step 2 해당 세로 지점의 가로 경계 삼각형 좌표 2개 구하기
          const boundaryLat1 = latitude1 + (latitude3 - latitude1) * widthRatio;
          const boundaryLon1 = longitude1 + (longitude3 - longitude1) * widthRatio;

          const boundaryLat2 = latitude1 + (latitude2 - latitude1) * widthRatio;
          const boundaryLon2 = longitude1 + (longitude2 - longitude1) * widthRatio;

          // step 3 앞서 구한 두 좌표를 이용하여 가로기준 ratio로 맞추기
          const finalLat = boundaryLat1 + (boundaryLat2 - boundaryLat1) * lengthRatio;
          const finalLon = boundaryLon1 + (boundaryLon2 - boundaryLon1) * lengthRatio;


          const newLatitude = finalLat;
          const newLongitude = finalLon;

          return {
            latitude: newLatitude,
            longitude: newLongitude,
          };
        };



        if (showOverlay && coordinates.length > 0) {
          const lengthRatio = ((coordinates[0][2].x + coordinates[0][0].x) / 2) / 1920;
          const widthRatio = ((coordinates[0][2].y + coordinates[0][0].y) / 2) / 1080;
          console.log(lengthRatio);
          console.log(widthRatio);

          const newCoord = convertCoordinates(35.178924708648566, 129.19996141697447, 35.177380384945536, 129.19940394847845, 35.17911840034305, 129.20219467572807,
            widthRatio, lengthRatio);

          const overlayPosition = new window.kakao.maps.LatLng(newCoord.latitude, newCoord.longitude);


          function blinkCircle(circle, setBlinkingInterval) {
            let isBlinking = false;
            const intervalId = setInterval(() => {
              if (!isBlinking) {
                circle.setOptions({
                  fillColor: '#FF8484',
                  fillOpacity: 0.8
                });
              } else {
                circle.setOptions({
                  fillColor: '#FF8484',
                  fillOpacity: 0.1
                });
              }
              isBlinking = !isBlinking;
            }, 300); // 500ms마다 깜빡임

            // 깜빡임 관리 상태 업데이트
            setBlinkingInterval(intervalId);
          }


          var circle = new window.kakao.maps.Circle({
            center: overlayPosition,  // 원의 중심좌표 입니다 
            radius: 10, // 미터 단위의 원의 반지름입니다 
            // strokeWeight: 5, // 선의 두께입니다 
            // strokeColor: '#FF8484', // 선의 색깔입니다
            // strokeOpacity: 0.9, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            // strokeStyle: 'dashed', // 선의 스타일 입니다
            fillColor: '#FF8484', // 채우기 색깔입니다
            fillOpacity: 0.8,  // 채우기 불투명도 입니다   
            zIndex: 2,
          });


          console.log(circle.getZIndex());

          circle.setMap(map);
          setCircle(circle); // 상태에 Circle 객체 저장

          circle.setZIndex(2);

          blinkCircle(circle, setBlinkingInterval); // 깜빡임 시작


          map.setCenter(overlayPosition);


          if (navigator.geolocation) {
            console.log("navigator geolocation TRUE");
            navigator.geolocation.getCurrentPosition(function (position) {

              var lat = position.coords.latitude, // 위도
                lon = position.coords.longitude; // 경도

              var locPosition = new window.kakao.maps.LatLng(lat, lon);


              // 안전하지만 이안류 발생 (주의반경 외부)
              locPosition = new window.kakao.maps.LatLng(35.179445631264066, 129.1978242412524)

              // 주의 위치 (주의반경 내부)
              //locPosition = new window.kakao.maps.LatLng(35.177016760352025, 129.1988344104301)

              // 위험 위치 (위험반경 내부)
              //locPosition = new window.kakao.maps.LatLng(35.17829739569499, 129.19952195224604)




              checkBoundary(locPosition);


            });
            var sw1 = new window.kakao.maps.LatLng(35.177186517320806, 129.19916275518463),
              ne1 = new window.kakao.maps.LatLng(35.17918005171423, 129.2022731682647),
              boundary1 = new window.kakao.maps.LatLngBounds(sw1, ne1);

            var sw2 = new window.kakao.maps.LatLng(35.17617564436354, 129.19801056342754),
              ne2 = new window.kakao.maps.LatLng(35.180241116792864, 129.20338839656827),
              boundary2 = new window.kakao.maps.LatLngBounds(sw2, ne2);

            function checkBoundary(locPosition) {

              if (boundary1.contain(locPosition)) {
                displayMarker(locPosition, '위험', 3, overlayPosition);
                setBorderEffect('danger');
                setPopupMessage('위험');
                setShowPopup(true);
              } else if (boundary2.contain(locPosition)) {
                displayMarker(locPosition, '주의', 2, overlayPosition);
                setBorderEffect('caution');
                setPopupMessage('주의');
                setShowPopup(true);
              }
              else {
                displayMarker(locPosition, '안전', 1, overlayPosition);
                setBorderEffect('normal');
                setPopupMessage('이안류 발생');
                setShowPopup(true);
              }
            }

          }

          else {
            console.log("Geolocation is not supported by this browser.");
          }
        }
      });
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup function to clear the interval if the component unmounts
      if (blinkingInterval) {
        clearInterval(blinkingInterval);
      }
    };
  }, [coordinates, showOverlay]);


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
          currentPos = new window.kakao.maps.LatLng(35.179445631264066, 129.1978242412524)

          // 주의 위치 (위험반경 외부)
          //currentPos = new window.kakao.maps.LatLng(35.177016760352025, 129.1988344104301)

          // 위험 위치 (위험반경 내부)
          //currentPos = new window.kakao.maps.LatLng(35.17829739569499, 129.19952195224604)

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
            bottom: '20px', // 우측 하단에서의 거리
            right: '20px',
            background: `url(${process.env.PUBLIC_URL}/location_current.png) no-repeat center center`,
            backgroundSize: 'cover',
            border: 'none',
            cursor: 'pointer',
            position: 'absolute', // 위치를 절대적으로 설정
            bottom: '100px', // 우측 하단에서의 거리
            right: '20px', // 우측 하단에서의 거리
            zIndex: 5000
          }}
          alt="Click Me"
        />
      </div>
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
