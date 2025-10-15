package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "checklist")
public class Checklist implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Columns
    @Column(name = "state", nullable = false)
    private Boolean state;

    @Column(name = "remarks", nullable = false, length = 255)
    private String remarks;

    @Column(name = "instructor_signature", nullable = false)
    private byte[] instructorSignature;

    @Column(name = "evaluation_criteria", nullable = false)
    private boolean evaluationCriteria;

    @Column(name = "date_assigned", length = 30)
    private LocalDate dateAssigned;

    @Column(name = "study_sheets", length = 500)
    private String studySheets;

    @Column(name = "trimester", length = 50)
    private String trimester;

    @Column(name = "component", length = 100)
    private String component;

    @Column(name = "training_project_id")
    private Long trainingProjectId;

    // Relations
    // 1.Relation (1-M) con item
    @OneToMany(mappedBy = "checklist", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Item> items;

    // 2.Relation (1-1) con evaluations
    @OneToOne(mappedBy = "checklist", cascade = CascadeType.ALL, orphanRemoval = true)
    private Evaluation evaluation;

    // 3.Relation (M-M) con teamsScrum
    @ManyToMany
    @JoinTable(
            name = "checklist_teams",
            joinColumns = @JoinColumn(name = "checklist_id"),
            inverseJoinColumns = @JoinColumn(name = "team_id")
    )
    private List<TeamsScrum> teamsScrum;

    // 4.Relation (1-M) con learningOutcome
    @Column(name = "learningOutcome_id")
    private Long LearningOutcome;

    // 5.Relation (1-M) con juries
    @OneToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "checklist_juries",
            joinColumns = @JoinColumn(name = "checklist_id"),
            inverseJoinColumns = @JoinColumn(name = "jury_id"))
    private List<Juries> juries;

}