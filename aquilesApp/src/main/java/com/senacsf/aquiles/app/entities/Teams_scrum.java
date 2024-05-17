package com.senacsf.aquiles.app.entities; // Declara el paquete al que pertenece esta clase

import jakarta.persistence.*; // Importa las anotaciones de JPA
import lombok.Getter; // Importa la anotación Getter de Lombok
import lombok.NoArgsConstructor; // Importa la anotación NoArgsConstructor de Lombok
import lombok.Setter; // Importa la anotación Setter de Lombok

import java.io.Serializable; // Importa la interfaz Serializable para la serialización de objetos
import java.util.Set; // Importa la clase Set de java.util para manejar colecciones sin duplicados

@NoArgsConstructor // Anotación de Lombok para generar un constructor sin argumentos
@Entity // Indica que esta clase es una entidad JPA
@Getter // Anotación de Lombok para generar getters automáticos
@Setter // Anotación de Lombok para generar setters automáticos
@Table(name = "teams_scrum") // Especifica el nombre de la tabla en la base de datos
public class Teams_scrum implements Serializable { // Implementa la interfaz Serializable para la serialización de objetos

    @Id // Indica que esta propiedad es la clave primaria
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Generación automática de valores para la clave primaria
    @Column(name = "team_scrum_id", nullable = false) // Mapea esta propiedad a una columna en la tabla con restricción de no nulo
    private Long team_scrum_id; // Propiedad que representa el ID del equipo scrum

    @Column(name = "name_project", nullable = false, length = 100) // Mapea esta propiedad a una columna en la tabla con restricciones de no nulo y longitud máxima de 100 caracteres
    private String nameProject; // Propiedad que representa el nombre del proyecto

    @OneToMany(mappedBy = "fk_team_scrum_id", fetch = FetchType.LAZY, cascade = CascadeType.ALL) // Mapea esta propiedad a una relación uno a muchos con la entidad Students
    private Set<Students> studentSet; // Conjunto de estudiantes asociados a este equipo scrum

    @OneToMany(mappedBy = "fk_team_scrum_id", fetch = FetchType.LAZY, cascade = CascadeType.ALL) // Mapea esta propiedad a una relación uno a muchos con la entidad Project
    private Set<Project> projectSet; // Conjunto de proyectos asociados a este equipo scrum
}
