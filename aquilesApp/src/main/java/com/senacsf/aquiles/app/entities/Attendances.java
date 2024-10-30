package com.senacsf.aquiles.app.entities;

import jakarta.persistence.*;
import jdk.jfr.Timestamp;
import jdk.jshell.Snippet;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.Date;

@NoArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "attendances")
public class Attendances implements Serializable {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attendance_id", nullable = false)
    private Long attendance_id;

    @Timestamp
    @Column(name = "attendance_date", nullable = false)
    private Date attendance_date;


    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_idJustification", referencedColumnName = "justification_id")
    private Justification fk_idJustification;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_trainer_id", referencedColumnName = "trainer_id")
    private Trainers fk_trainer_id;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_idStudent", referencedColumnName = "student_id")
    private Students fk_idStudent;

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "fk_stateAttendance_id", referencedColumnName = "stateAttendance_id")
    private stateAttendance fk_stateAttendance; // Debe ser un ManyToOne en lugar de OneToOne si hay muchos estados
}
