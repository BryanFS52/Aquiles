package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@NoArgsConstructor
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
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_project_id", nullable = false)
    private ProjectEntity project;

    @ManyToMany(mappedBy = "list_checklistSubstantiationLists", cascade = CascadeType.PERSIST)
    private List<JuriesEntity> juries;
}
