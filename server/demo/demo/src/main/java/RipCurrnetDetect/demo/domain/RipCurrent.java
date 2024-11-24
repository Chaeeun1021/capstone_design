package RipCurrnetDetect.demo.domain;

import jakarta.persistence.*;


@Entity
@Table(name="ripcurrent")
public class RipCurrent {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String dateTime;
    private int boundingCount;
    //@Lob
    private String drawing;
    private float confidenceScore;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDateTime() {
        return dateTime;
    }

    public void setDateTime(String dateTime) {
        this.dateTime = dateTime;
    }

    public int getBoundingCount() {
        return boundingCount;
    }

    public void setBoundingCount(int boundingCount) {
        this.boundingCount = boundingCount;
    }

    public String getDrawing() {
        return drawing;
    }

    public void setDrawing(String drawing) {
        this.drawing = drawing;
    }
    public float getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(float confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

}
