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
@Table(name = "students")
public class Students implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id", nullable = false)
    private Long student_id;

    @Column(name = "id_student_sheet", nullable = false)
    private Long id_student_sheet;

    @Column(name = "id_state", nullable = false)
    private Long id_state;

    @Column(name = "id_person", nullable = false)
    private Long id_person;

    @Column(name = "document_number", nullable = false)
    private Long document_number;

    @OneToMany(mappedBy = "fk_idStudent", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Attendances> attendanceSet;

    @OneToMany(mappedBy = "fk_idStudent", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Follow_ups> follow_upSet;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_team_scrum_id", referencedColumnName = "team_scrum_id")
    private Teams_scrum fk_team_scrum_id;
}
