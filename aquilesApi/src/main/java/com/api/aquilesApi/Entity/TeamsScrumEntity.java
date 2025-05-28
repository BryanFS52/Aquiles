package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.io.Serializable;
import java.util.ArrayList;
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
    private String members;

    @Column(name = "fk_idStudent")
    private Long studentList;

    // Relations
    // 1.Relation (M-1) con Checklist
    @ManyToOne
    @JoinColumn(name = "checklist_id", nullable = true)
    private ChecklistEntity checklist;

    // 2.Relation (1-M) con Project
    @OneToMany(mappedBy = "fk_team_scrum_id", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<ProjectEntity> projectList;

    // 3. Relation (M-M) con apprentice
    // Guardas solo los IDs de los usuarios
    @ElementCollection
    @CollectionTable(
            name = "team_scrum_members",
            joinColumns = @JoinColumn(name = "team_id")
    )
    @Column(name = "user_id")
    private List<Long> memberIds = new ArrayList<>();
}