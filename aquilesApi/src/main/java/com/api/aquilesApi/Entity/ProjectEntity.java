package com.api.aquilesApi.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Set;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "projects")
public class ProjectEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "problem", nullable = false, length = 255)
    private String problem;

    @Column(name = "objectives", nullable = false, length = 255)
    private String objectives;

    @Column(name = "description", nullable = false, length = 255)
    private String description;

    @Column(name = "justification", nullable = false, length = 255)
    private String justification;

    //Relations
    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fk_team_scrum_id", nullable = false)
    private Teams_ScrumEntity fk_team_scrum_id;

    @OneToMany(mappedBy = "project", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<ChecklistEntity> checklistSubstantiationList;
}
