package RipCurrnetDetect.demo.service;

import RipCurrnetDetect.demo.util.DataConvertor;
import RipCurrnetDetect.demo.domain.RipCurrent;
import RipCurrnetDetect.demo.dto.RipCurrentDTO;
import RipCurrnetDetect.demo.repository.RipRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RipService {
    private final RipRepository ripRepository;

    // 이안류 데이터 저장
    public RipCurrent saveRip(RipCurrentDTO ripCurrentDTO) throws JsonProcessingException {
        RipCurrent ripCurrent = null;

        // dto -> entity 변환
        for (RipCurrentDTO.Drawing drawing : ripCurrentDTO.getDrawing()) {
            ripCurrent = new RipCurrent();
            // 기본 필드 설정
            ripCurrent.setDateTime(ripCurrentDTO.getDateTime());
            ripCurrent.setBoundingCount(ripCurrentDTO.getBoundingCount());

            // coordinates를 String으로 변환하여 저장 (DB 저장을 위해)
            String coordinatesString = DataConvertor.listToString(drawing.getCoordinates());
            ripCurrent.setDrawing(coordinatesString);
            // confidence_score를 설정
            ripCurrent.setConfidenceScore(drawing.getConfidenceScore());
            // db 저장
            ripRepository.save(ripCurrent);
        }
        return ripCurrent;
    }

    // 이안류 데이터 전체 조회
    public List<RipCurrent> findAllList() {
        return ripRepository.findAll();
    }

    public List<RipCurrent> findRecentList(LocalDateTime requestTime) {
        // 시간을 이안류 DB 데이터 날짜 형식으로 포맷팅
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss");
        String startDateTime = requestTime.minusHours(24).format(formatter);
        String endDateTime = requestTime.format(formatter);

        return ripRepository.findByDateBetween(startDateTime, endDateTime);
        }

    public List<RipCurrent> findPeriodList(LocalDateTime requestStartDateTime, LocalDateTime requestEndndDateTime) {
        // 시간을 이안류 DB 데이터 날짜 형식으로 포맷팅
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss");
        String startDateTime = requestStartDateTime.format(formatter);
        String endDateTime = requestEndndDateTime.format(formatter);

        return ripRepository.findByDateBetween(startDateTime, endDateTime);
    }
}
