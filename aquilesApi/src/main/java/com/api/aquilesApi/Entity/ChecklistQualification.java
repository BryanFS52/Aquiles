package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "checklist_qualifications")
public class ChecklistQualification implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "qualification_state", nullable = false)
    private Boolean qualificationState;

    @Column(name = "observations")
    private String observations;

    // Relations
    // 1. Relation (M-1) with item
    @ManyToOne
    @JoinColumn(name = "item_id", nullable = false)
    private Item item;

    // 2. Relation (M-1) with teamScrum
    @ManyToOne
    @JoinColumn(name = "team_scrum_id", nullable = false)
    private TeamsScrum teamsScrum;

    // 3. Relation (M-1) with checklist
    @ManyToOne
    @JoinColumn(name = "checklist_id", nullable = false)
    private Checklist checklist;

}