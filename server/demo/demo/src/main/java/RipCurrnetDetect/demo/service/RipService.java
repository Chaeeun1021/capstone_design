package RipCurrnetDetect.demo.service;

import RipCurrnetDetect.demo.util.DataConvertor;
import RipCurrnetDetect.demo.domain.RipCurrent;
import RipCurrnetDetect.demo.dto.RipCurrentDTO;
import RipCurrnetDetect.demo.repository.RipRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RipService {
    private final RipRepository ripRepository;
    // 이안류 데이터 저장
    public RipCurrent saveRip(RipCurrentDTO ripCurrentDTO) throws JsonProcessingException {
       // dto -> entity 변환
        RipCurrent ripCurrent = new RipCurrent();
        ripCurrent.setDateTime(ripCurrentDTO.getDateTime());
        ripCurrent.setBoundingCount(ripCurrentDTO.getBoundingCount());
        // List<Integer[]> 타입의 데이터를 DB에 저장하기 어려우므로 String으로 변환하여 저장
        List<List<Integer[]>> drawingDatas = ripCurrentDTO.getDrawing();
        for (List<Integer[]> drawing : drawingDatas) {
            ripCurrent.setDrawing(DataConvertor.listToString(ripCurrentDTO.getDrawing()));
            ripCurrent = convertToEntity(ripCurrentDTO);
        }
        // db 저장
        ripRepository.save(ripCurrent);


        return ripCurrent;
    }

    // 이안류 데이터 전체 조회
    public List<RipCurrent> findAll() {
        return ripRepository.findAll();
    }

    // ripCurrentDTO(DTO) -> ripCurrent(Entity) 변환
    private RipCurrent convertToEntity(RipCurrentDTO ripCurrentDTO) throws JsonProcessingException {
        RipCurrent ripCurrent = new RipCurrent();
        ripCurrent.setDateTime(ripCurrentDTO.getDateTime());
        ripCurrent.setBoundingCount(ripCurrentDTO.getBoundingCount());
        // List<Integer[]> 타입의 데이터를 DB에 저장하기 어려우므로 String으로 변환하여 저장
        ripCurrent.setDrawing(DataConvertor.listToString(ripCurrentDTO.getDrawing()));
        return ripCurrent;
    }
}
