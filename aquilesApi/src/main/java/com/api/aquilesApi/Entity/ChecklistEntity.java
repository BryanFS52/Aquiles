package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "checklist")
public class ChecklistEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Columns
    @Column(name = "state", nullable = false)
    private Boolean state;

    @Column(name = "remarks", nullable = false, length = 255)
    private String remarks;

    @Column(name = "instructor_signature", nullable = false, length = 255)
    private String instructorSignature;

    @Column(name = "evaluation_criteria", nullable = false)
    private boolean evaluationCriteria;

    @Column(name = "checklist_history", nullable = false)
    private String checklistHistory;

    // Relations
    // (Error)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private ProjectEntity associatedProject;

    // 1.Relation (M-M) con juries
    @ManyToMany
    @JoinTable(
            name = "checklist_jury",
            joinColumns = @JoinColumn(name = "checklist_id"),
            inverseJoinColumns = @JoinColumn(name = "jury_id")
    )
    private Set<JuriesEntity> juries = new HashSet<>();

    // 2.Relation (1-M) con item
    @OneToMany(mappedBy = "checklist", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemEntity> items;

    // 3.Relation (1-1) con evaluations
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "evaluation_id", referencedColumnName = "id")
    private EvaluationsEntity evaluation;

    // 4.Relation (1-M) con Team
    @OneToMany(mappedBy = "checklist", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TeamsScrumEntity> teams;

    // 5.Relation (1-M) con learningOutcome (Model)
    @OneToMany(mappedBy = "checklist", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LearningOutcomeEntity> learningOutcomes;

}