package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrainersDto {
    private Long trainerId;
    private Boolean trainerState;
    private Long idPerson;
    private BigInteger documentNumber;
}

