package com.api.aquilesApi.Utilities;

import org.springframework.http.HttpStatus;

public class CustomException extends RuntimeException {

    private final HttpStatus status;

    public CustomException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}


/*
package com.api.aquilesApi.Utilities;

import org.springframework.http.HttpStatus;

public class CustomException extends RuntimeException {
    // Atributo para almacenar el código de estado HTTP
    private final HttpStatus status;

    // Constructor para aceptar el mensaje y el código de estado HTTP
    public CustomException(String message, HttpStatus status) {
        super(message);  // Llama al constructor de RuntimeException con el mensaje
        this.status = status;  // Almacena el código de estado HTTP
    }

    // Metodo para obtener el código de estado HTTP
    public HttpStatus getStatus() {
        return status;
    }
}
*/