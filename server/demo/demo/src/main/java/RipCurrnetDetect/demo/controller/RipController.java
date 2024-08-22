package RipCurrnetDetect.demo.controller;

import RipCurrnetDetect.demo.domain.RipCurrent;
import RipCurrnetDetect.demo.dto.RipCurrentDTO;
import RipCurrnetDetect.demo.event.RipDataUpdatedEvent;
import RipCurrnetDetect.demo.service.RipService;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class RipController {
    private final RipService ripService;
    private final ApplicationEventPublisher eventPublisher;

    /* 딥러닝 모델로부터 탐지된 RipData를 전달받는 메소드 */
    @PostMapping("/ripData")
    public ResponseEntity<Void> ripMessage(@RequestBody RipCurrentDTO ripCurrentDTO) {
        System.out.println(ripCurrentDTO);
        try {
            // 이벤트 발행 -> WebsocketController
            eventPublisher.publishEvent(new RipDataUpdatedEvent(ripCurrentDTO));
            // 이안류 데이터 저장
            RipCurrent ripCurrent = ripService.saveRip(ripCurrentDTO);
            System.out.println("저장된 데이터: " + ripCurrent.getId());

            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (JsonProcessingException e) {
            // JSON 파싱 예외처리
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            // 나머지 예외처리
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    /* db에 저장된 이안류 데이터 반환 */
    @GetMapping("/ripList")
    public List<RipCurrent> ripList() {
        return ripService.findAllList();
    }

    /* 최근 24시 이내 데이터 반환 */
    @GetMapping("/ripList/recent")
    public List<RipCurrent> recentRipData() {
        // 현재 시간 생성
        LocalDateTime currentTime = LocalDateTime.now();
        // 요청시간의 24시 이내 데이터 조회
        return ripService.findRecentList(currentTime);
    }

    /* 시작과 종료 기간에 따른 데이터 반환
    * 날짜 형식: start_date=2024-07-26&end_date=2024-07-27
    * 시간 형식: start_time=16:38:40&end_time=16:38:59
    * */
    @GetMapping("/ripList/period")
    public List<RipCurrent> periodRipData(@RequestParam("start_date") LocalDate startDate,
                                          @RequestParam(value = "start_time", required = false) String startTime,
                                          @RequestParam("end_date") LocalDate endDate,
                                          @RequestParam(value = "end_time", required = false) String endTime) {
        // 시작과 종료 시간의 기본값은 00:00:00 ~ 23:59:59
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

        if(startTime != null) {
            startDateTime = LocalDateTime.of(startDate, LocalTime.parse(startTime));
        }
        if(endTime != null) {
            endDateTime = LocalDateTime.of(endDate, LocalTime.parse(endTime));
        }
         return ripService.findPeriodList(startDateTime, endDateTime);
    }

}
