package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@ToString(exclude = {"studentList", "projectList"})
@Entity
@Table(name = "team_scrum")  // Define el nombre de la tabla en la base de datos
public class TeamScrum implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_scrum_id", nullable = false)
    private Long teamScrumId; // Propiedad que representa el ID del equipo scrum

    @Column(name = "name_project", nullable = false)
    private String nameProject; // Propiedad que representa el nombre del proyecto

    // Relación uno a muchos con Student: un equipo puede tener varios estudiantes
    @OneToMany(mappedBy = "teamScrum", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Student> studentList; // Lista de estudiantes asociados a este equipo scrum

    // Relación muchos a muchos con Project: un equipo puede estar asociado con varios proyectos
    @ManyToMany
    @JoinTable(
            name = "team_scrum_project",  // Nombre de la tabla intermedia
            joinColumns = @JoinColumn(name = "team_scrum_id"),
            inverseJoinColumns = @JoinColumn(name = "project_id")
    )
    private List<Project> projectList; // Lista de proyectos asociados a este equipo scrum
}
