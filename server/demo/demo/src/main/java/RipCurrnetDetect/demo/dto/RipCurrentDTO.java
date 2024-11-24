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

    @JsonProperty("drawing")
    private List<Drawing> drawing; // Drawing 객체 리스트

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Drawing {
        @JsonProperty("coordinates")
        private List<List<Integer>> coordinates; // 좌표값 리스트

        @JsonProperty("confidence_score")
        private float confidenceScore; // 신뢰도 점수
    }
}
