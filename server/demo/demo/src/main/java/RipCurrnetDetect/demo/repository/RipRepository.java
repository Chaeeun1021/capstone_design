package RipCurrnetDetect.demo.repository;

import RipCurrnetDetect.demo.domain.RipCurrent;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface RipRepository {
    RipCurrent save(RipCurrent ripCurrent);
    List<RipCurrent> findAll();
    List<RipCurrent> findRipWithin24Hours(String startDateTime, String endDateTime);
}
