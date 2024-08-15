package com.senacsf.aquiles.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainersDto {
    private Long trainer_id;
    private Boolean triner_state;
    private Long id_person;
    private BigInteger document_number;
}
