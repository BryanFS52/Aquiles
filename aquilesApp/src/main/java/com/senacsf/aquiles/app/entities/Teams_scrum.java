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
@Table(name = "teams_scrum")
public class Teams_scrum implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_scrum_id", nullable = false)
    private Long team_scrum_id;

    @Column(name = "name_project", nullable = false, length = 100)
    private String nameProject;

    @OneToMany(mappedBy = "fk_team_scrum_id", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Students> studentSet;

    @OneToMany(mappedBy = "fk_team_scrum_id", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Project> projectSet;


}
