import React, { useEffect } from 'react';

function Alert({ coordinates = [], showOverlay }) {

  useEffect(() => {

    console.log(coordinates);
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
          zIndex : 1
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

          var circle = new window.kakao.maps.Circle({
            center: overlayPosition,  // 원의 중심좌표 입니다 
            radius: 10, // 미터 단위의 원의 반지름입니다 
            strokeWeight: 5, // 선의 두께입니다 
            strokeColor: '#FF8484', // 선의 색깔입니다
            strokeOpacity: 0.9, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            strokeStyle: 'dashed', // 선의 스타일 입니다
            fillColor: '#FF8484', // 채우기 색깔입니다
            fillOpacity: 0.8,  // 채우기 불투명도 입니다   
            zIndex: 2,
          });


          console.log(circle.getZIndex());

          circle.setMap(map);

          circle.setZIndex(2);
        }
      });
    };

    document.head.appendChild(script);
  }, [coordinates, showOverlay]);

  return (
    <div>
      {/* 지도가 표시될 div */}
      <div id="map" style={{ width: '100%', height: '1000px' }}></div>
    </div>
  );
}

export default Alert;
