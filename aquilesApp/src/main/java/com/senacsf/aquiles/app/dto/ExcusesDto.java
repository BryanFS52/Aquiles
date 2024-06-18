package com.senacsf.aquiles.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExcusesDto {
    private Long excuse_id;
    private String excuse_description;
    private String excuse_document;
}
