package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "projects")
public class    ProjectEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Columns
    @Column(name = "problem", nullable = false, length = 255)
    private String problem;

    @Column(name = "objectives", nullable = false, length = 255)
    private String objectives;

    @Column(name = "description", nullable = false, length = 255)
    private String description;

    @Column(name = "justification", nullable = false, length = 255)
    private String justification;

    @Column(name = "members", nullable = false)
    private String members;

    // Relations
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fk_team_scrum_id", nullable = true)
    private TeamsScrumEntity fk_team_scrum_id;

}