package RipCurrnetDetect.demo;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
public class WebSocketController {
    @PostMapping("/")
    public ResponseEntity<Void> test(@RequestBody Object testObject) {
        System.out.println(testObject);
        return ResponseEntity.ok().build();
    }
}
