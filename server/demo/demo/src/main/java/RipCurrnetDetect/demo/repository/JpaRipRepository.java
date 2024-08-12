package RipCurrnetDetect.demo.repository;

import RipCurrnetDetect.demo.domain.RipCurrent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface JpaRipRepository extends JpaRepository<RipCurrent, Long>, RipRepository {
    @Query("SELECT r FROM RipCurrent r WHERE r.dateTime BETWEEN :startDateTime AND :endDateTime")
    List<RipCurrent> findRipWithin24Hours(
            @Param("startDateTime") String startDateTime,
            @Param("endDateTime") String endDateTime
    );
}
