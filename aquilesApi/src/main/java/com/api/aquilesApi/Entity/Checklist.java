package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Entity
@Getter
@Setter
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

    @Lob
    @Column(name = "instructor_signature", nullable = false)
    private byte [] instructorSignature;

    @Column(name = "evaluation_criteria", nullable = false)
    private boolean evaluationCriteria;

    @Column(name = "date_assigned", length = 30)
    private Date dateAssigned;

    @Column(name = "study_sheets")
    private Long studySheets;

    @Column(name = "evaluations")
    private Long evaluations;

    @Column(name = "trimester", length = 50)
    private String trimester;

    @Column(name = "component", length = 100)
    private String component;

    // Relations

    // 1.Relation (1-M) con item
    @OneToMany(mappedBy = "checklist", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Item> items;

    // 2.Relation (1-1) con evaluations
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "evaluation_id", referencedColumnName = "id")
    private Evaluations evaluation;

    // 3.Relation (1-M) con Team
    @OneToMany(mappedBy = "checklist", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TeamsScrum> teams;

    // 4.Relation (1-M) con learningOutcome
    @Column(name = "learningOutcome_id")
    private Long LearningOutcome;

    // 5.Relation (1-M) con juries
    @OneToMany(cascade = CascadeType.ALL)
    @JoinTable(name = "checklist_juries",
            joinColumns = @JoinColumn(name = "checklist_id"),
            inverseJoinColumns = @JoinColumn(name = "jury_id"))
    private List<Juries> juries;

    // 6.Relation (1-M) con teamsScrum
    @OneToMany(mappedBy = "checklist", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TeamsScrum> teamsScrum;
}