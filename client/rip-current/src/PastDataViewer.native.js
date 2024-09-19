// PastDataViewer.native.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Image, Platform } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import DateTimePicker from '@react-native-community/datetimepicker'; // React Native DatePicker
import axios from 'axios';

function PastDataViewer() {
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState('00:00:00');
  const [selectedEndTime, setSelectedEndTime] = useState('23:59:59');
  const [dataList, setDataList] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const imageSrc = require('./beach2.png'); // React Native에서는 require 사용
  const originalImageWidth = 1920;
  const originalImageHeight = 1080;

  const handleFetchData = () => {
    if (!selectedStartDate || !selectedEndDate) {
      alert('날짜를 선택하세요!');
      return;
    }

    if (selectedStartDate > selectedEndDate) {
      alert('시작 날짜는 종료 날짜보다 먼저여야 합니다.');
      return;
    }

    setLoading(true);

    const offset = selectedStartDate.getTimezoneOffset() * 60000;
    const startDate = new Date(selectedStartDate.getTime() - offset).toISOString().split('T')[0];
    const endDate = new Date(selectedEndDate.getTime() - offset).toISOString().split('T')[0];

    const startTime = (selectedStartTime.split(':').length === 2 ? `${selectedStartTime}:00` : selectedStartTime);
    const endTime = (selectedEndTime.split(':').length === 2 ? `${selectedEndTime}:00` : selectedEndTime);

    axios
      .get('https://port-0-rip-lyuhc4uac61f92ea.sel4.cloudtype.app/ripList/period', {
        params: {
          start_date: startDate,
          start_time: startTime,
          end_date: endDate,
          end_time: endTime,
        },
      })
      .then((response) => {
        const responseData = response.data;

        const newCoordinates = responseData.flatMap((item) => {
          if (typeof item.drawing === 'string') {
            try {
              const parsedDrawing = JSON.parse(item.drawing);
              if (Array.isArray(parsedDrawing) && parsedDrawing.length === 4) {
                const [topLeft, topRight, bottomRight, bottomLeft] = parsedDrawing;
                return [{
                  topLeft: { x: topLeft[0], y: topLeft[1] },
                  bottomRight: { x: bottomRight[0], y: bottomRight[1] },
                }];
              }
            } catch (error) {
              console.error('Error parsing drawing:', error);
              return [];
            }
          } else if (Array.isArray(item.drawing) && item.drawing.length === 4) {
            const [topLeft, topRight, bottomRight, bottomLeft] = item.drawing;
            return [{
              topLeft: { x: topLeft[0], y: topLeft[1] },
              bottomRight: { x: bottomRight[0], y: bottomRight[1] },
            }];
          } else {
            console.error('Invalid drawing format:', item.drawing);
            return [];
          }
        });

        setCoordinates(newCoordinates);
        setDataList(responseData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.layoutWrapper}>
      <View style={styles.imageContainer}>
        <Image source={imageSrc} style={styles.responsiveImage} />
        <Svg
          style={StyleSheet.absoluteFill}
          viewBox={`0 0 ${originalImageWidth} ${originalImageHeight}`}
        >
          {coordinates.map(({ topLeft, bottomRight }, index) => (
            <Rect
              key={index}
              x={topLeft.x}
              y={topLeft.y}
              width={bottomRight.x - topLeft.x}
              height={bottomRight.y - topLeft.y}
              stroke="red"
              strokeWidth="2"
              fill="none"
            />
          ))}
        </Svg>
      </View>

      <View style={styles.leftPanel}>
        <Text style={styles.heading}>과거 데이터 조회</Text>

        {/* React Native용 DateTimePicker */}
        <View style={styles.datetimePicker}>
          <Text>시작 날짜:</Text>
          <Button title={selectedStartDate.toDateString()} onPress={() => setShowStartDatePicker(true)} />
          {showStartDatePicker && (
            <DateTimePicker
              value={selectedStartDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowStartDatePicker(false);
                if (date) setSelectedStartDate(date);
              }}
            />
          )}
        </View>

        <View style={styles.datetimePicker}>
          <Text>종료 날짜:</Text>
          <Button title={selectedEndDate.toDateString()} onPress={() => setShowEndDatePicker(true)} />
          {showEndDatePicker && (
            <DateTimePicker
              value={selectedEndDate}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowEndDatePicker(false);
                if (date) setSelectedEndDate(date);
              }}
            />
          )}
        </View>

        <View style={styles.datetimePicker}>
          <Text>시작 시간:</Text>
          <TextInput
            style={styles.customTimepicker}
            value={selectedStartTime}
            onChangeText={setSelectedStartTime}
          />
        </View>
        <View style={styles.datetimePicker}>
          <Text>종료 시간:</Text>
          <TextInput
            style={styles.customTimepicker}
            value={selectedEndTime}
            onChangeText={setSelectedEndTime}
          />
        </View>

        <Button
          title={loading ? '데이터 불러오는 중...' : '데이터 조회'}
          onPress={handleFetchData}
          disabled={loading}
          color="#4CAF50"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    layoutWrapper: {
      flexDirection: 'column',
      padding: 20,
    },
    imageContainer: {
      flex: 3,
      position: 'relative',
      width: '100%',
      height: 200,
    },
    responsiveImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    leftPanel: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
    },
    heading: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    datetimePicker: {
      marginBottom: 10,
    },
    customTimepicker: {
      padding: 8,
      fontSize: 14,
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 4,
      width: '100%',
    },
    dataList: {
      marginTop: 20,
    },
    scrollableList: {
      maxHeight: 150,
    },
  });
  
  export default PastDataViewer;
  
