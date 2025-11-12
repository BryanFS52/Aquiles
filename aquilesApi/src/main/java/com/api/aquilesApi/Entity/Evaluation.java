package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "evaluations", 
    uniqueConstraints = @UniqueConstraint(
        name = "uk_evaluation_checklist_team", 
        columnNames = {"checklist_id", "team_scrum_id"}
    )
)
public class Evaluation implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Columns
    @Column(name = "observations")
    private String observations;

    @Column(name = "recommendations", length = 255)
    private String recommendations;

    @Column(name = "value_judgment", nullable = false, length = 60)
    private String valueJudgment;

    // Relación muchos a uno con Checklist - Múltiples evaluaciones pueden pertenecer al mismo checklist
    // (una por cada team scrum)
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "checklist_id", nullable = false)
    private Checklist checklist;

    // Campo para asociar la evaluación a un team scrum específico (obligatorio)
    @ManyToOne
    @JoinColumn(name = "team_scrum_id", nullable = false)
    private TeamsScrum teamsScrum;




}