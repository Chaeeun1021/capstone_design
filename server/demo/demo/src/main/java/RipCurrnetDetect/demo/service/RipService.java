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
        List<List<Integer[]>> drawingDatas = ripCurrentDTO.getDrawing();
        // dto -> entity 변환
        for (List<Integer[]> drawing : drawingDatas) {
            ripCurrent = new RipCurrent();
            ripCurrent.setDateTime(ripCurrentDTO.getDateTime());
            ripCurrent.setBoundingCount(ripCurrentDTO.getBoundingCount());
            System.out.println(DataConvertor.listToString(drawing));
            // List<Integer[]> 타입의 데이터를 DB에 저장하기 어려우므로 String으로 변환
            ripCurrent.setDrawing(DataConvertor.listToString(drawing));
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
