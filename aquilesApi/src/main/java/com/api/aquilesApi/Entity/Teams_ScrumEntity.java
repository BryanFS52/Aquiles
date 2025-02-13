package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.antlr.v4.runtime.misc.NotNull;

import java.io.Serializable;
import java.util.List;

@Entity
@Table(name = "teams_scrum")
@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = {"studentList", "projectList"})
public class Teams_ScrumEntity implements Serializable {

    @Id // Indica que esta propiedad es la clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Generación automática de valores para la clave primaria
    @Column(name = "team_scrum_id", nullable = false) // Mapea esta propiedad a una columna en la tabla con restricción de no nulo
    private Long teamScrumId; // Propiedad que representa el ID del equipo scrum

    @Column(name = "name_project", nullable = false, length = 100) // Mapea esta propiedad a una columna en la tabla con restricciones de no nulo y longitud máxima de 100 caracteres
    private String nameProject; // Propiedad que representa el nombre del proyecto

    @OneToMany(mappedBy = "fk_team_scrum_id", fetch = FetchType.LAZY, cascade = CascadeType.ALL) // Mapea esta propiedad a una relación uno a muchos con la entidad Students
    private List<StudentsEntity> studentList; // Lista de estudiantes asociados a este equipo scrum

    @OneToMany(mappedBy = "fk_team_scrum_id", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<ProjectEntity> projectList; // Lista de proyectos asociados a este equipo scrum
}
