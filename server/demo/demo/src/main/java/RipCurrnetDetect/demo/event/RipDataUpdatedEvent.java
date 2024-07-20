package RipCurrnetDetect.demo.event;

import RipCurrnetDetect.demo.dto.RipCurrentDTO;

public class RipDataUpdatedEvent {
    private final RipCurrentDTO ripCurrentDTO;
    public RipDataUpdatedEvent(RipCurrentDTO ripCurrentDTO) {
        this.ripCurrentDTO = ripCurrentDTO;
    }
    public RipCurrentDTO getRipData() {
        return ripCurrentDTO;
    }
}
