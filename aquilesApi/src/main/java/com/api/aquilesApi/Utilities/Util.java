package com.api.aquilesApi.Utilities;

import org.apache.poi.ss.usermodel.DataFormatter;
import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Component
public class Util {

    private final ModelMapper modelMapper = new ModelMapper();

    public JSONObject getData(Map<String, Object> json){
        JSONObject jsonObject = new JSONObject(json);
        return jsonObject.getJSONObject("data");
    }

    public LocalDate convertDate(String dateString) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return LocalDate.parse(dateString, formatter);
    }

    public static String methodName(){
        StackTraceElement[] stackTrace = Thread.currentThread().getStackTrace();
        return stackTrace[3].getMethodName();
    }

    /*public void mapperIdPerson(){
        modelMapper.typeMap(Person.class, PersonDTO.class).addMappings(mapper -> {
            mapper.map(src -> src.getPersonKey().getId(),
                    (dest, v) -> dest.getPersonKey().setId((Long) v));
            mapper.map(src -> src.getPersonKey().getDocument(),
                    (dest, v) -> dest.getPersonKey().setDocument((Long) v));
        });
    }*/
}
