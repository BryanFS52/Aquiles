package com.senacsf.aquiles.app.entities; // Declara el paquete al que pertenece esta clase

import jakarta.persistence.*; // Importa las anotaciones de JPA
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable; // Importa la interfaz Serializable para la serialización de objetos
import java.util.List; // Importa la clase List de java.util para manejar colecciones
import java.util.Set; // Importa la clase Set de java.util para manejar colecciones sin duplicados

@Entity
@Table(name = "teams_scrum")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"studentList", "projectList"})
public class Teams_scrum implements Serializable { // Implementa la interfaz Serializable para la serialización de objetos

    @Id // Indica que esta propiedad es la clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Generación automática de valores para la clave primaria
    @Column(name = "team_scrum_id", nullable = false) // Mapea esta propiedad a una columna en la tabla con restricción de no nulo
    private Long team_scrum_id; // Propiedad que representa el ID del equipo scrum

    @NotNull(message = "Project name cannot be null")
    @Size(max = 100, message = "Project name cannot exceed 100 characters")
    @Column(name = "name_project", nullable = false, length = 100) // Mapea esta propiedad a una columna en la tabla con restricciones de no nulo y longitud máxima de 100 caracteres
    private String nameProject; // Propiedad que representa el nombre del proyecto

    @OneToMany(mappedBy = "fk_team_scrum_id", fetch = FetchType.LAZY, cascade = CascadeType.ALL) // Mapea esta propiedad a una relación uno a muchos con la entidad Students
    private List<Students> studentList; // Lista de estudiantes asociados a este equipo scrum

    @OneToMany(mappedBy = "fk_team_scrum_id", fetch = FetchType.LAZY, cascade = CascadeType.ALL) // Mapea esta propiedad a una relación uno a muchos con la entidad Project
    private List<Project> projectList; // Lista de proyectos asociados a este equipo scrum
}
