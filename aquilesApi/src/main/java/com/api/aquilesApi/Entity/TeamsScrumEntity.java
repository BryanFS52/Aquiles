package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"studentList", "projectList"})
@Getter
@Setter
@Entity
@Table(name = "teams")
public class TeamsScrumEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Columns
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "members", nullable = false, length = 200)
    private  String members;

    // Relations
    // 1.Relation (M-1) con Checklist
    @ManyToOne
    @JoinColumn(name = "checklist_id", nullable = false)
    private ChecklistEntity checklist;

    @OneToMany(mappedBy = "fk_team_scrum_id", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<StudentsEntity> studentList;

    @OneToMany(mappedBy = "fk_team_scrum_id", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<ProjectEntity> projectList;

    @ManyToOne
    @JoinColumn(name = "team_scrum_id")
    private TeamsScrumEntity teamScrum;
}