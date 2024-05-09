package com.senacsf.aquiles.app.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Set;

@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "checklist_substantiation_list")
public class ChecklistSubstantiationList implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "check_list_id", nullable = false)
    private Long checkListId;

    @Column(name = "trimester", nullable = false)
    private Long trimester;

    @Column(name = "item", nullable = false, length = 255)
    private String item;

    @Column(name = "observations", nullable = false, length = 255)
    private String observations;

    @Column(name = "rating", nullable = false)
    private boolean rating;

    @Column(name = "team_scrum_id", nullable = false)
    private Long teamScrumId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_project_id", nullable = false)
    private Project project;

    @OneToMany(mappedBy = "checklistSubstantiationList", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<JuriesChecklistSubstantiationList> juriesChecklistSubstantiationList;
}
