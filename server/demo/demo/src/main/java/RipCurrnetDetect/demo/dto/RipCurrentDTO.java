package RipCurrnetDetect.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.Arrays;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RipCurrentDTO {
    @JsonProperty("date_time")
    private String dateTime;

    @JsonProperty("bounding_count")
    private int boundingCount;

    private List<List<Integer[]>> drawing;
}
