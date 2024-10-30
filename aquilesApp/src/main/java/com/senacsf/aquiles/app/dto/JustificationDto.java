package com.senacsf.aquiles.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JustificationDto {
    private Long justification_id;
    private String justification_description;
    private String justification_document;
}