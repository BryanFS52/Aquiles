package com.api.aquilesApi.Dto;

import jakarta.validation.constraints.*;
        import lombok.*;

        import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudySheetDTO {

    private Long id;

    @NotNull(message = "El número es obligatorio")
    private Integer number;

    private Integer num;

    @NotNull(message = "El número de estudiantes es obligatorio")
    private Integer numberStudents;

    @NotNull(message = "La fecha de inicio lectiva es obligatoria")
    private Date startLective;

    @NotNull(message = "La fecha de fin lectiva es obligatoria")
    private Date endLective;

    @NotNull(message = "El estado es obligatorio")
    private Boolean state;

    private Date createdAt;
    private Date updatedAt;

    /*
    // Relaciones
    @NotNull(message = "La oferta es obligatoria")
    private OfferDTO offer;

    @NotNull(message = "La jornada es obligatoria")
    private JourneyDTO journey;

    @NotNull(message = "El trimestre es obligatorio")
    private QuarterDTO quarter;

    @NotNull(message = "El proyecto formativo es obligatorio")
    private TrainingProjectDTO trainingProject;

     */
}
