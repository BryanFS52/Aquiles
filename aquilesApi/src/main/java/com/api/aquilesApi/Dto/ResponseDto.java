package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class ResponseDto {
    private Long id;
    private String code;
    private String message;
    private String date;

}
