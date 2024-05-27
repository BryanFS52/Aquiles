package com.senacsf.aquiles.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiarySustainationsDto {

    private Long diaryId;
    private Timestamp dateTime;
    private String place;
}
