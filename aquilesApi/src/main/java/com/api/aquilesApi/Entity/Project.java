package com.api.aquilesApi.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Set;

@NoArgsConstructor
@Getter
@Setter
@Entity  // Asegúrate de que esta anotación esté presente para que JPA reconozca la clase como una entidad
@Table(name = "projects")
public class Project implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "description", nullable = false, length = 255)
    private String description;

    @Column(name = "problem", nullable = false, length = 255)
    private String problem;

    @Column(name = "objectives", nullable = false, length = 255)
    private String objectives;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fk_team_scrum_id", nullable = false)
    private TeamScrum fk_team_scrum_id;

    @Column(name = "justification", nullable = false, length = 255)
    private String justification;

    @OneToMany(mappedBy = "project", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<ChecklistSubstantiationList> checklistSubstantiationList;
}
