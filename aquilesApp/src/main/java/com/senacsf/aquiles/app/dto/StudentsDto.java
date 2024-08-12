package com.senacsf.aquiles.app.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class StudentsDto {

    private Long student_id;
    private Long id_student_sheet;
    private Long id_state;
    private Long id_person;
    private Long document_number;

}
