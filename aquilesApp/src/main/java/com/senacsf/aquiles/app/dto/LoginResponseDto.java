package com.senacsf.aquiles.app.dto;

import lombok.Data;

@Data
public class LoginResponseDto {
    private Long idPerson;
    private String name;
    private String lastName;
    private String documentNumber;
    private String rol;

    private String redirectUrl;
}