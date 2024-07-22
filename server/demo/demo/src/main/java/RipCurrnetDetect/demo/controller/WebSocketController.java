package RipCurrnetDetect.demo.controller;

import RipCurrnetDetect.demo.event.RipDataUpdatedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
@RequiredArgsConstructor
public class WebSocketController {
    private final SimpMessageSendingOperations simpMessageSendingOperations; // SimpMessagingTemplate DI
    @PostMapping("/")
    public ResponseEntity<Void> test(@RequestBody Object testObject) {
        System.out.println(testObject);
        return ResponseEntity.ok().build();
    }
    @EventListener
    public void updateRipData(RipDataUpdatedEvent event) {
        // 구독자에게 전송
        simpMessageSendingOperations.convertAndSend("/topic/ripData", event.getRipCurrentDTO());
    }
}
