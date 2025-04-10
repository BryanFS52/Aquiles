package com.api.aquilesApi.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;
import java.util.List;

@NoArgsConstructor
@ToString(exclude = {"studentList", "projectList"})
@Getter
@Setter
@Entity
@Table(name = "teams")
public class Teams_ScrumEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "members", nullable = false, length = 200)
    private  String members;

    // Relations
    @OneToMany(mappedBy = "fk_team_scrum_id", fetch = FetchType.LAZY, cascade = CascadeType.ALL) // Mapea esta propiedad a una relación uno a muchos con la entidad Students
    private List<StudentsEntity> studentList;

    @OneToMany(mappedBy = "fk_team_scrum_id", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<ProjectEntity> projectList;
}
