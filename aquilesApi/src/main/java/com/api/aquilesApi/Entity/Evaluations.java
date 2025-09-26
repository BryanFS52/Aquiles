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
@Table(name = "evaluations")
public class Evaluations implements Serializable {
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

    // Relación uno a uno con Checklist - Esta evaluación pertenece a un único checklist
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "checklist_id", nullable = false, unique = true)
    private Checklist checklist;

    // Campo para asociar la evaluación a un team scrum específico
    @ManyToOne
    @JoinColumn(name = "team_scrum_id")
    private TeamsScrum teamsScrum;




}