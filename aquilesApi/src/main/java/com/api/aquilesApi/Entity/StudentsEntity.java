package com.api.aquilesApi.Entity;

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
public class StudentsEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id", nullable = false)
    private Long student_id;

    // Columns
    @Column(name = "id_student_sheet", nullable = false)
    private Long id_student_sheet;

    @Column(name = "id_state", nullable = false)
    private Long id_state;

    @Column(name = "id_person", nullable = false)
    private Long id_person;

    @Column(name = "document_number", nullable = false)
    private Long documentNumber;

    // Relations
    @OneToMany(mappedBy = "student", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<AttendancesEntity> attendanceSet;

    @OneToMany(mappedBy = "fk_idStudent", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Follow_upsEntity> follow_upSet;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_team_scrum_id")
    private TeamsScrumEntity fk_team_scrum_id;

}