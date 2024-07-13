package RipCurrnetDetect.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.util.Arrays;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RipData {
    @JsonProperty("date_time")
    private String dateTime;

    @JsonProperty("bounding_count")
    private int boundingCount;

    private List<int[]> drawing;

    @Override
    public String toString() {
        return "RipData{" +
                "dateTime='" + dateTime + '\'' +
                ", boundingCount=" + boundingCount +
                ", drawing="
                + Arrays.toString(drawing.get(0))
                + Arrays.toString(drawing.get(1))
                + Arrays.toString(drawing.get(2))
                + Arrays.toString(drawing.get(3)) + '}';
    }
}
