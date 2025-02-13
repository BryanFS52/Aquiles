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
@Table(name = "checklist_substantiation_list")
public class ChecklistSubstantiationListEntity implements Serializable {
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
    private ProjectEntity project;

    @ManyToMany(mappedBy = "list_checklistSubstantiationLists", cascade = CascadeType.PERSIST)
    private List<JuriesEntity> juries;
}
