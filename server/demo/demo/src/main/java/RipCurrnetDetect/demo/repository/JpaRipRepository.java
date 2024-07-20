package RipCurrnetDetect.demo.repository;

import RipCurrnetDetect.demo.domain.RipCurrent;
import org.springframework.data.jpa.repository.JpaRepository;


public interface JpaRipRepository extends JpaRepository<RipCurrent, Long>, RipRepository {
}
