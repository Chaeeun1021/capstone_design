package RipCurrnetDetect.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

public class WebSocketController {
    @PostMapping("/")
    public void test(@RequestBody Object testObject) {
        System.out.println(testObject);
    }
}
