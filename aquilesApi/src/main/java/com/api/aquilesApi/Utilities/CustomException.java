package com.api.aquilesApi.Utilities;

import org.springframework.http.HttpStatus;

public class CustomException extends RuntimeException{
    public CustomException(String message, HttpStatus badRequest){
            super(message);
    }
}
