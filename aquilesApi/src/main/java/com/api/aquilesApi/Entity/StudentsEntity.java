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

    @Column(name = "id_student_sheet", nullable = false)
    private Long id_student_sheet;

    @Column(name = "id_state", nullable = false)
    private Long id_state;

    @Column(name = "id_person", nullable = false)
    private Long id_person;

    // Cambia "document_number" a "documentNumber"
    @Column(name = "document_number", nullable = false)
    private Long documentNumber; // Usa notación camelCase aquí

    // Cambiar mappedBy para que apunte a la propiedad "student" en AttendancesEntity
    @OneToMany(mappedBy = "student", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<AttendancesEntity> attendanceSet;
    //
    @OneToMany(mappedBy = "fk_idStudent", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<Follow_upsEntity> follow_upSet;
    //
    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_team_scrum_id", referencedColumnName = "team_scrum_id")
    private Teams_ScrumEntity fk_team_scrum_id;
}
