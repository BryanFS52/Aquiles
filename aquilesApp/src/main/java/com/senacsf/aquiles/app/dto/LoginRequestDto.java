package com.senacsf.aquiles.app.dto;

import lombok.Data;

@Data
public class LoginRequestDto {
    private String documentType;
    private String documentNumber;
    private String password;
}