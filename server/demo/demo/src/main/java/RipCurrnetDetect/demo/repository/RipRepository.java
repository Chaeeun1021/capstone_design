package RipCurrnetDetect.demo.repository;

import RipCurrnetDetect.demo.domain.RipCurrent;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface RipRepository {
    RipCurrent save(RipCurrent ripCurrent);
    List<RipCurrent> findAll();
}
