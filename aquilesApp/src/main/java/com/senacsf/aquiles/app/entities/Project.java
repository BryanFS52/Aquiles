package com.senacsf.aquiles.app.entities;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.Set;

@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "projects")
@AllArgsConstructor
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_team_scrum_id", nullable = false)
    private Teams_scrum fk_team_scrum_id;

    @Column(name = "justification", nullable = false, length = 255)
    private String justification;

    @OneToMany(mappedBy = "project", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<ChecklistSubstantiationList> checklistSubstantiationList;
}