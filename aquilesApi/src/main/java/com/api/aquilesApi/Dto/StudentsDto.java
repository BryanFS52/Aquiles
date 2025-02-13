package com.api.aquilesApi.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentsDto {
    private Long student_id;
    private Long id_student_sheet;
    private Long id_state;
    private Long id_person;
    private Long document_number;
}
