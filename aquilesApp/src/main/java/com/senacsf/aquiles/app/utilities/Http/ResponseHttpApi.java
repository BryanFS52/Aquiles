package com.senacsf.aquiles.app.utilities.Http;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.util.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseHttpApi {
    private Boolean processNegOK;

    private Boolean ProcessServOK;

    public static String message;

    private Object data;

    //Find All Response
    public static Map<String, Object> responseHttpFind(String result, Object data, HttpStatus codeMessage, int
            page, int size){

        Map<String,Object> response = new HashMap<>();
        response.put("date",new Date());
        response.put("code",codeMessage.value());
        response.put("message",result);
        response.put("data",data);
        response.put("page",page);
        response.put("size",size);
        return response;

    }
    public static Map<String, Object> responseHttpFind(String result, Object data, HttpStatus codeMessage){

        Map<String,Object> response = new HashMap<>();
        response.put("date",new Date());
        response.put("code",codeMessage.value());
        response.put("message",result);
        response.put("data",data);
        return response;

    }

    //Post Response
    public static Map<String,Object> responseHttpPost(String result, HttpStatus codeMessage){

        Map<String, Object> response = new HashMap<>();
        response.put("date",new Date());
        response.put("code",codeMessage.value());
        response.put("message",result);
        return response;

    }

    //Put Response
    public static Map<String,Object> responseHttpPut(String result, HttpStatus codeMessage){

        Map<String,Object> response = new HashMap<>();
        response.put("date",new Date());
        response.put("code",codeMessage.value());
        response.put("message",result);
        return response;

    }

    //Delete Response
    public static Map<String,Object> responseHttpDelete(String result, HttpStatus codeMessage){

        Map<String,Object> response = new HashMap<>();

        response.put("date",new Date());
        response.put("code",codeMessage.value());
        response.put("message",result);

        return response;

    }

    //Error Response
    public static Map<String,Object> responseHttpError(String result,HttpStatus codeMessage,String data){

        Map<String,Object> response = new HashMap<>();

        response.put("date",new Date());
        response.put("code",codeMessage.value());
        response.put("message",result);
        response.put("title",data);

        return response;

    }
}
