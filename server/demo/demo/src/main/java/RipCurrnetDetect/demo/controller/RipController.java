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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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
        return ripService.findAll();
    }
}
