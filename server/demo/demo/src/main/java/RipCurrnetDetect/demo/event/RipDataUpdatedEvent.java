package RipCurrnetDetect.demo.event;

import RipCurrnetDetect.demo.dto.RipData;

public class RipDataUpdatedEvent {
    private final RipData ripData;

    public RipDataUpdatedEvent(RipData ripData) {
        this.ripData = ripData;
    }
    public RipData getRipData() {
        return ripData;
    }
}
