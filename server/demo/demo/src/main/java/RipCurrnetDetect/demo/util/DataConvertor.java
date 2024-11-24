package RipCurrnetDetect.demo.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
public class DataConvertor {
    private static final ObjectMapper objectMapper = new ObjectMapper();
    // 직렬화: List<List<Integer>> -> jsonString
    public static String listToString(List<List<Integer>> list) throws JsonProcessingException {
        return objectMapper.writeValueAsString(list); // 리스트를 JSON 문자열로 변환
    }

    // 역직렬화: jsonString -> List<List<Integer>>
    public static List<List<Integer>> stringToList(String str) throws JsonProcessingException {
        return objectMapper.readValue(str, new TypeReference<List<List<Integer>>>() {}); // JSON 문자열을 리스트로 변환
    }
}
