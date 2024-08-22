import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // DatePicker 스타일 임포트
import './DateRangePicker.css'; // CSS 파일 임포트

function DateRangePicker({ onDateChange }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (onDateChange) {
      onDateChange({ startDate: date, endDate });
    }
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    if (onDateChange) {
      onDateChange({ startDate, endDate: date });
    }
  };

  return (
    <div className="date-range-picker">
      <div>
        <label>시작 날짜: </label>
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="yyyy-MM-dd"
          placeholderText="날짜 선택"
        />
      </div>
      <div>
        <label>종료 날짜: </label>
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate} // 시작 날짜 이후부터만 선택 가능
          dateFormat="yyyy-MM-dd"
          placeholderText="날짜 선택"
        />
      </div>
    </div>
  );
}

export default DateRangePicker;
