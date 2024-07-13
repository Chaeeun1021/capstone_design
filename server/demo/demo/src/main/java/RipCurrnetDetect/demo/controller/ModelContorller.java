package RipCurrnetDetect.demo.controller;

import RipCurrnetDetect.demo.dto.RipData;
import RipCurrnetDetect.demo.event.RipDataUpdatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
@RequiredArgsConstructor
public class ModelContorller {
    private final ApplicationEventPublisher eventPublisher;

    /* 딥러닝 모델로부터 탐지된 RipData를 전달받는 메소드 */
    @PostMapping("/ripData")
    public ResponseEntity<Void> ripMessage(@RequestBody RipData ripData) {
        System.out.println(ripData);
        eventPublisher.publishEvent(new RipDataUpdatedEvent(ripData));
        return ResponseEntity.status(HttpStatus.OK).build();
    }

}
